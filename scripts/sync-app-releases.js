'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'app-releases.json');

const FREE_PKG = 'C:\\! REFLUX FREE TWEAKING UTILITY\\package.json';
const PRO_PKG = 'C:\\! REFLUX PRO TWEAKING UTILITY\\package.json';
const RELEASE_RED = 0xe74c3c;

function readPkg(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function formatProLabel(version) {
  return `REFLUX PRO v${String(version || '1.0.0').trim()}`;
}

function formatFreeLabel(version, productName) {
  const base = productName || 'REFLUX FREE';
  return `${base} v${String(version || '1.0.0').trim()}`;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[line.slice(0, i).trim()] = v;
  }
  return out;
}

function releaseWebhookUrlFromEnv() {
  const env = {
    ...process.env,
    ...loadEnvFile(path.join(ROOT, '.env.local')),
    ...loadEnvFile(path.join(ROOT, '.env.webhook-pull')),
  };
  return String(
    env.DISCORD_RELEASE_WEBHOOK_URL ||
      env.REFLUX_RELEASE_WEBHOOK_URL ||
      env.DISCORD_LICENSE_WEBHOOK_URL ||
      env.REFLUX_LICENSES_UPDATE_WEBHOOK_URL ||
      '',
  ).trim();
}

function versionLine(from, to) {
  if (from && from !== to) return `\`${from}\` → **\`${to}\`**`;
  return `**\`${to}\`**`;
}

function postDiscordRelease({ pro, free, note }) {
  const url = releaseWebhookUrlFromEnv();
  if (!url) {
    console.log('[discord] skipped release share — DISCORD_RELEASE_WEBHOOK_URL not set');
    return Promise.resolve({ ok: false, skipped: true });
  }

  const summary = [
    pro ? `PRO → ${pro.to}` : null,
    free ? `FREE → ${free.to}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const fields = [];
  if (pro) {
    fields.push({ name: 'PRO', value: versionLine(pro.from, pro.to), inline: false });
    if (pro.downloadUrl) {
      fields.push({ name: 'PRO installer', value: String(pro.downloadUrl).slice(0, 300), inline: false });
    }
  } else {
    fields.push({ name: 'PRO', value: '— (unchanged)', inline: false });
  }
  if (free) {
    fields.push({ name: 'FREE', value: versionLine(free.from, free.to), inline: false });
    if (free.downloadUrl) {
      fields.push({ name: 'FREE installer', value: String(free.downloadUrl).slice(0, 300), inline: false });
    }
  } else {
    fields.push({ name: 'FREE', value: '— (unchanged)', inline: false });
  }
  if (note) fields.push({ name: 'Note', value: String(note).slice(0, 300), inline: false });
  fields.push({ name: 'Source', value: 'sync-app-releases', inline: true });

  const body = JSON.stringify({
    username: 'REFLUX Releases',
    embeds: [
      {
        title: 'New REFLUX build live',
        color: RELEASE_RED,
        description: summary || 'Installer / deployment update',
        fields,
        footer: { text: 'reflux-releases · red webhook' },
        timestamp: new Date().toISOString(),
      },
    ],
  });

  return new Promise((resolve) => {
    try {
      const target = new URL(url);
      const lib = target.protocol === 'https:' ? https : http;
      const req = lib.request(
        {
          method: 'POST',
          hostname: target.hostname,
          path: target.pathname + target.search,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          res.resume();
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode });
        },
      );
      req.on('error', (err) => resolve({ ok: false, error: err.message }));
      req.write(body);
      req.end();
    } catch (err) {
      resolve({ ok: false, error: err instanceof Error ? err.message : 'discord failed' });
    }
  });
}

async function main() {
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
  const freePkg = readPkg(FREE_PKG);
  const proPkg = readPkg(PRO_PKG);

  const manifest = {
    free: {
      version: freePkg.version,
      label: formatFreeLabel(freePkg.version, freePkg.productName || freePkg.build?.productName),
      downloadUrl: 'https://www.refluxtweaks.com/downloads/REFLUX-FREE-Setup.exe',
      message: 'A new version of REFLUX FREE is ready. Please install the new version.',
    },
    pro: {
      version: proPkg.version,
      label: formatProLabel(proPkg.version),
      downloadUrl: 'https://www.refluxtweaks.com/account',
      message: 'A new version of REFLUX PRO is ready. Please install the new version from your account.',
    },
  };

  fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${OUT}`);
  console.log(JSON.stringify(manifest, null, 2));

  const freeChanged = !prev || prev.free?.version !== manifest.free.version;
  const proChanged = !prev || prev.pro?.version !== manifest.pro.version;

  if (!freeChanged && !proChanged) {
    console.log('[discord] no version change — skipping release share');
    return;
  }

  const result = await postDiscordRelease({
    pro: proChanged
      ? {
          from: prev?.pro?.version || null,
          to: manifest.pro.version,
          label: manifest.pro.label,
          downloadUrl: manifest.pro.downloadUrl,
        }
      : null,
    free: freeChanged
      ? {
          from: prev?.free?.version || null,
          to: manifest.free.version,
          label: manifest.free.label,
          downloadUrl: manifest.free.downloadUrl,
        }
      : null,
    note: 'app-releases.json updated',
  });

  if (result.ok) console.log('[discord] shared red release card (PRO + FREE)');
  else if (result.skipped) console.log('[discord] skipped');
  else console.warn('[discord] share failed:', result.status || result.error);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
