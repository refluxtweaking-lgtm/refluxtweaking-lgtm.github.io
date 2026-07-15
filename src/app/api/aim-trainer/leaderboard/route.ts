import { NextResponse } from "next/server";
import { AIM_MODE_META, AIM_PRIZES, getAimLeaderboard, normalizeAimMode } from "@/lib/aim-trainer";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const ipLimit = await rateLimit(`aim-lb:ip:${clientIp(request)}`, 60, 60);
  if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfterSec);

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 25);
  const mode = normalizeAimMode(searchParams.get("mode") || "hardcore");
  const viewer = searchParams.get("viewer") || searchParams.get("email") || undefined;
  const board = await getAimLeaderboard(limit, viewer || undefined, mode);

  return NextResponse.json({
    success: true,
    durationSec: 60,
    mode,
    meta: AIM_MODE_META[mode],
    prize: mode === "hardcore"
      ? {
          places: AIM_PRIZES,
          note: "REFLUX FREE Hardcore top 3 Discord usernames win free PRO license days (staff verified): #1 30 days, #2 14 days, #3 7 days.",
        }
      : {
          places: [],
          note: "Practice mode — no giveaway prizes on this board.",
        },
    channel: "free",
    topDiscord: board.topDiscord,
    prizes: board.prizes,
    entries: board.entries,
  });
}
