import { createAdminClient } from "@/lib/supabase/admin";

export const AIM_TRAINER_DURATION_MS = 60_000;
export const AIM_TRAINER_MAX_SCORE = 1_000_000;
export const AIM_TRAINER_LEADERBOARD_LIMIT = 25;

export const AIM_MODES = ["track", "flick", "hardcore"] as const;
export type AimMode = (typeof AIM_MODES)[number];

export const AIM_MODE_META: Record<
  AimMode,
  {
    id: AimMode;
    label: string;
    short: string;
    difficulty: string;
    prizeEligible: boolean;
    description: string;
  }
> = {
  track: {
    id: "track",
    label: "Star Track",
    short: "Tracking",
    difficulty: "Normal",
    prizeEligible: false,
    description: "Keep your crosshair on the moving ball for 60 seconds.",
  },
  flick: {
    id: "flick",
    label: "Flick Arena",
    short: "Flicks",
    difficulty: "Hard",
    prizeEligible: false,
    description: "Snap-shot popping targets before they vanish.",
  },
  hardcore: {
    id: "hardcore",
    label: "Hardcore",
    short: "Hardcore",
    difficulty: "Extreme",
    prizeEligible: true,
    description: "Tiny erratic targets — top 3 win free PRO license days.",
  },
};

export const AIM_PRIZES = [
  { place: 1, days: 30, label: "1st · 30-day PRO license" },
  { place: 2, days: 14, label: "2nd · 14-day PRO license" },
  { place: 3, days: 7, label: "3rd · 7-day PRO license" },
] as const;

export type AimLeaderboardEntry = {
  rank: number;
  discordUsername: string;
  score: number;
  accuracy: number;
  createdAt: string;
  isYou?: boolean;
  prize?: string | null;
};

export function normalizeAimMode(raw: unknown): AimMode {
  const mode = String(raw || "track").trim().toLowerCase();
  if ((AIM_MODES as readonly string[]).includes(mode)) return mode as AimMode;
  // legacy rows / older clients
  if (mode === "startrack" || mode === "micro") return "track";
  return "track";
}

export function normalizeDiscordUsername(raw: string): string | null {
  const cleaned = String(raw || "")
    .trim()
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
  if (/^[a-z0-9._]{2,32}$/i.test(cleaned)) return cleaned.toLowerCase();
  if (/^.{2,32}#\d{4}$/.test(cleaned)) return cleaned;
  return null;
}

function prizeForRank(mode: AimMode, rank: number): string | null {
  if (mode !== "hardcore") return null;
  const match = AIM_PRIZES.find((p) => p.place === rank);
  return match ? match.label : null;
}

export async function getAimLeaderboard(
  limit = AIM_TRAINER_LEADERBOARD_LIMIT,
  viewerEmail?: string,
  modeInput: AimMode | string = "hardcore",
) {
  const mode = normalizeAimMode(modeInput);
  const admin = createAdminClient();
  if (!admin) {
    return {
      mode,
      meta: AIM_MODE_META[mode],
      prizes: mode === "hardcore" ? AIM_PRIZES : [],
      entries: [] as AimLeaderboardEntry[],
      topDiscord: null as string | null,
    };
  }

  const { data, error } = await admin
    .from("aim_trainer_scores")
    .select("email, discord_username, score, accuracy, created_at, mode")
    .eq("mode", mode)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(Math.max(1, Math.min(100, limit)));

  if (error || !data) {
    return {
      mode,
      meta: AIM_MODE_META[mode],
      prizes: mode === "hardcore" ? AIM_PRIZES : [],
      entries: [] as AimLeaderboardEntry[],
      topDiscord: null as string | null,
    };
  }

  const viewer = viewerEmail?.trim().toLowerCase() || "";
  const entries: AimLeaderboardEntry[] = data.map((row, i) => {
    const rank = i + 1;
    return {
      rank,
      discordUsername: String(row.discord_username || ""),
      score: Number(row.score) || 0,
      accuracy: Number(row.accuracy) || 0,
      createdAt: String(row.created_at || ""),
      isYou: viewer ? String(row.email || "").toLowerCase() === viewer : false,
      prize: prizeForRank(mode, rank),
    };
  });

  return {
    mode,
    meta: AIM_MODE_META[mode],
    prizes: mode === "hardcore" ? AIM_PRIZES : [],
    entries,
    topDiscord: entries[0]?.discordUsername || null,
  };
}

function scoreLooksValid(mode: AimMode, score: number, accuracy: number): boolean {
  if (mode === "flick") {
    // Flick: score ≈ hits*weight * accuracy factor
    const maxPlausible = Math.floor((accuracy / 100) * 120000 + 8000);
    return score <= maxPlausible;
  }
  if (mode === "hardcore") {
    const maxPlausible = Math.floor((accuracy / 100) * 100000 + 4000);
    return score <= maxPlausible;
  }
  const maxPlausible = Math.floor((accuracy / 100) * 100000 + 5000);
  return score <= maxPlausible;
}

export async function upsertAimScore(input: {
  email: string;
  discordUsername: string;
  score: number;
  accuracy: number;
  durationMs: number;
  mode?: string;
}) {
  const admin = createAdminClient();
  if (!admin) return { success: false as const, message: "Leaderboard unavailable right now." };

  const mode = normalizeAimMode(input.mode);
  const email = input.email.trim().toLowerCase();
  const discordUsername = normalizeDiscordUsername(input.discordUsername);
  if (!discordUsername) {
    return { success: false as const, message: "Enter a valid Discord username." };
  }

  const score = Math.max(0, Math.min(AIM_TRAINER_MAX_SCORE, Math.floor(input.score)));
  const accuracy = Math.max(0, Math.min(100, Number(input.accuracy) || 0));
  const durationMs = Math.floor(input.durationMs || AIM_TRAINER_DURATION_MS);

  if (Math.abs(durationMs - AIM_TRAINER_DURATION_MS) > 2500) {
    return { success: false as const, message: "Invalid run duration." };
  }
  if (!scoreLooksValid(mode, score, accuracy)) {
    return { success: false as const, message: "Score rejected — try again honestly." };
  }

  const { data: existing } = await admin
    .from("aim_trainer_scores")
    .select("id, score")
    .eq("email", email)
    .eq("mode", mode)
    .maybeSingle();

  if (existing?.id && Number(existing.score) >= score) {
    const board = await getAimLeaderboard(AIM_TRAINER_LEADERBOARD_LIMIT, email, mode);
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
    mode,
    created_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await admin.from("aim_trainer_scores").update(payload).eq("id", existing.id);
    if (error) return { success: false as const, message: "Could not update score." };
  } else {
    const { error } = await admin.from("aim_trainer_scores").insert(payload);
    if (error) {
      // Fallback: older schema without mode column
      if (String(error.message || "").toLowerCase().includes("mode")) {
        return { success: false as const, message: "Leaderboard updating — try again in a minute." };
      }
      return { success: false as const, message: "Could not save score." };
    }
  }

  const board = await getAimLeaderboard(AIM_TRAINER_LEADERBOARD_LIMIT, email, mode);
  const you = board.entries.find((e) => e.isYou);
  let message = "New personal best saved to the leaderboard.";
  if (mode === "hardcore" && you?.prize) {
    message = `New PB! You're #${you.rank} on Hardcore — prize lane: ${you.prize}.`;
  } else if (board.entries[0]?.isYou) {
    message = "New #1 on this mode!";
  }

  return {
    success: true as const,
    improved: true,
    bestScore: score,
    ...board,
    message,
  };
}
