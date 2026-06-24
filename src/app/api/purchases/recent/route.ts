import { NextResponse } from "next/server";
import { getRecentPurchases } from "@/lib/purchase-store";
import { maskPurchaseIdentityIfNeeded } from "@/lib/mask-purchase-identity";

function isSameSiteRequest(request: Request): boolean {
  const referer = request.headers.get("referer") || "";
  const origin = request.headers.get("origin") || "";
  const allowed = /refluxtweaks\.com|localhost|127\.0\.0\.1/i;
  return allowed.test(referer) || allowed.test(origin);
}

export async function GET(request: Request) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ purchases: [] });
  }

  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get("since");
  const defaultSince = Date.now() - 24 * 60 * 60 * 1000;
  const since = sinceParam ? Number(sinceParam) : defaultSince;
  const safeSince = Number.isFinite(since)
    ? Math.max(since, Date.now() - 7 * 24 * 60 * 60 * 1000)
    : defaultSince;

  const purchases = await getRecentPurchases(safeSince);

  return NextResponse.json({
    purchases: purchases.slice(0, 50).map(({ id, user, plan, location, at }) => ({
      id,
      user: maskPurchaseIdentityIfNeeded(user),
      plan,
      location,
      at,
    })),
  });
}
