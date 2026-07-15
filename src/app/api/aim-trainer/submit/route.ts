import { NextResponse } from "next/server";
import { freeCompetitorEmail, isFreeCompetitorEmail, upsertAimScore } from "@/lib/aim-trainer";
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
    playerId?: string;
    channel?: string;
    discordUsername?: string;
    score?: number;
    accuracy?: number;
    durationMs?: number;
    mode?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const channel = String(body.channel || "").trim().toLowerCase();
  let email: string | null = null;

  if (channel === "free") {
    // FREE compete — identity is a stable local player id (not a PRO license).
    email = freeCompetitorEmail(body.playerId || body.hwid || "");
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Could not identify this FREE player." },
        { status: 400 },
      );
    }
  } else {
    // Legacy PRO authenticated path — not used for the prize board anymore.
    const session = body.token ? verifyAppSyncToken(body.token) : null;
    if (session?.email) {
      email = session.email;
    } else if (body.licenseKey && body.hwid) {
      const license = await fetchLicenseByKeyAndHwid(body.licenseKey, body.hwid);
      email = license?.email?.trim().toLowerCase() || null;
    }
  }

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "Sign in from REFLUX FREE Aim Trainer to submit scores.",
      },
      { status: 401 },
    );
  }

  // Compete board only accepts FREE competitor identities.
  if (!isFreeCompetitorEmail(email)) {
    return NextResponse.json(
      {
        success: false,
        message: "Prize leaderboard is for REFLUX FREE players only. Practice in PRO instead.",
      },
      { status: 403 },
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
    mode: body.mode,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
