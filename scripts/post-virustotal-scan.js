'use strict';
/**
 * Posts a live VirusTotal verdict card for the current PRO + FREE installers.
 *
 * Hashes each installer, looks the hash up on VirusTotal, uploads the build if
 * VirusTotal has never seen it, waits for the verdict, then posts one embed to
 * the virus-detection channel.
 *
 * Credentials come from .env.virustotal (gitignored):
 *   VIRUSTOTAL_API_KEY
 *   DISCORD_VIRUS_WEBHOOK_URL
 *
 * Usage:
 *   node scripts/post-virustotal-scan.js
 *   node scripts/post-virustotal-scan.js --dry-run   (scan only, no Discord post)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');

const INSTALLERS = [
  {
    key: 'pro',
    name: 'REFLUX PRO',
    pkg: 'C:\\! REFLUX PRO TWEAKING UTILITY\\package.json',
    file: 'C:\\! REFLUX PRO TWEAKING UTILITY\\dist\\REFLUX-PRO-v1.0-Setup.exe',
  },
  {
    key: 'free',
    name: 'REFLUX FREE',
    pkg: 'C:\\! REFLUX FREE TWEAKING UTILITY\\package.json',
    file: 'C:\\! REFLUX FREE TWEAKING UTILITY\\dist-free\\REFLUX-FREE-Setup.exe',
  },
];

/** Live REFLUX server emoji IDs — not secrets. */
const EMOJI = {
  status: '<:status:1531470762672783380>',
  hammer: '<:hammer1:1531470925118312612>',
  pro: '<:RefluxPro:1529594517811101868>',
  free: '<:Reflux:1529595110801674464>',
};

const CLEAN_GREEN = 0x3dd68c;
const FLAGGED_RED = 0xe74c3c;

const VT_API = 'https://www.virustotal.com/api/v3';
/** Free tier allows 4 requests/minute — keep 16s between calls. */
const VT_MIN_GAP_MS = 16000;
let lastVtCall = 0;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[line.slice(0, i).trim()] = v;
  }
  return out;
}

