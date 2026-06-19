import { Button } from "@/components/ui/Button";
import { AppIcon } from "@/components/ui/AppIcon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { HeroGameTicker } from "./HeroGameTicker";
import { HeroShowcase } from "./HeroShowcase";

const proofPoints = [
  { icon: "bolt" as const, label: "+52", unit: "avg FPS", sub: "Real user results" },
  { icon: "internet" as const, label: "-6", unit: "ms ping", sub: "Lower input delay" },
  { icon: "shield" as const, label: "100%", unit: "reversible", sub: "Restore anytime" },
];

export function Hero() {
  return (
    <section className="hero-stage relative w-full overflow-visible pb-6 pt-2 md:pt-8">
      <div className="relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-visible text-center lg:text-left">
            <div className="animate-fade-in-up mb-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <span className="hero-live-badge reflux-glow-interactive inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold tracking-wide text-reflux-accent uppercase">
                <span className="hero-live-dot h-2 w-2 rounded-full bg-reflux-accent shadow-[0_0_8px_rgba(255,107,91,0.8)]" />
                Free to download
              </span>
            </div>

            <h1 className="hero-headline animate-fade-in-up mb-5 font-extrabold tracking-tight" style={{ animationDelay: "0.05s" }}>
              <span className="hero-headline-line block text-white">Stop losing to lag.</span>
              <span className="hero-gradient-shimmer-wrap mt-2 block">
                <span className="hero-gradient-shimmer">Start winning fights.</span>
              </span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mb-8 max-w-lg text-base leading-relaxed text-reflux-text-soft md:text-lg lg:mx-0"
              style={{ animationDelay: "0.1s" }}
            >
              REFLUX tunes your PC for <HeroGameTicker /> and every game you grind — live Intel / AMD /
              NVIDIA detection, {PRODUCT_LIMITS.totalTweaksLabel} pro tweaks, zero background bloat.
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
                  className="min-w-[210px]"
                >
                  Download Free
                </Button>
              </div>
              <Button href="#app-gallery" variant="secondary" large>
                See the app
              </Button>
            </div>

            <div
              className="animate-fade-in-up mx-auto grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 lg:mx-0"
              style={{ animationDelay: "0.22s" }}
            >
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="hero-proof-card reflux-glow-box flex items-center gap-3 px-4 py-3.5"
                >
                  <AppIcon name={point.icon} size={18} />
                  <div className="min-w-0">
                    <div className="hero-metric-value text-lg font-bold text-white md:text-xl">
                      {point.label}
                      <span className="ml-1 text-xs font-semibold text-reflux-accent">{point.unit}</span>
                    </div>
                    <div className="text-[11px] text-reflux-muted">{point.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up w-full min-w-0" style={{ animationDelay: "0.12s" }}>
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
