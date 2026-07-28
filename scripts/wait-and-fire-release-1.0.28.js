'use strict';
const fs = require('fs');
const path = require('path');

async function waitForDeploy(timeoutMs = 7 * 60 * 1000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch('https://www.refluxtweaks.com/app-releases.json', {
        cache: 'no-store',
      });
      const json = await res.json();
      console.log(`live PRO=${json.pro?.version} FREE=${json.free?.version}`);
      if (json.pro?.version === '1.0.28' && json.free?.version === '1.0.19') return true;
    } catch (err) {
      console.log('wait:', err instanceof Error ? err.message : String(err));
    }
    await new Promise((r) => setTimeout(r, 15000));
  }
  return false;
}

async function main() {
  const ready = await waitForDeploy();
  if (!ready) {
    console.error('DEPLOY_NOT_READY');
    process.exit(2);
  }

  const secretPath = path.join(__dirname, '..', '.reflux-ops-secret.tmp');
  if (!fs.existsSync(secretPath)) {
    console.error('MISSING_OPS_SECRET');
    process.exit(3);
  }
  const secret = fs.readFileSync(secretPath, 'utf8').trim();
  fs.unlinkSync(secretPath);

  const res = await fetch('https://www.refluxtweaks.com/api/reflux-licenses-update/release', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      proFrom: '1.0.27',
      freeFrom: '1.0.18',
      proTo: '1.0.28',
      freeTo: '1.0.19',
      proFixes:
        'First-run click tutorial with blurred background and red arrows that walks you through creating a safety backup before you continue.',
      freeFixes:
        'First-run click tutorial with blurred background and red arrows that walks you through creating a safety backup before you continue.',
    }),
  });
  const text = await res.text();
  console.log('STATUS ' + res.status);
  console.log(text.slice(0, 500));
  process.exit(res.ok ? 0 : 1);
}

main().catch((err) => {
  console.error('FAIL', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
