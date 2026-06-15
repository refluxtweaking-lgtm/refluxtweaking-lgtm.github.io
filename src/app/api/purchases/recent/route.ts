import { NextResponse } from "next/server";
import { getRecentPurchases } from "@/lib/purchase-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? Number(sinceParam) : Date.now() - 24 * 60 * 60 * 1000;

  const purchases = await getRecentPurchases(Number.isFinite(since) ? since : Date.now() - 24 * 60 * 60 * 1000);

  return NextResponse.json({
    purchases: purchases.map(({ id, user, plan, at }) => ({
      id,
      user,
      plan,
      at,
    })),
  });
}
