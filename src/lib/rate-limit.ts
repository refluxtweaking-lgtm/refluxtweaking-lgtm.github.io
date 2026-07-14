type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

function redisConfigured(): boolean {
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

/** Sliding window counter via Upstash Redis. No-op (allows) when Redis is not configured. */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  if (!redisConfigured()) return { ok: true };

  const redisKey = `reflux:rl:${key}`;
  const countResult = await redis<{ result?: number }>(["INCR", redisKey]);
  const count = countResult?.result ?? 0;

  if (count === 1) {
    await redis(["EXPIRE", redisKey, windowSec]);
  }

  if (count > limit) {
    const ttlResult = await redis<{ result?: number }>(["TTL", redisKey]);
    const ttl = ttlResult?.result ?? windowSec;
    return { ok: false, retryAfterSec: Math.max(1, ttl) };
  }

  return { ok: true };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export function rateLimitResponse(retryAfterSec: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message: "Too many attempts. Wait a few minutes and try again.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    },
  );
}
