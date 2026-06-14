import { NextResponse } from "next/server";
import { createMoneyMotionCheckout } from "@/lib/moneymotion";
import type { ProPlanId } from "@/data/downloads";

export const runtime = "nodejs";

const VALID_PLANS = new Set<ProPlanId>(["monthly", "yearly", "lifetime"]);

export async function GET(
  request: Request,
  context: { params: Promise<{ plan: string }> },
) {
  const { plan: planParam } = await context.params;

  if (!VALID_PLANS.has(planParam as ProPlanId)) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const plan = planParam as ProPlanId;
  const userIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const result = await createMoneyMotionCheckout(plan, { userIp });

  if (!result.ok) {
    return NextResponse.redirect(new URL(`/checkout/${plan}`, request.url));
  }

  return NextResponse.redirect(result.checkoutUrl);
}
