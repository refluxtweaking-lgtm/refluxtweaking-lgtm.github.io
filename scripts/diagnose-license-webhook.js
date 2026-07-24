'use strict';
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', '.env.webhook-pull');
const raw = fs.readFileSync(file, 'utf8');
const line = raw.split(/\r?\n/).find((l) => l.startsWith('DISCORD_LICENSE_WEBHOOK_URL='));
if (!line) {
  console.log('MISSING');
  process.exit(0);
}

let v = line.slice('DISCORD_LICENSE_WEBHOOK_URL='.length).trim();
if (
  (v.startsWith('"') && v.endsWith('"')) ||
  (v.startsWith("'") && v.endsWith("'"))
) {
  v = v.slice(1, -1);
}

console.log('valueLen=' + v.length);
console.log('startsDiscord=' + /^https:\/\/(discord|discordapp)\.com\/api\/webhooks\//i.test(v));
console.log('hasIdTokenShape=' + /\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+/.test(v));
console.log('looksEmpty=' + (v.length === 0));
try {
  console.log('previewHost=' + new URL(v).host);
} catch {
  console.log('previewHost=NOT_A_URL');
}
