import type { LicenseAlertEvent, LicenseAlertPayload, VersionChange } from "./types";
import { formatWhen, maskEmail, maskLicenseKey, shortHwid } from "./format";
import { discordEmojis } from "./discord-emojis";

/** Strong red for the separate releases webhook. */
const RELEASE_RED = 0xe74c3c;

const EVENT_META: Record<
  Exclude<LicenseAlertEvent, "deployed">,
  { title: string; color: number; emoji: string }
> = {
  issued: { title: "License issued", color: 0x5ec4ef, emoji: "🆕" },
  activated: { title: "License activated", color: 0x3dd68c, emoji: "✅" },
  session: { title: "License in use", color: 0xf15b50, emoji: "▶️" },
  expired: { title: "License ended", color: 0xf87171, emoji: "⛔" },
  transferred: { title: "License moved to new PC", color: 0xfbbf24, emoji: "💻" },
  test: { title: "Webhook test", color: 0x94a3b8, emoji: "🧪" },
};

function licenseWebhookUrl(): string {
  return (
    process.env.DISCORD_LICENSE_WEBHOOK_URL?.trim() ||
    process.env.REFLUX_LICENSES_UPDATE_WEBHOOK_URL?.trim() ||
    ""
  );
}

function releaseWebhookUrl(): string {
  return (
    process.env.DISCORD_RELEASE_WEBHOOK_URL?.trim() ||
    process.env.REFLUX_RELEASE_WEBHOOK_URL?.trim() ||
    ""
  );
}

export function licenseAlertsConfigured(): boolean {
  return Boolean(licenseWebhookUrl());
}

export function releaseAlertsConfigured(): boolean {
  return Boolean(releaseWebhookUrl());
}

function formatVersionLine(change?: VersionChange | null, fallbackVersion?: string | null): string {
  if (change?.to) {
    const from = change.from ? String(change.from) : null;
    const to = String(change.to);
    if (from && from !== to) return `\`${from}\` → \`${to}\``;
    return `\`${to}\``;
  }
  if (fallbackVersion) return `\`${fallbackVersion}\``;
  return "—";
}

function productUpdated(change?: VersionChange | null): boolean {
  if (!change?.to) return false;
  const from = change.from ? String(change.from) : null;
  const to = String(change.to);
  return !from || from !== to;
}

function buildProductReleaseBlock(opts: {
  emoji: string;
  name: string;
  change?: VersionChange | null;
  notes?: string | null;
  hammer: string;
}): string[] {
  const { emoji, name, change, notes, hammer } = opts;
  if (!productUpdated(change)) return [];
  const to = String(change!.to);
  const from = change?.from ? String(change.from) : null;
  const lines = [
    `${emoji} **REFLUX ${name} updated to \`${to}\`**`,
    from && from !== to ? `${formatVersionLine(change)}` : `Version \`${to}\``,
  ];
  const detail = String(notes || "").trim();
  if (detail) {
    lines.push(`${hammer} **What's new**`);
    lines.push(detail.slice(0, 400));
  }
  return lines;
}

function buildReleaseDescription(payload: LicenseAlertPayload): string {
  const e = {
    hammer: discordEmojis.hammer(),
    status: discordEmojis.status(),
    pro: discordEmojis.refluxPro(),
    free: discordEmojis.refluxFree(),
  };

  const legacyFixes = String(payload.fixes || payload.note || "").trim();
  const freeNotes = String(payload.freeFixes || "").trim() || (productUpdated(payload.free) ? legacyFixes : "");
  const proNotes = String(payload.proFixes || "").trim() || (productUpdated(payload.pro) ? legacyFixes : "");

  const freeBlock = buildProductReleaseBlock({
    emoji: e.free,
    name: "FREE",
    change: payload.free,
    notes: freeNotes,
    hammer: e.hammer,
  });
  const proBlock = buildProductReleaseBlock({
    emoji: e.pro,
    name: "PRO",
    change: payload.pro,
    notes: proNotes,
    hammer: e.hammer,
  });

  const lines: string[] = [`${e.status} **New builds are live**`, ""];

  if (freeBlock.length) {
    lines.push(...freeBlock);
    lines.push("");
  }
  if (proBlock.length) {
    lines.push(...proBlock);
    lines.push("");
  }

  if (!freeBlock.length && !proBlock.length) {
    lines.push(`${e.pro} **PRO** · _unchanged_`);
    lines.push(`${e.free} **FREE** · _unchanged_`);
    if (legacyFixes) {
      lines.push("");
      lines.push(`${e.hammer} **What's new**`);
      lines.push(legacyFixes.slice(0, 500));
    }
  }

  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines.join("\n");
}

