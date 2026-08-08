'use strict';
/**
 * Fires the release announcement, then the VirusTotal verdict card.
 *
 * Versions come from public/app-releases.json, so this script does not need to
 * be copied per release. Pass the previous versions to show a `from -> to` line.
 *
 * Needs the ops secret (env wins over the temp file):
 *   $env:REFLUX_OPS_SECRET="…"      or   .reflux-ops-secret.tmp
 *
 * Usage:
 *   node scripts/fire-release.js --pro-from=1.0.30 --free-from=1.0.21
 *   node scripts/fire-release.js --skip-virustotal
 *   node scripts/fire-release.js --virustotal-only
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(ROOT, 'public', 'app-releases.json');
const SECRET_FILE = path.join(ROOT, '.reflux-ops-secret.tmp');
const SITE = 'https://www.refluxtweaks.com';

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3).trim() : null;
}
const has = (name) => process.argv.includes(`--${name}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function readManifest() {
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const proTo = String(m.pro?.version || '').trim();
  const freeTo = String(m.free?.version || '').trim();
  if (!proTo || !freeTo) throw new Error('app-releases.json is missing a version');
  return { proTo, freeTo, proFixes: m.pro?.message || '', freeFixes: m.free?.message || '' };
}

function resolveSecret() {
  const fromEnv = String(process.env.REFLUX_OPS_SECRET || '').trim();
  if (fromEnv) return { secret: fromEnv, source: 'env' };
  const fromFile = fs.existsSync(SECRET_FILE)
    ? fs.readFileSync(SECRET_FILE, 'utf8').trim()
    : '';
  if (fromFile) return { secret: fromFile, source: 'file' };
  return { secret: '', source: 'none' };
}

async function waitForDeploy({ proTo, freeTo }, timeoutMs = 10 * 60 * 1000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${SITE}/app-releases.json`, { cache: 'no-store' });
      const json = await res.json();
      console.log(`live PRO=${json.pro?.version} FREE=${json.free?.version}`);
      if (json.pro?.version === proTo && json.free?.version === freeTo) return true;
    } catch (err) {
      console.log('wait:', err instanceof Error ? err.message : String(err));
    }
    await wait(15000);
  }
  return false;
}

async function postReleaseCard(manifest, secret) {
  const res = await fetch(`${SITE}/api/reflux-licenses-update/release`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proFrom: arg('pro-from'),
      freeFrom: arg('free-from'),
      proTo: manifest.proTo,
      freeTo: manifest.freeTo,
      proFixes: manifest.proFixes,
      freeFixes: manifest.freeFixes,
    }),
  });
  const text = await res.text();
  console.log(`release card STATUS ${res.status}`);
  console.log(text.slice(0, 300));
  return res.ok;
}

function runVirusTotal() {
  return new Promise((resolve) => {
    console.log('\n--- VirusTotal scan (uploads can take several minutes) ---');
    const child = spawn(process.execPath, [path.join(__dirname, 'post-virustotal-scan.js')], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    child.on('close', (code) => resolve(code === 0));
  });
}

async function main() {
  const manifest = readManifest();
  console.log(`manifest PRO=${manifest.proTo} FREE=${manifest.freeTo}`);

  if (has('virustotal-only')) {
    process.exit((await runVirusTotal()) ? 0 : 1);
  }

  const { secret, source } = resolveSecret();
  if (!secret) {
    console.error('MISSING_OPS_SECRET — set $env:REFLUX_OPS_SECRET or save it into .reflux-ops-secret.tmp');
    process.exit(3);
  }
  console.log(`using secret from ${source} (length ${secret.length})`);

  if (!(await waitForDeploy(manifest))) {
    console.error('DEPLOY_NOT_READY — the live manifest never matched the local one');
    process.exit(2);
  }

  const released = await postReleaseCard(manifest, secret);
  if (!released) {
    // Keep the secret so a retry does not need it pasted again.
    process.exit(1);
  }
  if (source === 'file' && fs.existsSync(SECRET_FILE)) fs.unlinkSync(SECRET_FILE);

  if (has('skip-virustotal')) {
    console.log('\nskipping VirusTotal card (--skip-virustotal)');
    return;
  }
  const scanned = await runVirusTotal();
  if (!scanned) {
    console.warn('\nRelease card went out, but the VirusTotal card failed.');
    console.warn('Retry just that part with: node scripts/fire-release.js --virustotal-only');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('FAIL:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
