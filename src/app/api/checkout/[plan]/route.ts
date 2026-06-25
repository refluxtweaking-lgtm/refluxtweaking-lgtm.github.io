import { NextResponse } from "next/server";
import { createMoneyMotionCheckout } from "@/lib/moneymotion";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
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

  let email: string | undefined;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email ?? undefined;
    } catch {
      email = undefined;
    }
  }

  if (!email) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `/checkout/${plan}`);
    return NextResponse.redirect(loginUrl);
  }

  const result = await createMoneyMotionCheckout(plan, { email, userIp });

  if (!result.ok) {
    const errorUrl = new URL(`/checkout/${plan}`, request.url);
    errorUrl.searchParams.set("error", "checkout");
    const reason = result.error.toLowerCase();
    if (reason.includes("not configured")) {
      errorUrl.searchParams.set("reason", "missing_key");
    } else if (reason.includes("unauthorized") || reason.includes("invalid api")) {
      errorUrl.searchParams.set("reason", "invalid_key");
    } else if (reason.includes("could not reach")) {
      errorUrl.searchParams.set("reason", "network");
    } else {
      errorUrl.searchParams.set("reason", "api_error");
      if (result.error) {
        errorUrl.searchParams.set("detail", result.error.slice(0, 180));
      }
    }
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(result.checkoutUrl);
}
