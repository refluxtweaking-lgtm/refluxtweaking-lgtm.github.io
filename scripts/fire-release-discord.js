'use strict';
/**
 * Fire a clean red release Discord card using process env webhooks.
 * Used after sync-app-releases writes the manifest.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'app-releases.json'), 'utf8'));

const url = String(
  process.env.DISCORD_RELEASE_WEBHOOK_URL ||
    process.env.REFLUX_RELEASE_WEBHOOK_URL ||
    process.env.DISCORD_LICENSE_WEBHOOK_URL ||
    '',
).trim();

if (!url || !/^https:\/\/(discord|discordapp)\.com\/api\/webhooks\//i.test(url)) {
  console.error('FAIL: no usable Discord release webhook in env');
  process.exit(1);
}

const prevPro = process.argv[2] || null;
const prevFree = process.argv[3] || null;
const fixes =
  process.env.REFLUX_RELEASE_FIXES ||
  manifest.pro?.message ||
  'Darker UI background all around for a deeper, cleaner look.';

function line(from, to) {
  if (from && from !== to) return `\`${from}\` → \`${to}\``;
  return `\`${to}\``;
}

const description = [
  `⚡ **PRO**  ${line(prevPro, manifest.pro.version)}`,
  `🌿 **FREE**  ${line(prevFree, manifest.free.version)}`,
  '',
  "🛠️ **What's fixed**",
  String(fixes).slice(0, 500),
].join('\n');

const body = JSON.stringify({
  username: 'REFLUX Releases',
  embeds: [
    {
      title: '🚀 REFLUX Update',
      color: 0xe74c3c,
      description,
    },
  ],
});

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
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('OK: Discord release card delivered');
        process.exit(0);
      }
      console.error('FAIL: Discord', res.statusCode, data.slice(0, 200));
      process.exit(1);
    });
  },
);
req.on('error', (err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
req.write(body);
req.end();
