import { postLicenseDiscordWebhook } from "./discord-webhook";
import type { LicenseAlertEvent, LicenseAlertPayload } from "./types";

/** In-memory debounce so session spam does not flood Discord (resets on cold start). */
const recent = new Map<string, number>();

function debounceKey(event: LicenseAlertEvent, payload: LicenseAlertPayload): string {
  return [
    event,
    String(payload.licenseKey || "").slice(0, 24),
    String(payload.hwid || "").slice(0, 16),
    String(payload.email || "").toLowerCase().slice(0, 40),
  ].join("|");
}

function shouldSkip(event: LicenseAlertEvent, payload: LicenseAlertPayload): boolean {
  // Never debounce explicit tests or deploy shares
  if (event === "test" || event === "deployed") return false;
  // Session alerts: at most once per key+device per 12 hours
  const windowMs = event === "session" ? 12 * 60 * 60 * 1000 : 45 * 1000;
  const key = debounceKey(event, payload);
  const last = recent.get(key) || 0;
  if (Date.now() - last < windowMs) return true;
  recent.set(key, Date.now());
  // Cap map size
  if (recent.size > 2000) {
    const first = recent.keys().next().value;
    if (first) recent.delete(first);
  }
  return false;
}

/**
 * Notify Discord about a license lifecycle event.
 * Safe to call without await — never blocks license flows.
 */
export async function notifyLicenseUpdate(
  payload: LicenseAlertPayload,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  try {
    if (!payload?.event) return { ok: false, error: "missing event" };
    if (shouldSkip(payload.event, payload)) {
      return { ok: true, skipped: true };
    }
    return await postLicenseDiscordWebhook(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "notify failed";
    console.error("[reflux-licenses-update] notify error:", message);
    return { ok: false, error: message };
  }
}

export function notifyLicenseUpdateFireAndForget(payload: LicenseAlertPayload): void {
  void notifyLicenseUpdate(payload);
}

export type { LicenseAlertEvent, LicenseAlertPayload, VersionChange };
export { licenseAlertsConfigured, releaseAlertsConfigured } from "./discord-webhook";
export { postReleaseDiscordWebhook } from "./discord-webhook";
