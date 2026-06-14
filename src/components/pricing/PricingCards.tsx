import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { plans } from "@/data/plans";
import { countTweaksForPlan } from "@/data/tweaks";

interface PricingCardsProps {
  compact?: boolean;
}

export function PricingCards({ compact = false }: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <GlowCard
          key={plan.id}
          hover={!plan.popular}
          className={`pricing-card relative text-center ${
            plan.popular
              ? "z-10 !border-reflux-accent shadow-[0_0_48px_rgba(241,91,80,0.35)] xl:-translate-y-4"
              : plan.highlighted
                ? "z-10 !border-reflux-discord/50 shadow-[0_0_32px_rgba(88,101,242,0.2)] xl:-translate-y-2"
                : ""
          }`}
        >
          {plan.badge && (
            <span
              className={`mb-4 inline-flex rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase ${
                plan.highlighted
                  ? "bg-gradient-to-r from-reflux-discord to-[#4752c4] text-white shadow-[0_0_16px_rgba(88,101,242,0.4)]"
                  : "bg-gradient-to-r from-reflux-accent to-[#c43d35] text-white shadow-[0_0_16px_rgba(241,91,80,0.4)]"
              }`}
            >
              {plan.badge}
            </span>
          )}

          <h3 className="text-2xl font-bold">{plan.name}</h3>
          {!compact && (
            <p className="mt-2 min-h-[44px] text-sm text-reflux-muted">{plan.tagline}</p>
          )}

          <div className="my-6">
            {plan.originalPrice && (
              <span className="mr-2 text-base text-reflux-muted line-through">
                {plan.originalPrice}
              </span>
            )}
            <span className="text-5xl font-extrabold tracking-tight">{plan.displayPrice}</span>
            {plan.suffix && (
              <span className="text-base text-reflux-muted">{plan.suffix}</span>
            )}
          </div>

          <div className="mb-5 inline-flex rounded-full border border-reflux-accent/25 bg-reflux-accent/10 px-4 py-1.5 text-sm font-bold text-reflux-accent">
            {countTweaksForPlan(plan.id)} tweaks
          </div>

          <ul className="my-5 grow list-none space-y-3 pl-0 text-left">
            {plan.highlights.map((feature) => (
              <li key={feature} className="text-sm text-[#b8c2ce]">
                {feature}
              </li>
            ))}
          </ul>

          <Button
            href={plan.ctaHref}
            variant={plan.highlighted ? "discord" : "primary"}
            external
            className="mt-auto w-full"
          >
            {plan.cta}
          </Button>
        </GlowCard>
      ))}
    </div>
  );
}
