'use strict';
const fs = require('fs');
const path = require('path');

async function waitForDeploy(timeoutMs = 10 * 60 * 1000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch('https://www.refluxtweaks.com/app-releases.json', {
        cache: 'no-store',
      });
      const json = await res.json();
      console.log(`live PRO=${json.pro?.version} FREE=${json.free?.version}`);
      if (json.pro?.version === '1.0.29' && json.free?.version === '1.0.20') return true;
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
      proFrom: '1.0.28',
      freeFrom: '1.0.19',
      proTo: '1.0.29',
      freeTo: '1.0.20',
      proFixes:
        'Auto profile on launch — your custom hardware profile re-applies itself every time you open the app. Cleaner boxes, dark red branding, and an Auto Profile status banner on Home.',
      freeFixes:
        'Light auto profile on launch — clears temp files, flushes DNS, and preps Game Mode when you open the app. Recycle Bin stays manual. Cleaner Home tiles.',
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
