/**
 * Custom Discord emojis for release / license webhooks.
 * Set full tags or numeric IDs in Vercel env:
 *
 *   DISCORD_EMOJI_HAMMER1=<:hammer1:123456789012345678>
 *   DISCORD_EMOJI_STATUS=<:status:123456789012345678>
 *   DISCORD_EMOJI_REFLUX_PRO=<:RefluxPro:123456789012345678>
 *   DISCORD_EMOJI_REFLUX=<:Reflux:123456789012345678>
 *
 * Numeric ID alone is fine — we wrap it as <:Name:ID>.
 * Without env, unicode fallbacks are used so posts still look good.
 */
function resolveEmoji(envValue: string | undefined, name: string, fallback: string): string {
  const raw = String(envValue || "").trim();
  if (!raw) return fallback;
  if (raw.startsWith("<") && raw.endsWith(">")) return raw;
  if (/^\d{5,}$/.test(raw)) return `<:${name}:${raw}>`;
  // Allow ":Name:" or "Name" passthrough for testing
  if (/^:[^:]+:$/.test(raw)) return raw;
  return raw;
}

export const discordEmojis = {
  hammer: () =>
    resolveEmoji(process.env.DISCORD_EMOJI_HAMMER1, "hammer1", "🛠️"),
  status: () =>
    resolveEmoji(process.env.DISCORD_EMOJI_STATUS, "status", "📡"),
  refluxPro: () =>
    resolveEmoji(process.env.DISCORD_EMOJI_REFLUX_PRO, "RefluxPro", "⚡"),
  refluxFree: () =>
    resolveEmoji(process.env.DISCORD_EMOJI_REFLUX, "Reflux", "🌿"),
};
