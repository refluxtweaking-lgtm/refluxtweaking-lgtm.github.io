'use strict';
/**
 * Load DISCORD_LICENSE_WEBHOOK_URL from .env.webhook-pull / .env.local and post a test.
 * Does not print the webhook URL.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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

const root = path.join(__dirname, '..');
const env = {
  ...loadEnvFile(path.join(root, '.env.local')),
  ...loadEnvFile(path.join(root, '.env.webhook-pull')),
};

const url =
  (env.DISCORD_LICENSE_WEBHOOK_URL || env.REFLUX_LICENSES_UPDATE_WEBHOOK_URL || '').trim();

if (!url) {
  console.error('FAIL: DISCORD_LICENSE_WEBHOOK_URL not set');
  process.exit(1);
}

if (!/^https:\/\/(discord|discordapp)\.com\/api\/webhooks\/\d+\//i.test(url)) {
  console.error('FAIL: webhook value is not a full Discord webhook URL');
  console.error('hint: paste the full URL from Discord → Integrations → Webhooks → Copy Webhook URL');
  console.error('valueLen=' + url.length);
  process.exit(1);
}

const message = process.argv.slice(2).join(' ').trim() || 'This is a test';
const body = JSON.stringify({
  username: 'REFLUX Licenses Update',
  content: message,
  embeds: [
    {
      title: '🧪 Webhook test',
      color: 0x94a3b8,
      fields: [
        { name: 'Message', value: message.slice(0, 500), inline: false },
        { name: 'Source', value: 'local-diagnose-script', inline: true },
      ],
      footer: { text: 'reflux-licenses-update · webhook only (no bot)' },
      timestamp: new Date().toISOString(),
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
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        console.log('OK: Discord accepted the test (status ' + res.statusCode + ')');
        console.log('Check your license webhook channel for: "' + message + '"');
        process.exit(0);
      }
      console.error('FAIL: Discord status ' + res.statusCode);
      console.error((data || '').slice(0, 300));
      process.exit(1);
    });
  },
);
req.on('error', (err) => {
  console.error('FAIL: ' + err.message);
  process.exit(1);
});
req.write(body);
req.end();
