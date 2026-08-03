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

/** Live REFLUX server emoji IDs — always used unless env overrides with a real tag/ID. */
const DEFAULTS = {
  hammer1: '<:hammer1:1531470925118312612>',
  status: '<:status:1531470762672783380>',
  RefluxPro: '<:RefluxPro:1529594517811101868>',
  Reflux: '<:Reflux:1529595110801674464>',
};

function resolveEmoji(envValue, name) {
  const raw = String(envValue || '').trim();
  if (!raw || raw === '[SENSITIVE]' || raw === '[encrypted]') return DEFAULTS[name];
  if (raw.startsWith('<') && raw.endsWith('>')) return raw;
  if (/^\d{5,}$/.test(raw)) return `<:${name}:${raw}>`;
  return raw;
}

const e = {
  hammer: resolveEmoji(process.env.DISCORD_EMOJI_HAMMER1, 'hammer1'),
  status: resolveEmoji(process.env.DISCORD_EMOJI_STATUS, 'status'),
  pro: resolveEmoji(process.env.DISCORD_EMOJI_REFLUX_PRO, 'RefluxPro'),
  free: resolveEmoji(process.env.DISCORD_EMOJI_REFLUX, 'Reflux'),
};

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
const freeFixes =
  process.env.REFLUX_RELEASE_FREE_FIXES ||
  manifest.free?.message ||
  '';
const proFixes =
  process.env.REFLUX_RELEASE_PRO_FIXES ||
  manifest.pro?.message ||
  '';

function line(from, to) {
  if (from && from !== to) return `\`${from}\` → \`${to}\``;
  return `\`${to}\``;
}

const lines = [`${e.status} **New builds are live**`, ''];

if (manifest.free?.version) {
  lines.push(`${e.free} **REFLUX FREE updated to \`${manifest.free.version}\`**`);
  lines.push(line(prevFree, manifest.free.version));
  if (freeFixes) {
    lines.push(`${e.hammer} **What's new**`);
    lines.push(String(freeFixes).slice(0, 400));
  }
  lines.push('');
}

if (manifest.pro?.version) {
  lines.push(`${e.pro} **REFLUX PRO updated to \`${manifest.pro.version}\`**`);
  lines.push(line(prevPro, manifest.pro.version));
  if (proFixes) {
    lines.push(`${e.hammer} **What's new**`);
    lines.push(String(proFixes).slice(0, 400));
  }
  lines.push('');
}

while (lines.length && lines[lines.length - 1] === '') lines.pop();

const body = JSON.stringify({
  username: 'REFLUX Releases',
  embeds: [
    {
      title: `${e.status} REFLUX Update ${e.hammer}`,
      color: 0xe74c3c,
      description: lines.join('\n'),
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
