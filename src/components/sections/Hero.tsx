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
    <section className="hero-stage relative overflow-hidden pb-4 pt-4 md:pt-8 lg:pt-10">
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-ring pointer-events-none absolute top-[10%] right-[6%] hidden h-80 w-80 rounded-full border border-reflux-accent/20 lg:block" aria-hidden="true" />
      <div className="hero-ring hero-ring-delay pointer-events-none absolute bottom-[15%] left-[2%] hidden h-56 w-56 rounded-full border border-reflux-calm/25 lg:block" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-1">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up mb-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="hero-live-badge inline-flex items-center gap-2 rounded-full border border-reflux-green/35 bg-reflux-green/12 px-4 py-2 text-[11px] font-bold tracking-wide text-reflux-green uppercase">
                <span className="hero-live-dot h-2 w-2 rounded-full bg-reflux-green" />
                Free to download
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold text-reflux-muted backdrop-blur-sm">
                {PRODUCT_LIMITS.freeTweaks} tweaks · no card needed
              </span>
            </div>

            <h1
              className="hero-headline animate-fade-in-up mb-6 font-extrabold tracking-tight"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="block text-white">Stop losing to lag.</span>
              <span className="hero-gradient-shimmer mt-2 block">Start winning fights.</span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#9aa5b8] md:text-lg lg:mx-0"
              style={{ animationDelay: "0.1s" }}
            >
              REFLUX tunes your PC for{" "}
              <HeroGameTicker />
              {" "}and every game you grind — live Intel / AMD / NVIDIA detection, {PRODUCT_LIMITS.totalTweaksLabel} pro tweaks, zero background bloat.
            </p>

            <div
              className="animate-fade-in-up mb-10 flex flex-wrap justify-center gap-3.5 lg:justify-start"
              style={{ animationDelay: "0.16s" }}
            >
              <div className="hero-cta-glow">
                <Button
                  href={REFLUX_FREE_DOWNLOAD.href}
                  download={REFLUX_FREE_DOWNLOAD.filename}
                  variant="primary"
                  large
                  showIcon
                  className="hero-cta-primary min-w-[220px]"
                >
                  Download Free
                </Button>
              </div>
              <Button href="#pricing" variant="secondary" large className="min-w-[180px]">
                Unlock {PRODUCT_LIMITS.totalTweaksLabel} Pro tweaks
              </Button>
            </div>

            <div
              className="animate-fade-in-up hero-proof-row mx-auto grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0 lg:max-w-none"
              style={{ animationDelay: "0.22s" }}
            >
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="hero-proof-card flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-left backdrop-blur-sm sm:flex-col sm:items-start sm:gap-2 sm:px-4 sm:py-4 lg:flex-row lg:items-center lg:gap-3"
                >
                  <span className="icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/30 bg-reflux-accent/12">
                    <Icon name={point.icon} size={18} glow />
                  </span>
                  <div className="min-w-0">
                    <div className="stat-number text-lg font-extrabold text-white">
                      {point.label}
                      <span className="ml-1 text-sm font-bold text-reflux-accent">{point.unit}</span>
                    </div>
                    <div className="text-[11px] text-reflux-muted">{point.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in-up mt-9 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={15} className="text-reflux-accent" />
                ))}
                <span className="ml-2.5 text-sm font-semibold text-white">Loved by gamers</span>
              </div>
              <span className="hidden h-5 w-px bg-white/15 sm:block" aria-hidden="true" />
              <span className="text-sm text-reflux-muted">
                <span className="stat-number font-bold text-reflux-green">{PRODUCT_LIMITS.totalTweaksLabel}</span> pro tweaks ·{" "}
                <span className="font-bold text-white">5 min</span> setup
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up relative" style={{ animationDelay: "0.12s" }}>
            <HeroShowcase />
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-16 w-screen max-w-[100vw] -translate-x-1/2 md:mt-20">
        <MarqueeStrip />
      </div>
    </section>
  );
}
