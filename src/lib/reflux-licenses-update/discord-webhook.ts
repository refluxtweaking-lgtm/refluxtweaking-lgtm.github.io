import type { LicenseAlertEvent, LicenseAlertPayload } from "./types";
import { formatWhen, maskEmail, maskLicenseKey, shortHwid } from "./format";

const EVENT_META: Record<
  LicenseAlertEvent,
  { title: string; color: number; emoji: string }
> = {
  issued: { title: "License issued", color: 0x5ec4ef, emoji: "🆕" },
  activated: { title: "License activated", color: 0x3dd68c, emoji: "✅" },
  session: { title: "License in use", color: 0xf15b50, emoji: "▶️" },
  expired: { title: "License ended", color: 0xf87171, emoji: "⛔" },
  transferred: { title: "License moved to new PC", color: 0xfbbf24, emoji: "💻" },
};

function webhookUrl(): string {
  return (
    process.env.DISCORD_LICENSE_WEBHOOK_URL?.trim() ||
    process.env.REFLUX_LICENSES_UPDATE_WEBHOOK_URL?.trim() ||
    ""
  );
}

export function licenseAlertsConfigured(): boolean {
  return Boolean(webhookUrl());
}

/** Post a Discord webhook embed. Fire-and-forget safe — never throws to callers. */
export async function postLicenseDiscordWebhook(
  payload: LicenseAlertPayload,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const url = webhookUrl();
  if (!url) return { ok: false, skipped: true, error: "DISCORD_LICENSE_WEBHOOK_URL not set" };

  const meta = EVENT_META[payload.event] || EVENT_META.session;
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

  const body = {
    username: "REFLUX Licenses Update",
    embeds: [
      {
        title: `${meta.emoji} ${meta.title}`,
        color: meta.color,
        fields,
        footer: { text: "reflux-licenses-update · webhook only (no bot)" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[reflux-licenses-update] Discord webhook failed:", res.status, text.slice(0, 200));
      return { ok: false, error: `Discord ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "webhook failed";
    console.error("[reflux-licenses-update] Discord webhook error:", message);
    return { ok: false, error: message };
  }
}
