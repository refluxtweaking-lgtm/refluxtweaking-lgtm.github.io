import { NextResponse } from "next/server";
import { getAimLeaderboard } from "@/lib/aim-trainer";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const ipLimit = await rateLimit(`aim-lb:ip:${clientIp(request)}`, 60, 60);
  if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfterSec);

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 25);
  const board = await getAimLeaderboard(limit);

  return NextResponse.json({
    success: true,
    durationSec: 60,
    prize: {
      place: 1,
      reward: "extra_license_key",
      note: "Top 1 Discord username wins an extra REFLUX PRO license key in the giveaway (verified by staff).",
    },
    topDiscord: board.topDiscord,
    entries: board.entries,
  });
}
