import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingCards } from "@/components/pricing/PricingCards";
import { Icon } from "@/components/ui/Icon";

import { PRODUCT_LIMITS } from "@/data/tweaks";

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <SectionHeader
        eyebrow="Pricing"
        title={
          <>
            Pick your <span className="gradient-text">power level</span>
          </>
        }
        subtitle="Start Monthly for full access, or go Lifetime and never pay again."
      />
      <PricingCards compact />
      <p className="mt-10 text-center">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-full border border-reflux-accent/30 bg-reflux-accent/10 px-6 py-3 text-sm font-semibold text-reflux-accent transition-all hover:bg-reflux-accent/20 hover:shadow-[0_0_24px_rgba(241,91,80,0.2)]"
        >
          Compare all {PRODUCT_LIMITS.totalTweaksLabel} tweaks across plans
          <Icon name="arrowRight" size={16} strokeWidth={2.2} glow={false} />
        </Link>
      </p>
    </section>
  );
}