function env() {
  return {
    ...loadEnvFile(path.join(ROOT, '.env.local')),
    ...loadEnvFile(path.join(ROOT, '.env.virustotal')),
    ...process.env,
  };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function vtFetch(apiKey, url, options = {}) {
  const gap = Date.now() - lastVtCall;
  if (lastVtCall && gap < VT_MIN_GAP_MS) await wait(VT_MIN_GAP_MS - gap);
  lastVtCall = Date.now();
  return fetch(url, {
    ...options,
    headers: { 'x-apikey': apiKey, accept: 'application/json', ...(options.headers || {}) },
  });
}

function sha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

/** malicious+suspicious over every engine that returned a verdict. */
function ratioFromStats(stats) {
  const s = stats || {};
  const flagged = (s.malicious || 0) + (s.suspicious || 0);
  const total =
    flagged + (s.undetected || 0) + (s.harmless || 0) + (s.timeout || 0);
  return { flagged, total, malicious: s.malicious || 0, suspicious: s.suspicious || 0 };
}

async function lookupByHash(apiKey, hash) {
  const res = await vtFetch(apiKey, `${VT_API}/files/${hash}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`VirusTotal lookup failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return json?.data?.attributes || null;
}

async function uploadFile(apiKey, filePath) {
  const size = fs.statSync(filePath).size;
  let target = `${VT_API}/files`;
  // Anything over 32MB has to go through a one-time upload URL.
  if (size > 32 * 1024 * 1024) {
    const urlRes = await vtFetch(apiKey, `${VT_API}/files/upload_url`);
    if (!urlRes.ok) {
      throw new Error(`Could not get upload URL (${urlRes.status}): ${(await urlRes.text()).slice(0, 200)}`);
    }
    target = (await urlRes.json())?.data;
    if (!target) throw new Error('VirusTotal returned no upload URL');
  }

  const form = new FormData();
  form.append('file', await fs.openAsBlob(filePath), path.basename(filePath));
  const res = await vtFetch(apiKey, target, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const id = (await res.json())?.data?.id;
  if (!id) throw new Error('VirusTotal returned no analysis id');
  return id;
}

async function waitForAnalysis(apiKey, analysisId, maxMinutes = 20) {
  const deadline = Date.now() + maxMinutes * 60 * 1000;
  while (Date.now() < deadline) {
    const res = await vtFetch(apiKey, `${VT_API}/analyses/${analysisId}`);
    if (res.ok) {
      const attrs = (await res.json())?.data?.attributes || {};
      console.log(`    analysis status: ${attrs.status}`);
      if (attrs.status === 'completed') return attrs.stats || null;
    } else {
      console.log(`    poll returned ${res.status}`);
    }
    await wait(20000);
  }
  throw new Error('VirusTotal analysis did not finish in time');
}

async function scanInstaller(apiKey, item) {
  if (!fs.existsSync(item.file)) {
    throw new Error(`Installer not found — build it first: ${item.file}`);
  }
  const version = JSON.parse(fs.readFileSync(item.pkg, 'utf8')).version;
  console.log(`\n${item.name} v${version}`);
  console.log(`  hashing ${path.basename(item.file)}…`);
  const hash = await sha256(item.file);
  console.log(`  sha256 ${hash}`);

  let attrs = await lookupByHash(apiKey, hash);
  let stats = attrs?.last_analysis_stats || null;

  if (!stats) {
    console.log('  VirusTotal has not seen this build — uploading (this takes a few minutes)…');
    const analysisId = await uploadFile(apiKey, item.file);
    stats = await waitForAnalysis(apiKey, analysisId);
  } else {
    console.log('  already scanned — using stored verdict');
  }

  const ratio = ratioFromStats(stats);
  console.log(`  verdict: ${ratio.flagged}/${ratio.total} flagged`);
  return {
    ...item,
    version,
    hash,
    ...ratio,
    reportUrl: `https://www.virustotal.com/gui/file/${hash}`,
  };
}

function buildEmbed(results) {
  const anyFlagged = results.some((r) => r.flagged > 0);
  const lines = [`${EMOJI.status} **Every build is scanned before release.**`, ''];

  for (const r of results) {
    const emoji = r.key === 'pro' ? EMOJI.pro : EMOJI.free;
    const verdict = r.flagged === 0 ? 'Clean' : `${r.flagged} detection(s)`;
    lines.push(`${emoji} **${r.name} \`v${r.version}\`**`);
    lines.push(`${EMOJI.hammer} **${r.flagged} / ${r.total}** security vendors flagged this file — **${verdict}**`);
    lines.push(`[View the full VirusTotal report](${r.reportUrl})`);
    lines.push(`\`SHA-256 ${r.hash}\``);
    lines.push('');
  }

  lines.push(
    anyFlagged
      ? '_A detection here is usually a false positive from the system tweaks, but check the report._'
      : '_Verify it yourself — the hash above is the exact file you download._',
  );

  return {
    username: 'REFLUX Security',
    embeds: [
      {
        title: `${EMOJI.status} VirusTotal Scan Results ${EMOJI.hammer}`,
        color: anyFlagged ? FLAGGED_RED : CLEAN_GREEN,
        description: lines.join('\n'),
        footer: { text: 'Scanned by VirusTotal · refluxtweaks.com' },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

async function postToDiscord(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Discord rejected the card (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const e = env();
  const apiKey = String(e.VIRUSTOTAL_API_KEY || '').trim();
  const webhook = String(e.DISCORD_VIRUS_WEBHOOK_URL || '').trim();

  if (!apiKey || apiKey === '[SENSITIVE]') {
    console.error('FAIL: VIRUSTOTAL_API_KEY missing — add it to .env.virustotal');
    process.exit(2);
  }
  if (!dryRun && !/^https:\/\/(discord|discordapp)\.com\/api\/webhooks\//i.test(webhook)) {
    console.error('FAIL: DISCORD_VIRUS_WEBHOOK_URL missing or not a Discord webhook URL.');
    console.error('      Add it to .env.virustotal, or pass --dry-run to scan without posting.');
    process.exit(2);
  }

  const results = [];
  for (const item of INSTALLERS) {
    results.push(await scanInstaller(apiKey, item));
  }

  const payload = buildEmbed(results);

  if (dryRun) {
    console.log('\n--- DRY RUN, nothing posted ---');
    console.log(payload.embeds[0].description);
    return;
  }

  await postToDiscord(webhook, payload);
  console.log('\nOK: virus detection card posted');
}

main().catch((err) => {
  console.error('FAIL:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
