import { NextResponse } from "next/server";
import { verifyAppSyncToken } from "@/lib/app-sync-token";
import { notifyLicenseUpdate, type LicenseAlertEvent } from "@/lib/reflux-licenses-update";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Public API may only report session heartbeats. Lifecycle events fire server-side only. */
const PUBLIC_ALLOWED: LicenseAlertEvent[] = ["session"];

/**
 * PRO app reports license session heartbeats for Discord alerts.
 * Discord webhook URL stays on the server — never in the desktop build.
 *
 * Auth: valid app sync token ONLY.
 * - Does not unlock licenses
 * - Does not verify / enumerate KeyAuth keys (closed oracle)
 * - Does not accept issued/activated/expired/transferred from the public internet
 */
export async function POST(request: Request) {
  const ipLimit = await rateLimit(`licenses-update:ip:${clientIp(request)}`, 30, 15 * 60);
  if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfterSec);

  let body: {
    event?: string;
    token?: string;
    licenseKey?: string;
    email?: string;
    plan?: string;
    hwid?: string;
    accessExpiresAt?: number | string | null;
    activatedAt?: number | string | null;
    note?: string;
    source?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const event = String(body.event || "").trim() as LicenseAlertEvent;
  if (!PUBLIC_ALLOWED.includes(event)) {
    return NextResponse.json({ success: false, message: "Unknown event." }, { status: 400 });
  }

  const session = body.token ? verifyAppSyncToken(body.token) : null;
  if (!session?.email) {
    return NextResponse.json(
      { success: false, message: "Sign in required for license alerts." },
      { status: 401 },
    );
  }

  const emailKey = session.email.toLowerCase();
  const hwid = String(body.hwid || "").trim().slice(0, 128);
  const userLimit = await rateLimit(`licenses-update:user:${emailKey}:${hwid || "na"}`, 4, 12 * 60 * 60);
  if (!userLimit.ok) {
    return NextResponse.json({ success: true, delivered: false, skipped: true });
  }

  const result = await notifyLicenseUpdate({
    event,
    // Client may send a key string for masking only — never used to unlock or verify existence.
    licenseKey: String(body.licenseKey || "").trim().slice(0, 128) || null,
    email: session.email,
    plan: String(body.plan || "").trim().slice(0, 32) || null,
    hwid: hwid || null,
    accessExpiresAt: body.accessExpiresAt ?? null,
    activatedAt: body.activatedAt ?? null,
    note: body.note ? String(body.note).slice(0, 200) : null,
    source: String(body.source || "api").slice(0, 80),
  });

  return NextResponse.json({
    success: true,
    delivered: !!result.ok && !result.skipped,
    skipped: !!result.skipped,
  });
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
