export type PlanName = "Lifetime" | "Yearly" | "Monthly";

export type StoredPurchase = {
  id: string;
  user: string;
  plan: PlanName;
  location: string;
  at: number;
};

const REDIS_KEY = "reflux:recent-purchases";
const MAX_PURCHASES = 50;

function redisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redis<T>(command: (string | number)[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) return null;
  return response.json() as Promise<T>;
}

export function normalizePlan(plan: string): PlanName | null {
  const value = plan.trim().toLowerCase();
  if (value === "lifetime") return "Lifetime";
  if (value === "yearly" || value === "annual") return "Yearly";
  if (value === "monthly") return "Monthly";
  return null;
}

export async function addPurchase(input: {
  user: string;
  plan: PlanName;
  location: string;
}): Promise<StoredPurchase | null> {
  if (!redisConfigured()) return null;

  const purchase: StoredPurchase = {
    id: crypto.randomUUID(),
    user: input.user.trim().slice(0, 32),
    plan: input.plan,
    location: input.location.trim().slice(0, 64) || "Unknown",
    at: Date.now(),
  };

  await redis(["LPUSH", REDIS_KEY, JSON.stringify(purchase)]);
  await redis(["LTRIM", REDIS_KEY, 0, MAX_PURCHASES - 1]);

  return purchase;
}

export async function getRecentPurchases(since: number): Promise<StoredPurchase[]> {
  if (!redisConfigured()) return [];

  const result = await redis<{ result?: string[] }>(["LRANGE", REDIS_KEY, 0, MAX_PURCHASES - 1]);
  if (!result?.result?.length) return [];

  return result.result
    .map((entry) => {
      try {
        return JSON.parse(entry) as StoredPurchase;
      } catch {
        return null;
      }
    })
    .filter((purchase): purchase is StoredPurchase => purchase !== null && purchase.at > since);
}
