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

/** Live REFLUX server emoji IDs — not secrets. Env can override. */
const EMOJI_DEFAULTS = {
  hammer1: '<:hammer1:1531470925118312612>',
  status: '<:status:1531470762672783380>',
  RefluxPro: '<:RefluxPro:1529594517811101868>',
  Reflux: '<:Reflux:1529595110801674464>',
};

function resolveEmoji(envValue, name) {
  const raw = String(envValue || '').trim();
  if (!raw || raw === '[SENSITIVE]' || raw === '[encrypted]') return EMOJI_DEFAULTS[name];
  if (raw.startsWith('<') && raw.endsWith('>')) return raw;
  if (/^\d{5,}$/.test(raw)) return `<:${name}:${raw}>`;
  return raw;
}

function releaseEmojis(env) {
  return {
    hammer: resolveEmoji(env.DISCORD_EMOJI_HAMMER1, 'hammer1'),
    status: resolveEmoji(env.DISCORD_EMOJI_STATUS, 'status'),
    pro: resolveEmoji(env.DISCORD_EMOJI_REFLUX_PRO, 'RefluxPro'),
    free: resolveEmoji(env.DISCORD_EMOJI_REFLUX, 'Reflux'),
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

function collectProductNotes(pkg, changed) {
  if (!changed) return '';
  return String(pkg.releaseNotes || '').trim() || DEFAULT_FIXES;
}

function postDiscordRelease({ pro, free, proFixes, freeFixes }) {
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
  const lines = [`${e.status} **New builds are live**`, ''];

  if (free) {
    lines.push(`${e.free} **REFLUX FREE updated to \`${free.to}\`**`);
    lines.push(versionLine(free.from, free.to));
    if (freeFixes) {
      lines.push(`${e.hammer} **What's new**`);
      lines.push(String(freeFixes).slice(0, 400));
    }
    lines.push('');
  }

  if (pro) {
    lines.push(`${e.pro} **REFLUX PRO updated to \`${pro.to}\`**`);
    lines.push(versionLine(pro.from, pro.to));
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

  const freeChanged = !prev || prev.free?.version !== freePkg.version;
  const proChanged = !prev || prev.pro?.version !== proPkg.version;
  const freeNotes = collectProductNotes(freePkg, freeChanged);
  const proNotes = collectProductNotes(proPkg, proChanged);

  const manifest = {
    free: {
      version: freePkg.version,
      label: formatFreeLabel(freePkg.version, freePkg.productName || freePkg.build?.productName),
      downloadUrl: 'https://www.refluxtweaks.com/downloads/REFLUX-FREE-Setup.exe',
      message: freeNotes || prev?.free?.message || DEFAULT_FIXES,
    },
    pro: {
      version: proPkg.version,
      label: formatProLabel(proPkg.version),
      downloadUrl: 'https://www.refluxtweaks.com/account',
      message: proNotes || prev?.pro?.message || DEFAULT_FIXES,
    },
  };

  fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${OUT}`);
  console.log(JSON.stringify(manifest, null, 2));

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
    proFixes: proChanged ? proNotes : '',
    freeFixes: freeChanged ? freeNotes : '',
  });

  if (result.ok) console.log('[discord] shared clean red release card');
  else if (result.skipped) console.log('[discord] skipped');
  else console.warn('[discord] share failed:', result.status || result.error);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
