import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { HeroGameTicker } from "./HeroGameTicker";
import { HeroShowcase } from "./HeroShowcase";
import { MarqueeStrip } from "./MarqueeStrip";

const proofPoints = [
  { icon: "bolt" as const, label: "+52", unit: "avg FPS", sub: "Real user results" },
  { icon: "target" as const, label: "-6", unit: "ms ping", sub: "Lower input delay" },
  { icon: "shield" as const, label: "100%", unit: "reversible", sub: "Restore anytime" },
];

export function Hero() {
  return (
    <section className="hero-stage relative w-full pb-8 pt-4 md:pt-10 lg:pt-12">
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up mb-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-reflux-green/30 bg-reflux-green/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-reflux-green uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-reflux-green" />
                Free to download
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-reflux-muted">
                {PRODUCT_LIMITS.freeTweaks} tweaks · no card needed
              </span>
            </div>

            <h1
              className="hero-headline animate-fade-in-up mb-5 font-bold tracking-tight text-white"
              style={{ animationDelay: "0.05s" }}
            >
              Stop losing to lag.
              <span className="mt-2 block gradient-text-static">Start winning fights.</span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mb-8 max-w-lg text-base leading-relaxed text-reflux-muted md:text-[17px] lg:mx-0"
              style={{ animationDelay: "0.1s" }}
            >
              REFLUX tunes your PC for <HeroGameTicker /> and every game you grind — live hardware
              detection, {PRODUCT_LIMITS.totalTweaksLabel} pro tweaks, zero background bloat.
            </p>

            <div
              className="animate-fade-in-up mb-8 flex flex-wrap justify-center gap-3 lg:justify-start"
              style={{ animationDelay: "0.16s" }}
            >
              <Button
                href={REFLUX_FREE_DOWNLOAD.href}
                download={REFLUX_FREE_DOWNLOAD.filename}
                variant="primary"
                large
                showIcon
                className="min-w-[200px]"
              >
                Download Free
              </Button>
              <Button href="#pricing" variant="secondary" large className="min-w-[170px]">
                See Pro plans
              </Button>
            </div>

            <div
              className="animate-fade-in-up mx-auto grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 lg:mx-0"
              style={{ animationDelay: "0.22s" }}
            >
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#12151c] px-4 py-3.5 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Icon name={point.icon} size={17} className="text-reflux-accent" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-semibold tabular-nums text-white">
                      {point.label}
                      <span className="ml-1 text-xs font-medium text-reflux-muted">{point.unit}</span>
                    </div>
                    <div className="text-[11px] text-reflux-muted">{point.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in-up mt-7 flex flex-wrap items-center justify-center gap-4 text-sm text-reflux-muted lg:justify-start"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={14} className="text-reflux-accent/80" />
                ))}
                <span className="ml-2 font-medium text-white/90">Loved by gamers</span>
              </div>
              <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
              <span>
                {PRODUCT_LIMITS.totalTweaksLabel} pro tweaks · <span className="text-white/90">5 min</span> setup
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up w-full min-w-0" style={{ animationDelay: "0.12s" }}>
            <HeroShowcase />
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2 md:mt-16">
        <MarqueeStrip />
      </div>
    </section>
  );
}
