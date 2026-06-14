import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/layout/SiteShell";
import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import { plans } from "@/data/plans";
import type { ProPlanId } from "@/data/downloads";
import type { Metadata } from "next";

const VALID_PLANS = new Set<ProPlanId>(["monthly", "yearly", "lifetime"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plan: string }>;
}): Promise<Metadata> {
  const { plan } = await params;
  return {
    title: `Checkout – REFLUX TWEAKS`,
    robots: { index: false },
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ plan: string }>;
  searchParams: Promise<{ error?: string; reason?: string }>;
}) {
  const { plan: planParam } = await params;
  const { error, reason } = await searchParams;

  if (!VALID_PLANS.has(planParam as ProPlanId)) {
    redirect("/pricing");
  }

  const plan = planParam as ProPlanId;
  const planData = plans.find((p) => p.id === plan);

  if (!planData) {
    redirect("/pricing");
  }

  const hasCheckoutError = error === "checkout";
  const errorMessage =
    reason === "missing_key"
      ? "Payment API key isn't active on the server yet. Add MONEYMOTION_API_KEY in Vercel, then redeploy."
      : reason === "invalid_key"
        ? "MoneyMotion rejected the API key. Create a new mk_live_ key in MoneyMotion and update Vercel, then redeploy."
        : reason === "network"
          ? "Couldn't reach MoneyMotion. Try again in a minute."
          : reason === "api_error"
            ? "MoneyMotion returned an error. Check your MoneyMotion account is active and try again."
            : "Payment setup isn't ready yet — please contact support or try again later.";

  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-lg">
        {/* Card */}
        <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-8 shadow-[0_0_60px_rgba(241,91,80,0.08)]">

          {/* Logo + brand */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/favicon.ico"
                alt="REFLUX TWEAKS"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-reflux-muted">
                REFLUX TWEAKS
              </span>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-reflux-accent/40 to-transparent" />
          </div>

          {/* Plan name + badge */}
          <div className="mb-2 flex items-center justify-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {planData.name} Plan
            </h1>
            {planData.badge && (
              <span className="rounded-full border border-reflux-accent/40 bg-[rgba(241,91,80,0.12)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-reflux-accent">
                {planData.badge}
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className="mb-6 text-center text-sm text-reflux-muted">{planData.tagline}</p>

          {/* Price */}
          <div className="mb-6 flex items-baseline justify-center gap-2">
            <span className="gradient-text text-5xl font-black tracking-tight">
              {planData.displayPrice}
            </span>
            <span className="text-base text-reflux-muted">{planData.suffix}</span>
            {planData.originalPrice && (
              <span className="ml-1 text-sm text-reflux-muted line-through">
                {planData.originalPrice}
              </span>
            )}
          </div>

          {/* Feature list */}
          <ul className="mb-8 space-y-2.5">
            {planData.highlights.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-reflux-text">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-reflux-accent"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {/* Checkout error banner */}
          {hasCheckoutError && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {/* CTA button */}
          <CheckoutButton plan={plan} />

          {/* Trust line */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-reflux-muted">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-reflux-accent/70"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure checkout powered by MoneyMotion
          </p>

          {/* Trust indicator row */}
          <div className="mt-6 flex items-center justify-center gap-5 border-t border-reflux-border/40 pt-5 text-[11px] text-reflux-muted">
            <span className="flex items-center gap-1.5">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-reflux-accent/70"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              SSL Secured
            </span>
            <span className="h-3 w-px bg-reflux-border/60" />
            <span className="flex items-center gap-1.5">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-reflux-accent/70"
                aria-hidden="true"
              >
                <path d="M12 3l7 3v5c0 4.6-3 7.7-7 9-4-1.3-7-4.4-7-9V6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Safe Checkout
            </span>
            <span className="h-3 w-px bg-reflux-border/60" />
            <span className="flex items-center gap-1.5">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-reflux-accent/70"
                aria-hidden="true"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              All Major Cards
            </span>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-5 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-reflux-muted transition-colors hover:text-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H6M11 6l-6 6 6 6" />
            </svg>
            Back to pricing
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