function buildLicenseFields(
  payload: LicenseAlertPayload,
): Array<{ name: string; value: string; inline: boolean }> {
  if (payload.event === "test") {
    return [
      {
        name: "Message",
        value: String(payload.note || "This is a test").slice(0, 500),
        inline: false,
      },
      { name: "Time", value: formatWhen(Date.now()), inline: true },
      { name: "Source", value: String(payload.source || "test").slice(0, 80), inline: true },
    ];
  }

  const plan = String(payload.plan || "unknown").toLowerCase();
  const fields = [
    { name: "Key", value: `\`${maskLicenseKey(payload.licenseKey)}\``, inline: true },
    { name: "Plan", value: plan, inline: true },
    { name: "Account", value: maskEmail(payload.email), inline: true },
    { name: "Device", value: `\`${shortHwid(payload.hwid)}\``, inline: true },
    { name: "Used / event time", value: formatWhen(Date.now()), inline: true },
    {
      name: "Ends",
      value: plan === "lifetime" ? "Lifetime" : formatWhen(payload.accessExpiresAt),
      inline: true,
    },
  ];
  if (payload.activatedAt) {
    fields.push({ name: "Activated at", value: formatWhen(payload.activatedAt), inline: true });
  }
  if (payload.note) {
    fields.push({ name: "Note", value: String(payload.note).slice(0, 200), inline: false });
  }
  if (payload.source) {
    fields.push({ name: "Source", value: String(payload.source).slice(0, 80), inline: true });
  }
  return fields;
}

async function postToDiscord(
  url: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[reflux-discord] webhook failed:", res.status, text.slice(0, 200));
      return { ok: false, error: `Discord ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "webhook failed";
    console.error("[reflux-discord] webhook error:", message);
    return { ok: false, error: message };
  }
}

/** License channel — never used for red release cards. */
export async function postLicenseDiscordWebhook(
  payload: LicenseAlertPayload,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (payload.event === "deployed") {
    return postReleaseDiscordWebhook(payload);
  }

  const url = licenseWebhookUrl();
  if (!url) return { ok: false, skipped: true, error: "DISCORD_LICENSE_WEBHOOK_URL not set" };

  const meta = EVENT_META[payload.event as Exclude<LicenseAlertEvent, "deployed">] || EVENT_META.session;
  return postToDiscord(url, {
    username: "REFLUX Licenses Update",
    content: payload.event === "test" ? String(payload.note || "This is a test").slice(0, 500) : undefined,
    embeds: [
      {
        title: `${meta.emoji} ${meta.title}`,
        color: meta.color,
        fields: buildLicenseFields(payload),
        footer: { text: "reflux-licenses-update · webhook only (no bot)" },
        timestamp: new Date().toISOString(),
      },
    ],
  });
}

/** Separate red releases channel — PRO + FREE versions. */
export async function postReleaseDiscordWebhook(
  payload: LicenseAlertPayload,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const url = releaseWebhookUrl();
  if (!url) {
    // Fall back to license webhook so ships still notify if release URL isn't set yet
    const fallback = licenseWebhookUrl();
    if (!fallback) {
      return { ok: false, skipped: true, error: "DISCORD_RELEASE_WEBHOOK_URL not set" };
    }
  }

  const target = releaseWebhookUrl() || licenseWebhookUrl();
  const hammer = discordEmojis.hammer();
  const status = discordEmojis.status();

  return postToDiscord(target, {
    username: "REFLUX Releases",
    embeds: [
      {
        title: `${status} REFLUX Update ${hammer}`,
        color: RELEASE_RED,
        description: buildReleaseDescription(payload),
      },
    ],
  });
}
