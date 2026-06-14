import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { CheckoutError } from "@/components/pricing/CheckoutError";
import { createMoneyMotionCheckout } from "@/lib/moneymotion";
import type { ProPlanId } from "@/data/downloads";

const VALID_PLANS = new Set<ProPlanId>(["monthly", "yearly", "lifetime"]);

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan: planParam } = await params;

  if (!VALID_PLANS.has(planParam as ProPlanId)) {
    redirect("/pricing");
  }

  const plan = planParam as ProPlanId;
  const headerList = await headers();
  const userIp =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    undefined;

  const result = await createMoneyMotionCheckout(plan, { userIp });

  if (result.ok) {
    redirect(result.checkoutUrl);
  }

  return <CheckoutError plan={plan} message={result.error} />;
}
