import { NextResponse } from "next/server";
import { discordLinksApiAuthorized, listProDiscordLinks } from "@/lib/pro-discord-links";

export const runtime = "nodejs";

/** Bot pulls PRO Discord usernames from here (x-api-secret). */
export async function GET(request: Request) {
  if (!discordLinksApiAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const links = await listProDiscordLinks();
  return NextResponse.json({
    ok: true,
    users: links.map((l) => ({
      email: l.email,
      discordUsername: l.discordUsername,
      source: "pro",
      updatedAt: l.updatedAt,
    })),
  });
}
