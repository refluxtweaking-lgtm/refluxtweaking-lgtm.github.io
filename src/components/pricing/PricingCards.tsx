import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { plans } from "@/data/plans";
import { displayTweakCountForPlan } from "@/data/tweaks";

interface PricingCardsProps {
  compact?: boolean;
  showProofHook?: boolean;
}

const PROOF_HOOKS: Partial<Record<(typeof plans)[number]["id"], string>> = {
  monthly: "Most picked — full library behind +26 FPS & −90% ping",
  yearly: "Same Fortnite results stack — save 34%",
  lifetime: "One payment · every tweak · forever",
};

export function PricingCards({ compact = false, showProofHook = false }: PricingCardsProps) {
  return (
    <div className="pricing-cards-grid grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => {
        const proofHook = showProofHook ? PROOF_HOOKS[plan.id] : undefined;
        const isPro = plan.id !== "free";
        const isHero = plan.popular === true;

        return (
          <GlowCard
            key={plan.id}
            hover={!isHero}
            className={`pricing-card relative text-center ${
              plan.id === "free" ? "pricing-card--free" : ""
            } ${
              isHero
                ? "pricing-card--hero z-20 xl:-translate-y-3 xl:scale-[1.05]"
                : plan.highlighted
                  ? "z-10 !border-reflux-discord/40 xl:-translate-y-0.5"
                  : isPro
                    ? "pricing-card--pro"
                    : ""
            }`}
          >
            {isHero ? (
              <>
                <div className="pricing-card-hero-glow pointer-events-none absolute inset-0 rounded-2xl" aria-hidden="true" />
                <div className="pricing-card-hero-ring pointer-events-none absolute -inset-px rounded-2xl" aria-hidden="true" />
              </>
            ) : null}

            {plan.badge ? (
              <span
                className={`relative z-[1] mb-4 inline-flex ${
                  isHero
                    ? "pricing-card-hero-badge"
                    : plan.highlighted
                      ? "rounded-full bg-gradient-to-r from-reflux-discord to-[#4752c4] px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-[0_0_16px_rgba(88,101,242,0.4)]"
                      : "rounded-full bg-gradient-to-r from-reflux-accent/90 to-[#c43d35] px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-[0_0_16px_rgba(241,91,80,0.35)]"
                }`}
              >
                {isHero ? (
                  <>
                    <span className="pricing-card-hero-badge-dot" aria-hidden="true" />
                    {plan.badge}
                  </>
                ) : (
                  plan.badge
                )}
              </span>
            ) : null}

            <h3 className={`relative z-[1] font-bold ${isHero ? "text-[1.65rem]" : "text-2xl"}`}>
              {plan.name}
            </h3>

            {!compact && (
              <p className={`relative z-[1] mt-2 min-h-[44px] text-sm ${isHero ? "text-reflux-text-soft" : "text-reflux-muted"}`}>
                {plan.tagline}
              </p>
            )}

            {isHero ? (
              <p className="pricing-card-hero-kicker relative z-[1] mt-2 text-[11px] font-bold tracking-[0.14em] text-reflux-accent uppercase">
                Most gamers start here
              </p>
            ) : null}

            {proofHook ? (
              <p
                className={`pricing-card-proof-hook relative z-[1] mt-3 text-xs leading-snug ${
                  isHero ? "pricing-card-proof-hook--hero" : "font-semibold text-reflux-accent"
                }`}
              >
                {proofHook}
              </p>
            ) : showProofHook && plan.id === "free" ? (
              <p className="relative z-[1] mt-3 text-xs leading-snug text-reflux-muted">
                Taste the optimizer — upgrade for the full session results
              </p>
            ) : null}

            <div className={`relative z-[1] my-5 ${isHero ? "pricing-card-hero-price" : ""}`}>
              {plan.originalPrice && (
                <span className={`mr-2 text-base line-through ${isHero ? "text-reflux-muted/80" : "text-reflux-muted"}`}>
                  {plan.originalPrice}
                </span>
              )}
              <span
                className={`font-extrabold tracking-tight ${
                  isHero ? "pricing-card-hero-price-value text-[3.25rem] leading-none" : "text-5xl"
                }`}
              >
                {plan.displayPrice}
              </span>
              {plan.suffix && (
                <span className={`text-base ${isHero ? "font-semibold text-reflux-text-soft" : "text-reflux-muted"}`}>
                  {plan.suffix}
                </span>
              )}
            </div>

            <div
              className={`relative z-[1] mb-5 inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${
                isHero
                  ? "pricing-card-hero-tweak-pill text-white"
                  : "reflux-glow-readable text-reflux-accent"
              }`}
            >
              {displayTweakCountForPlan(plan.id)} tweaks
            </div>

            <ul className="relative z-[1] my-5 grow list-none space-y-3 pl-0 text-left">
              {plan.highlights.map((feature) => (
                <li
                  key={feature}
                  className={`text-sm ${isHero ? "pricing-card-hero-feature text-[#d4dce8]" : "text-[#b8c2ce]"}`}
                >
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              href={plan.ctaHref}
              variant={plan.highlighted ? "discord" : "primary"}
              external={!plan.downloadFilename}
              download={plan.downloadFilename}
              large={isHero}
              className={`relative z-[1] mt-auto w-full ${isPro || isHero ? "btn-angular" : ""} ${
                isHero ? "pricing-card-hero-cta" : ""
              }`}
            >
              {plan.cta}
            </Button>
          </GlowCard>
        );
      })}
    </div>
  );
}
