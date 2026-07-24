'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'app-releases.json');

const FREE_PKG = 'C:\\! REFLUX FREE TWEAKING UTILITY\\package.json';
const PRO_PKG = 'C:\\! REFLUX PRO TWEAKING UTILITY\\package.json';

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

function webhookUrlFromEnv() {
  const env = {
    ...process.env,
    ...loadEnvFile(path.join(ROOT, '.env.local')),
    ...loadEnvFile(path.join(ROOT, '.env.webhook-pull')),
  };
  return String(env.DISCORD_LICENSE_WEBHOOK_URL || env.REFLUX_LICENSES_UPDATE_WEBHOOK_URL || '').trim();
}

function postDiscordDeploy(payload) {
  const url = webhookUrlFromEnv();
  if (!url) {
    console.log('[discord] skipped deploy share — DISCORD_LICENSE_WEBHOOK_URL not set');
    return Promise.resolve({ ok: false, skipped: true });
  }

  const body = JSON.stringify({
    username: 'REFLUX Licenses Update',
    embeds: [
      {
        title: '🚀 New installer / deployment',
        color: 0xa78bfa,
        fields: [
          { name: 'Product', value: String(payload.product || 'REFLUX'), inline: true },
          { name: 'Version', value: String(payload.version || '—'), inline: true },
          { name: 'Label', value: String(payload.label || '—'), inline: false },
          {
            name: 'Installer / link',
            value: String(payload.downloadUrl || '—').slice(0, 300),
            inline: false,
          },
          { name: 'Note', value: String(payload.note || 'app-releases.json updated'), inline: false },
          { name: 'Source', value: 'sync-app-releases', inline: true },
        ],
        footer: { text: 'reflux-licenses-update · webhook only (no bot)' },
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

  const changes = [];
  if (!prev || prev.free?.version !== manifest.free.version) {
    changes.push({
      product: 'REFLUX FREE',
      version: manifest.free.version,
      label: manifest.free.label,
      downloadUrl: manifest.free.downloadUrl,
      note: prev ? `FREE ${prev.free?.version || '?'} → ${manifest.free.version}` : 'Initial FREE manifest',
    });
  }
  if (!prev || prev.pro?.version !== manifest.pro.version) {
    changes.push({
      product: 'REFLUX PRO',
      version: manifest.pro.version,
      label: manifest.pro.label,
      downloadUrl: manifest.pro.downloadUrl,
      note: prev ? `PRO ${prev.pro?.version || '?'} → ${manifest.pro.version}` : 'Initial PRO manifest',
    });
  }

  if (!changes.length) {
    console.log('[discord] no version change — skipping deploy share');
    return;
  }

  for (const change of changes) {
    const result = await postDiscordDeploy(change);
    if (result.ok) console.log(`[discord] shared ${change.product} ${change.version}`);
    else if (result.skipped) console.log('[discord] skipped');
    else console.warn('[discord] share failed:', result.status || result.error);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
