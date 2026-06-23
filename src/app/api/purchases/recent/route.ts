import { NextResponse } from "next/server";
import { getRecentPurchases } from "@/lib/purchase-store";
import { maskPurchaseIdentityIfNeeded } from "@/lib/mask-purchase-identity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? Number(sinceParam) : Date.now() - 24 * 60 * 60 * 1000;

  const purchases = await getRecentPurchases(Number.isFinite(since) ? since : Date.now() - 24 * 60 * 60 * 1000);

  return NextResponse.json({
    purchases: purchases.map(({ id, user, plan, location, at }) => ({
      id,
      user: maskPurchaseIdentityIfNeeded(user),
      plan,
      location,
      at,
    })),
  });
}
