import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProDiscordLinkForEmail, saveProDiscordLink } from "@/lib/pro-discord-links";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  const link = await getProDiscordLinkForEmail(user.email);
  return NextResponse.json({
    ok: true,
    discordUsername: link?.discordUsername || null,
    updatedAt: link?.updatedAt || null,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  let body: { discordUsername?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = await saveProDiscordLink({
    email: normalizeBuyerEmail(user.email),
    discordUsername: body.discordUsername || "",
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    discordUsername: result.link.discordUsername,
    updatedAt: result.link.updatedAt,
    message: "Discord username saved. Do not change it on Discord or your PRO role may not assign.",
  });
}
