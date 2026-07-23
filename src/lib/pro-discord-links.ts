import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeBuyerEmail } from "@/lib/normalize-email";
import { normalizeDiscordUsername } from "@/lib/aim-trainer";
import { emailHasActiveProLicense } from "@/lib/pro-download-access";

export type ProDiscordLink = {
  email: string;
  discordUsername: string;
  updatedAt: string;
};

export function discordLinksApiAuthorized(request: Request): boolean {
  const secret = process.env.DISCORD_LINKS_API_SECRET?.trim() || process.env.API_SECRET?.trim() || "";
  if (!secret) return false;
  const header = request.headers.get("x-api-secret")?.trim() || "";
  return Boolean(header && header === secret);
}

export async function getProDiscordLinkForEmail(email: string): Promise<ProDiscordLink | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const normalized = normalizeBuyerEmail(email);
  const { data, error } = await admin
    .from("pro_discord_links")
    .select("email, discord_username, updated_at")
    .eq("email", normalized)
    .maybeSingle();
  if (error || !data) return null;
  return {
    email: data.email,
    discordUsername: data.discord_username,
    updatedAt: data.updated_at,
  };
}

export async function listProDiscordLinks(): Promise<ProDiscordLink[]> {
  const admin = createAdminClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("pro_discord_links")
    .select("email, discord_username, updated_at")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    email: row.email,
    discordUsername: row.discord_username,
    updatedAt: row.updated_at,
  }));
}

export async function saveProDiscordLink(input: {
  email: string;
  discordUsername: string;
}): Promise<{ ok: true; link: ProDiscordLink } | { ok: false; error: string }> {
  const email = normalizeBuyerEmail(input.email);
  const discordUsername = normalizeDiscordUsername(input.discordUsername);
  if (!discordUsername) {
    return { ok: false, error: "Enter a valid Discord username (no spaces, 2–32 characters)." };
  }

  const hasPro = await emailHasActiveProLicense(email);
  if (!hasPro) {
    return { ok: false, error: "An active REFLUX PRO license is required to link Discord." };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Could not save Discord username right now." };

  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("pro_discord_links")
    .upsert(
      {
        email,
        discord_username: discordUsername,
        updated_at: now,
      },
      { onConflict: "email" },
    )
    .select("email, discord_username, updated_at")
    .maybeSingle();

  if (error || !data) {
    console.error("[discord-link] upsert failed:", error?.message);
    return { ok: false, error: "Could not save Discord username." };
  }

  return {
    ok: true,
    link: {
      email: data.email,
      discordUsername: data.discord_username,
      updatedAt: data.updated_at,
    },
  };
}
