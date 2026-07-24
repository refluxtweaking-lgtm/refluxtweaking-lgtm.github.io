import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import {
  notifyLicenseUpdate,
  releaseAlertsConfigured,
  licenseAlertsConfigured,
} from "@/lib/reflux-licenses-update";
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

type Body = {
  proFrom?: string | null;
  freeFrom?: string | null;
  proTo?: string | null;
  freeTo?: string | null;
  fixes?: string | null;
};

/**
 * Ops-only: post the clean red PRO/FREE release card.
 * Uses DISCORD_RELEASE_WEBHOOK_URL (falls back to license webhook).
 */
export async function POST(request: Request) {
  const ipLimit = await rateLimit(`licenses-update-release:ip:${clientIp(request)}`, 10, 60 * 60);
  if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfterSec);

  if (!releaseAlertsConfigured() && !licenseAlertsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "No Discord webhook configured.",
        hint: "Set DISCORD_RELEASE_WEBHOOK_URL (preferred) or DISCORD_LICENSE_WEBHOOK_URL.",
      },
      { status: 503 },
    );
  }

  const secret = resolveSecret();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Ops secret not configured." }, { status: 503 });
  }
  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    /* optional body */
  }

  let manifest: {
    pro?: { version?: string; message?: string };
    free?: { version?: string; message?: string };
  } = {};
  try {
    const raw = await readFile(path.join(process.cwd(), "public", "app-releases.json"), "utf8");
    manifest = JSON.parse(raw) as typeof manifest;
  } catch {
    /* body-only fallback */
  }

  const proTo = String(body.proTo || manifest.pro?.version || "").trim() || null;
  const freeTo = String(body.freeTo || manifest.free?.version || "").trim() || null;
  const fixes =
    String(body.fixes || manifest.pro?.message || manifest.free?.message || "").trim() ||
    "Darker UI background all around for a deeper, cleaner look.";

  const result = await notifyLicenseUpdate({
    event: "deployed",
    pro: proTo
      ? { from: body.proFrom ? String(body.proFrom) : null, to: proTo }
      : null,
    free: freeTo
      ? { from: body.freeFrom ? String(body.freeFrom) : null, to: freeTo }
      : null,
    fixes,
    source: "api-release",
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error || "Discord webhook failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    delivered: !result.skipped,
    pro: proTo,
    free: freeTo,
    fixes,
  });
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
