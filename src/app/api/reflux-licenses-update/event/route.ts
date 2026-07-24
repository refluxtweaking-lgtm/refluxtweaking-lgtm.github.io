import { NextResponse } from "next/server";
import { verifyAppSyncToken } from "@/lib/app-sync-token";
import { verifyKeyAuthLicenseExists } from "@/lib/keyauth";
import { notifyLicenseUpdate, type LicenseAlertEvent } from "@/lib/reflux-licenses-update";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED: LicenseAlertEvent[] = [
  "issued",
  "activated",
  "session",
  "expired",
  "transferred",
];

/**
 * PRO app (and internal callers) report license lifecycle events.
 * Discord webhook URL stays on the server — never in the desktop build.
 *
 * Auth: valid app sync token, OR license key that exists in KeyAuth (key-only users).
 */
export async function POST(request: Request) {
  const ipLimit = await rateLimit(`licenses-update:ip:${clientIp(request)}`, 60, 15 * 60);
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
  if (!ALLOWED.includes(event)) {
    return NextResponse.json({ success: false, message: "Unknown event." }, { status: 400 });
  }

  const licenseKey = String(body.licenseKey || "").trim();
  const hwid = String(body.hwid || "").trim();
  let email = String(body.email || "").trim().toLowerCase() || null;

  const session = body.token ? verifyAppSyncToken(body.token) : null;
  if (session?.email) {
    email = session.email;
  } else if (licenseKey) {
    const exists = await verifyKeyAuthLicenseExists(licenseKey);
    if (!exists.ok) {
      return NextResponse.json(
        { success: false, message: "Could not verify license for alerts." },
        { status: 401 },
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: "Sign in or provide a valid license key." },
      { status: 401 },
    );
  }

  const result = await notifyLicenseUpdate({
    event,
    licenseKey: licenseKey || null,
    email,
    plan: body.plan || null,
    hwid: hwid || null,
    accessExpiresAt: body.accessExpiresAt ?? null,
    activatedAt: body.activatedAt ?? null,
    note: body.note || null,
    source: body.source || "api",
  });

  return NextResponse.json({
    success: true,
    delivered: !!result.ok && !result.skipped,
    skipped: !!result.skipped,
  });
}

export async function GET() {
  return NextResponse.json({
    system: "reflux-licenses-update",
    mode: "discord-webhook-only",
    ok: true,
  });
}
