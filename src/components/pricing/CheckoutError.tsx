import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import type { ProPlanId } from "@/data/downloads";

interface CheckoutErrorProps {
  plan: ProPlanId;
  message: string;
}

export function CheckoutError({ plan, message }: CheckoutErrorProps) {
  const isNotConfigured = message.toLowerCase().includes("not configured");

  return (
    <SiteShell mainClassName="flex min-h-[60vh] items-center py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white">Checkout isn&apos;t ready yet</h1>
        <p className="mt-4 text-sm leading-relaxed text-reflux-muted">
          {isNotConfigured
            ? "Payment setup is still being finished on our end. The site owner needs to connect MoneyMotion in Vercel."
            : "We couldn't open the secure payment page right now. Please try again in a minute."}
        </p>
        <p className="mt-3 rounded-xl border border-reflux-border/60 bg-white/5 px-4 py-3 text-xs text-reflux-muted">
          Plan: <span className="font-semibold text-white">{plan}</span>
          {!isNotConfigured ? (
            <>
              <br />
              <span className="opacity-80">{message}</span>
            </>
          ) : null}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={`/checkout/${plan}`} variant="primary">
            Try again
          </Button>
          <Button href="/pricing" variant="secondary">
            Back to pricing
          </Button>
        </div>
        <p className="mt-6 text-xs text-reflux-muted">
          Need help?{" "}
          <Link href="https://discord.gg/reflux" className="text-reflux-accent hover:underline">
            Join our Discord
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
