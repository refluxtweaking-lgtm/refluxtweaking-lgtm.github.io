/**
 * Custom Discord emojis for release / license webhooks.
 *
 * Defaults are the live REFLUX server emoji IDs (not secrets).
 * Env can override with a full <:name:id> tag or numeric ID.
 *
 *   DISCORD_EMOJI_HAMMER1=<:hammer1:…>
 *   DISCORD_EMOJI_STATUS=<:status:…>
 *   DISCORD_EMOJI_REFLUX_PRO=<:RefluxPro:…>
 *   DISCORD_EMOJI_REFLUX=<:Reflux:…>
 */
const DEFAULTS = {
  hammer1: "<:hammer1:1531470925118312612>",
  status: "<:status:1531470762672783380>",
  RefluxPro: "<:RefluxPro:1529594517811101868>",
  Reflux: "<:Reflux:1529595110801674464>",
} as const;

function resolveEmoji(envValue: string | undefined, name: keyof typeof DEFAULTS): string {
  const raw = String(envValue || "").trim();
  // Sensitive / encrypted pulls from Vercel must not wipe real defaults
  if (!raw || raw === "[SENSITIVE]" || raw === "[encrypted]") {
    return DEFAULTS[name];
  }
  if (raw.startsWith("<") && raw.endsWith(">")) return raw;
  if (/^\d{5,}$/.test(raw)) return `<:${name}:${raw}>`;
  if (/^:[^:]+:$/.test(raw)) return raw;
  return raw;
}

export const discordEmojis = {
  hammer: () => resolveEmoji(process.env.DISCORD_EMOJI_HAMMER1, "hammer1"),
  status: () => resolveEmoji(process.env.DISCORD_EMOJI_STATUS, "status"),
  refluxPro: () => resolveEmoji(process.env.DISCORD_EMOJI_REFLUX_PRO, "RefluxPro"),
  refluxFree: () => resolveEmoji(process.env.DISCORD_EMOJI_REFLUX, "Reflux"),
};
