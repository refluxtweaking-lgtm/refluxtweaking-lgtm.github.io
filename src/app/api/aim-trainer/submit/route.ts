import { NextResponse } from "next/server";
import { upsertAimScore } from "@/lib/aim-trainer";
import { fetchLicenseByKeyAndHwid } from "@/lib/app-license-sync";
import { verifyAppSyncToken } from "@/lib/app-sync-token";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ipLimit = await rateLimit(`aim-submit:ip:${clientIp(request)}`, 20, 60 * 60);
  if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfterSec);

  let body: {
    token?: string;
    licenseKey?: string;
    hwid?: string;
    discordUsername?: string;
    score?: number;
    accuracy?: number;
    durationMs?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  let email: string | null = null;
  const session = body.token ? verifyAppSyncToken(body.token) : null;
  if (session?.email) {
    email = session.email;
  } else if (body.licenseKey && body.hwid) {
    const license = await fetchLicenseByKeyAndHwid(body.licenseKey, body.hwid);
    email = license?.email?.trim().toLowerCase() || null;
  }

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "Unlock REFLUX PRO on this PC to submit scores.",
      },
      { status: 401 },
    );
  }

  const emailLimit = await rateLimit(`aim-submit:email:${email}`, 12, 60 * 60);
  if (!emailLimit.ok) return rateLimitResponse(emailLimit.retryAfterSec);

  const result = await upsertAimScore({
    email,
    discordUsername: String(body.discordUsername || ""),
    score: Number(body.score) || 0,
    accuracy: Number(body.accuracy) || 0,
    durationMs: Number(body.durationMs) || 60000,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
