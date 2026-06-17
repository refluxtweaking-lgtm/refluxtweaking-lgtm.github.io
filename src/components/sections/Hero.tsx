import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { HeroGameTicker } from "./HeroGameTicker";
import { HeroShowcase } from "./HeroShowcase";
import { MarqueeStrip } from "./MarqueeStrip";

const proofPoints = [
  { icon: "bolt" as const, label: "+52", unit: "avg FPS", sub: "Real user results", color: "text-reflux-accent" },
  { icon: "target" as const, label: "-6", unit: "ms ping", sub: "Lower input delay", color: "text-reflux-calm" },
  { icon: "shield" as const, label: "100%", unit: "reversible", sub: "Restore anytime", color: "text-reflux-green" },
];

export function Hero() {
  return (
    <section className="hero-stage relative w-full overflow-visible pb-6 pt-2 md:pt-6 lg:pt-8">
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-ring pointer-events-none absolute top-[8%] right-[4%] hidden h-96 w-96 rounded-full border-2 border-reflux-accent/25 lg:block" aria-hidden="true" />
      <div className="hero-ring hero-ring-delay pointer-events-none absolute bottom-[12%] left-[0%] hidden h-64 w-64 rounded-full border-2 border-reflux-calm/30 lg:block" aria-hidden="true" />

      <div className="relative w-full">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up mb-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="hero-live-badge inline-flex items-center gap-2 rounded-full border border-reflux-green/45 bg-reflux-green/15 px-4 py-2 text-[11px] font-bold tracking-wide text-reflux-green uppercase shadow-[0_0_24px_-6px_rgba(78,232,138,0.6)]">
                <span className="hero-live-dot h-2 w-2 rounded-full bg-reflux-green" />
                Free to download
              </span>
              <span className="rounded-full border border-reflux-accent/30 bg-reflux-accent/10 px-4 py-2 text-[11px] font-semibold text-[#ffc4bb] shadow-[0_0_20px_-8px_rgba(255,107,91,0.5)]">
                {PRODUCT_LIMITS.freeTweaks} tweaks · no card needed
              </span>
            </div>

            <h1
              className="hero-headline animate-fade-in-up mb-6 font-extrabold tracking-tight"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="block text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">Stop losing to lag.</span>
              <span className="hero-gradient-shimmer mt-2 block">Start winning fights.</span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#b0bccf] md:text-lg lg:mx-0"
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
                  className="hero-cta-primary min-w-[220px] !text-base"
                >
                  Download Free
                </Button>
              </div>
              <Button href="#pricing" variant="secondary" large className="min-w-[180px] !text-base">
                Unlock {PRODUCT_LIMITS.totalTweaksLabel} Pro tweaks
              </Button>
            </div>

            <div
              className="animate-fade-in-up hero-proof-row mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0"
              style={{ animationDelay: "0.22s" }}
            >
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="hero-proof-card flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-4 text-left shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md"
                >
                  <span className="icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08]">
                    <Icon name={point.icon} size={18} glow className={point.color} />
                  </span>
                  <div className="min-w-0">
                    <div className="stat-number text-lg font-extrabold text-white">
                      {point.label}
                      <span className={`ml-1 text-sm font-bold ${point.color}`}>{point.unit}</span>
                    </div>
                    <div className="text-[11px] text-reflux-muted">{point.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={16} className="text-reflux-accent drop-shadow-[0_0_6px_rgba(255,107,91,0.8)]" />
                ))}
                <span className="ml-2.5 text-sm font-semibold text-white">Loved by gamers</span>
              </div>
              <span className="hidden h-5 w-px bg-white/20 sm:block" aria-hidden="true" />
              <span className="text-sm text-reflux-muted">
                <span className="stat-number font-bold text-reflux-green">{PRODUCT_LIMITS.totalTweaksLabel}</span> pro tweaks ·{" "}
                <span className="font-bold text-white">5 min</span> setup
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up relative w-full min-w-0" style={{ animationDelay: "0.12s" }}>
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
