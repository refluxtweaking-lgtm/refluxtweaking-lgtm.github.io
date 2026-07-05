import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { plans } from "@/data/plans";
import { displayTweakCountForPlan } from "@/data/tweaks";

interface PricingCardsProps {
  compact?: boolean;
  showProofHook?: boolean;
}

const PROOF_HOOKS: Partial<Record<(typeof plans)[number]["id"], string>> = {
  monthly: "Full library behind +26 FPS & −90% ping",
  yearly: "Same Fortnite results stack — save 34%",
  lifetime: "One payment · every tweak · forever",
};

export function PricingCards({ compact = false, showProofHook = false }: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => {
        const proofHook = showProofHook ? PROOF_HOOKS[plan.id] : undefined;
        const isPro = plan.id !== "free";

        return (
          <GlowCard
            key={plan.id}
            hover={!plan.popular}
            className={`pricing-card relative text-center ${
              plan.popular
                ? "z-10 !border-reflux-accent/50 pricing-card--featured xl:-translate-y-1"
                : plan.highlighted
                  ? "z-10 !border-reflux-discord/40 xl:-translate-y-0.5"
                  : isPro
                    ? "pricing-card--pro"
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

            {proofHook ? (
              <p className="pricing-card-proof-hook mt-3 text-xs font-semibold leading-snug text-reflux-accent">
                {proofHook}
              </p>
            ) : showProofHook && plan.id === "free" ? (
              <p className="mt-3 text-xs leading-snug text-reflux-muted">
                Taste the optimizer — upgrade for the full session results
              </p>
            ) : null}

            <div className="my-5">
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

            <div className="mb-5 inline-flex rounded-full reflux-glow-readable px-4 py-1.5 text-sm font-bold text-reflux-accent">
              {displayTweakCountForPlan(plan.id)} tweaks
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
              external={!plan.downloadFilename}
              download={plan.downloadFilename}
              className={`mt-auto w-full ${isPro ? "btn-angular" : ""}`}
            >
              {plan.cta}
            </Button>
          </GlowCard>
        );
      })}
    </div>
  );
}
