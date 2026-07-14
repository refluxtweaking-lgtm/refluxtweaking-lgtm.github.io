import { createAdminClient } from "@/lib/supabase/admin";

export const AIM_TRAINER_DURATION_MS = 60_000;
export const AIM_TRAINER_MAX_SCORE = 1_000_000;
export const AIM_TRAINER_LEADERBOARD_LIMIT = 25;

export type AimLeaderboardEntry = {
  rank: number;
  discordUsername: string;
  score: number;
  accuracy: number;
  createdAt: string;
  isYou?: boolean;
};

export function normalizeDiscordUsername(raw: string): string | null {
  const cleaned = String(raw || "")
    .trim()
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
  // Discord usernames: 2–32 chars, lowercase letters/numbers/._ (new) or legacy Name#0000
  if (/^[a-z0-9._]{2,32}$/i.test(cleaned)) return cleaned.toLowerCase();
  if (/^.{2,32}#\d{4}$/.test(cleaned)) return cleaned;
  return null;
}

export async function getAimLeaderboard(limit = AIM_TRAINER_LEADERBOARD_LIMIT, viewerEmail?: string) {
  const admin = createAdminClient();
  if (!admin) return { entries: [] as AimLeaderboardEntry[], topDiscord: null as string | null };

  const { data, error } = await admin
    .from("aim_trainer_scores")
    .select("email, discord_username, score, accuracy, created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(Math.max(1, Math.min(100, limit)));

  if (error || !data) {
    return { entries: [] as AimLeaderboardEntry[], topDiscord: null as string | null };
  }

  const viewer = viewerEmail?.trim().toLowerCase() || "";
  const entries: AimLeaderboardEntry[] = data.map((row, i) => ({
    rank: i + 1,
    discordUsername: String(row.discord_username || ""),
    score: Number(row.score) || 0,
    accuracy: Number(row.accuracy) || 0,
    createdAt: String(row.created_at || ""),
    isYou: viewer ? String(row.email || "").toLowerCase() === viewer : false,
  }));

  return {
    entries,
    topDiscord: entries[0]?.discordUsername || null,
  };
}

export async function upsertAimScore(input: {
  email: string;
  discordUsername: string;
  score: number;
  accuracy: number;
  durationMs: number;
}) {
  const admin = createAdminClient();
  if (!admin) return { success: false as const, message: "Leaderboard unavailable right now." };

  const email = input.email.trim().toLowerCase();
  const discordUsername = normalizeDiscordUsername(input.discordUsername);
  if (!discordUsername) {
    return { success: false as const, message: "Enter a valid Discord username." };
  }

  const score = Math.max(0, Math.min(AIM_TRAINER_MAX_SCORE, Math.floor(input.score)));
  const accuracy = Math.max(0, Math.min(100, Number(input.accuracy) || 0));
  const durationMs = Math.floor(input.durationMs || AIM_TRAINER_DURATION_MS);

  // Soft anti-cheat: run must be ~60s and accuracy/score must be consistent.
  if (Math.abs(durationMs - AIM_TRAINER_DURATION_MS) > 2500) {
    return { success: false as const, message: "Invalid run duration." };
  }
  const maxPlausible = Math.floor((accuracy / 100) * 100000 + 5000);
  if (score > maxPlausible) {
    return { success: false as const, message: "Score rejected — try again honestly." };
  }

  const { data: existing } = await admin
    .from("aim_trainer_scores")
    .select("id, score")
    .eq("email", email)
    .maybeSingle();

  if (existing?.id && Number(existing.score) >= score) {
    const board = await getAimLeaderboard(AIM_TRAINER_LEADERBOARD_LIMIT, email);
    return {
      success: true as const,
      improved: false,
      bestScore: Number(existing.score) || 0,
      ...board,
      message: "Run saved. Your personal best is still higher.",
    };
  }

  const payload = {
    email,
    discord_username: discordUsername,
    score,
    accuracy,
    duration_ms: durationMs,
    created_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await admin.from("aim_trainer_scores").update(payload).eq("id", existing.id);
    if (error) return { success: false as const, message: "Could not update score." };
  } else {
    const { error } = await admin.from("aim_trainer_scores").insert(payload);
    if (error) return { success: false as const, message: "Could not save score." };
  }

  const board = await getAimLeaderboard(AIM_TRAINER_LEADERBOARD_LIMIT, email);
  return {
    success: true as const,
    improved: true,
    bestScore: score,
    ...board,
    message: board.entries[0]?.isYou
      ? "New #1! You're first on the giveaway board."
      : "New personal best saved to the leaderboard.",
  };
}
