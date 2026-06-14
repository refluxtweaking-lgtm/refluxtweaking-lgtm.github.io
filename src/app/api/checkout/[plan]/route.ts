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
    const errorUrl = new URL(`/checkout/${plan}`, request.url);
    errorUrl.searchParams.set("error", "checkout");
    const reason = result.error.toLowerCase();
    if (reason.includes("not configured")) {
      errorUrl.searchParams.set("reason", "missing_key");
    } else if (reason.includes("invalidauth") || reason.includes("unauthorized") || reason.includes("invalid api")) {
      errorUrl.searchParams.set("reason", "invalid_key");
    } else if (reason.includes("could not reach")) {
      errorUrl.searchParams.set("reason", "network");
    } else {
      errorUrl.searchParams.set("reason", "api_error");
    }
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(result.checkoutUrl);
}
