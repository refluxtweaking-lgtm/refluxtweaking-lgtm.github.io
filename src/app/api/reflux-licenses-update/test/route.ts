import { NextResponse } from "next/server";
import { licenseAlertsConfigured, notifyLicenseUpdate } from "@/lib/reflux-licenses-update";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

function resolveSecret(): string | null {
  return (
    process.env.REFLUX_OPS_SECRET?.trim() ||
    process.env.LICENSE_UPDATE_SECRET?.trim() ||
    process.env.LICENSE_RESEND_SECRET?.trim() ||
    null
  );
}

function isAuthorized(request: Request, secret: string): boolean {
  const header =
    request.headers.get("authorization")?.trim() ??
    request.headers.get("x-reflux-ops-secret")?.trim() ??
    request.headers.get("x-license-update-secret")?.trim() ??
    "";
  if (header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim() === secret;
  }
  return header === secret;
}

/**
 * Ops-only: post a plain Discord test ("this is a test") through DISCORD_LICENSE_WEBHOOK_URL.
 * Requires REFLUX_OPS_SECRET / LICENSE_UPDATE_SECRET / LICENSE_RESEND_SECRET.
 */
export async function POST(request: Request) {
  const ipLimit = await rateLimit(`licenses-update-test:ip:${clientIp(request)}`, 5, 60 * 60);
  if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfterSec);

  if (!licenseAlertsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "DISCORD_LICENSE_WEBHOOK_URL is not set on the server.",
        hint: "Add the full Discord webhook URL in Vercel env, then redeploy.",
      },
      { status: 503 },
    );
  }

  const secret = resolveSecret();
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ops secret not configured.",
        hint: "Set REFLUX_OPS_SECRET (or LICENSE_UPDATE_SECRET) in Vercel to authorize tests.",
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let note = "This is a test";
  try {
    const body = (await request.json()) as { message?: string; note?: string };
    note = String(body.message || body.note || note).slice(0, 500);
  } catch {
    /* default message */
  }

  const result = await notifyLicenseUpdate({
    event: "test",
    note,
    source: "api-test",
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error || "Discord webhook failed",
        hint: "Check the webhook URL is a full https://discord.com/api/webhooks/... value (not truncated).",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: !result.skipped, message: note });
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
