import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { HeroGameTicker } from "./HeroGameTicker";
import { HeroShowcase } from "./HeroShowcase";
import { MarqueeStrip } from "./MarqueeStrip";

const proofPoints = [
  { icon: "bolt" as const, label: "+52 avg FPS", sub: "Real user results" },
  { icon: "target" as const, label: "-6 ms ping", sub: "Lower input delay" },
  { icon: "shield" as const, label: "100% reversible", sub: "Restore anytime" },
];

export function Hero() {
  return (
    <section className="hero-stage relative overflow-hidden pb-4 pt-6 md:pt-10 lg:pt-12">
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-ring pointer-events-none absolute top-[12%] right-[8%] hidden h-72 w-72 rounded-full border border-reflux-accent/15 lg:block" aria-hidden="true" />
      <div className="hero-ring hero-ring-delay pointer-events-none absolute bottom-[18%] left-[4%] hidden h-48 w-48 rounded-full border border-reflux-calm/20 lg:block" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-1">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 xl:gap-14">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="hero-live-badge inline-flex items-center gap-2 rounded-full border border-reflux-green/30 bg-reflux-green/10 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-reflux-green uppercase">
                <span className="hero-live-dot h-2 w-2 rounded-full bg-reflux-green" />
                Free to download
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold text-reflux-muted">
                {PRODUCT_LIMITS.freeTweaks} tweaks · no card needed
              </span>
            </div>

            <h1
              className="hero-headline animate-fade-in-up mb-5 font-extrabold tracking-tight"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="block text-white">Stop losing to lag.</span>
              <span className="hero-gradient-shimmer mt-1 block">Start winning fights.</span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mb-6 max-w-xl text-base leading-relaxed text-[#a8b2c4] md:text-lg lg:mx-0"
              style={{ animationDelay: "0.1s" }}
            >
              REFLUX tunes your PC for{" "}
              <HeroGameTicker />
              {" "}and every game you grind — more frames, snappier inputs, cleaner Windows.
            </p>

            <div
              className="animate-fade-in-up mb-8 flex flex-wrap justify-center gap-3 lg:justify-start"
              style={{ animationDelay: "0.16s" }}
            >
              <div className="hero-cta-glow">
                <Button
                  href={REFLUX_FREE_DOWNLOAD.href}
                  download={REFLUX_FREE_DOWNLOAD.filename}
                  variant="primary"
                  large
                  showIcon
                  className="hero-cta-primary min-w-[200px] shadow-[0_0_40px_-8px_rgba(255,107,91,0.75)]"
                >
                  Download Free
                </Button>
              </div>
              <Button href="#pricing" variant="secondary" large className="min-w-[160px]">
                Unlock {PRODUCT_LIMITS.totalTweaksLabel} Pro tweaks
              </Button>
            </div>

            <div
              className="animate-fade-in-up hero-proof-row mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3 lg:mx-0 lg:max-w-none"
              style={{ animationDelay: "0.22s" }}
            >
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="hero-proof-card flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left sm:flex-col sm:items-start sm:gap-2 sm:px-4 sm:py-3.5 lg:flex-row lg:items-center lg:gap-3"
                >
                  <span className="icon-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/25 bg-reflux-accent/10">
                    <Icon name={point.icon} size={18} glow />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">{point.label}</div>
                    <div className="text-[11px] text-reflux-muted">{point.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={14} className="text-reflux-accent" />
                ))}
                <span className="ml-2 text-sm font-semibold text-white">Loved by gamers</span>
              </div>
              <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
              <span className="text-sm text-reflux-muted">
                <span className="font-bold text-reflux-green">{PRODUCT_LIMITS.totalTweaksLabel}</span> pro tweaks ·{" "}
                <span className="font-bold text-white">5 min</span> setup
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up relative" style={{ animationDelay: "0.12s" }}>
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
