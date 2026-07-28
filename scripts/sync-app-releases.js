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

function resolveEmoji(envValue, name, fallback) {
  const raw = String(envValue || '').trim();
  if (!raw) return fallback;
  if (raw.startsWith('<') && raw.endsWith('>')) return raw;
  if (/^\d{5,}$/.test(raw)) return `<:${name}:${raw}>`;
  return raw;
}

function releaseEmojis(env) {
  return {
    hammer: resolveEmoji(env.DISCORD_EMOJI_HAMMER1, 'hammer1', '🛠️'),
    status: resolveEmoji(env.DISCORD_EMOJI_STATUS, 'status', '📡'),
    pro: resolveEmoji(env.DISCORD_EMOJI_REFLUX_PRO, 'RefluxPro', '⚡'),
    free: resolveEmoji(env.DISCORD_EMOJI_REFLUX, 'Reflux', '🌿'),
  };
}

/** Default blurb when package.json has no releaseNotes. */
const DEFAULT_FIXES =
  'Darker UI background all around for a deeper, cleaner look.';

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
  if (from && from !== to) return `\`${from}\` → \`${to}\``;
  return `\`${to}\``;
}

function collectFixes(proPkg, freePkg, proChanged, freeChanged) {
  const bits = [];
  if (proChanged && proPkg.releaseNotes) bits.push(String(proPkg.releaseNotes).trim());
  if (freeChanged && freePkg.releaseNotes) bits.push(String(freePkg.releaseNotes).trim());
  const unique = [...new Set(bits.filter(Boolean))];
  return unique.length ? unique.join('\n') : DEFAULT_FIXES;
}

function postDiscordRelease({ pro, free, fixes }) {
  const env = {
    ...process.env,
    ...loadEnvFile(path.join(ROOT, '.env.local')),
    ...loadEnvFile(path.join(ROOT, '.env.webhook-pull')),
  };
  const url = String(
    env.DISCORD_RELEASE_WEBHOOK_URL ||
      env.REFLUX_RELEASE_WEBHOOK_URL ||
      env.DISCORD_LICENSE_WEBHOOK_URL ||
      env.REFLUX_LICENSES_UPDATE_WEBHOOK_URL ||
      '',
  ).trim();
  if (!url) {
    console.log('[discord] skipped release share — DISCORD_RELEASE_WEBHOOK_URL not set');
    return Promise.resolve({ ok: false, skipped: true });
  }

  const e = releaseEmojis(env);
  const lines = [
    `${e.status} **New build is live**`,
    '',
    `${e.pro} **PRO** · ${pro ? versionLine(pro.from, pro.to) : '_unchanged_'}`,
    `${e.free} **FREE** · ${free ? versionLine(free.from, free.to) : '_unchanged_'}`,
  ];
  if (fixes) {
    lines.push('');
    lines.push(`${e.hammer} **What's fixed**`);
    lines.push(String(fixes).slice(0, 500));
  }

  const body = JSON.stringify({
    username: 'REFLUX Releases',
    embeds: [
      {
        title: `${e.status} REFLUX Update ${e.hammer}`,
        color: RELEASE_RED,
        description: lines.join('\n'),
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

  const fixesText = collectFixes(
    proPkg,
    freePkg,
    !prev || prev.pro?.version !== proPkg.version,
    !prev || prev.free?.version !== freePkg.version,
  );

  const manifest = {
    free: {
      version: freePkg.version,
      label: formatFreeLabel(freePkg.version, freePkg.productName || freePkg.build?.productName),
      downloadUrl: 'https://www.refluxtweaks.com/downloads/REFLUX-FREE-Setup.exe',
      message: fixesText,
    },
    pro: {
      version: proPkg.version,
      label: formatProLabel(proPkg.version),
      downloadUrl: 'https://www.refluxtweaks.com/account',
      message: fixesText,
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
        }
      : null,
    free: freeChanged
      ? {
          from: prev?.free?.version || null,
          to: manifest.free.version,
        }
      : null,
    fixes: fixesText,
  });

  if (result.ok) console.log('[discord] shared clean red release card');
  else if (result.skipped) console.log('[discord] skipped');
  else console.warn('[discord] share failed:', result.status || result.error);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
