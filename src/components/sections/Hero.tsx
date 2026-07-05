import { Button } from "@/components/ui/Button";
import { AppIcon } from "@/components/ui/AppIcon";
import { HeroLaunchRail } from "./HeroLaunchRail";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { HeroGameTicker } from "./HeroGameTicker";
import { HeroGameMarquee } from "./HeroGameMarquee";
import { HeroShowcase } from "./HeroShowcase";

const proofPoints = [
  { icon: "bolt" as const, label: "+52", unit: "avg FPS", sub: "Real user results", accent: "#5dde86" },
  { icon: "internet" as const, label: "-6", unit: "ms ping", sub: "Lower input delay", accent: "#5ec4ef" },
  { icon: "shield" as const, label: "100%", unit: "reversible", sub: "Restore anytime", accent: "#ff9588" },
];

export function Hero() {
  return (
    <section className="hero-stage hero-stage--bleed relative w-full overflow-x-clip pb-4 pt-0 md:pt-4">
      <div className="hero-signature-watermark pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-beam pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-energy-slash pointer-events-none absolute hidden lg:block" aria-hidden="true" />

      <div className="hero-stage-inner relative mx-auto w-full max-w-[1480px]">
        <div className="hero-layout grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
          <div className="hero-copy overflow-visible text-center lg:text-left">
            <div className="animate-fade-in-up mb-5 flex justify-center lg:justify-start" style={{ animationDelay: "0.02s" }}>
              <HeroLaunchRail />
            </div>

            <div className="animate-fade-in-up mb-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start" style={{ animationDelay: "0.04s" }}>
              <p className="hero-edition-tag m-0">Windows gaming optimizer</p>
              <span className="hero-live-chip">
                <span className="hero-live-chip-dot" aria-hidden="true" />
                Live hardware detect
              </span>
            </div>

            <h1 className="hero-headline animate-fade-in-up mb-6 font-extrabold tracking-tight" style={{ animationDelay: "0.05s" }}>
              <span className="hero-headline-row block">
                <span className="hero-hud-index" aria-hidden="true">01</span>
                <span className="hero-headline-line text-white">Stop losing to lag.</span>
              </span>
              <span className="hero-headline-row hero-headline-row--accent mt-2 block md:mt-3">
                <span className="hero-hud-index hero-hud-index--accent" aria-hidden="true">02</span>
                <span className="hero-gradient-shimmer-wrap inline-block">
                  <span className="hero-gradient-shimmer">Start winning fights.</span>
                </span>
              </span>
            </h1>

            <p
              className="hero-tune-copy animate-fade-in-up mx-auto mb-8 max-w-xl text-base leading-relaxed text-reflux-text-soft md:text-lg lg:mx-0"
              style={{ animationDelay: "0.1s" }}
            >
              REFLUX tunes your PC for <HeroGameTicker /> and every game you grind. Live Intel / AMD /
              NVIDIA detection, zero background bloat.
            </p>

            <div
              className="hero-vendor-strip animate-fade-in-up mb-8 flex flex-wrap items-center justify-center lg:justify-start"
              style={{ animationDelay: "0.14s" }}
            >
              <span className="hero-vendor-strip-label">Detects</span>
              <div className="hero-vendor-row flex items-center gap-3">
                <VendorLogo vendor="nvidia" size={34} className="hero-vendor-logo" />
                <VendorLogo vendor="amd" size={34} className="hero-vendor-logo" />
                <VendorLogo vendor="intel" size={34} className="hero-vendor-logo" />
              </div>
            </div>

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
                  className="btn-angular min-w-[230px]"
                >
                  Download Free
                </Button>
              </div>
              <Button href="#app-gallery" variant="secondary" large className="btn-angular">
                See the app
              </Button>
            </div>

            <div className="animate-fade-in-up hero-stat-rail" style={{ animationDelay: "0.22s" }}>
              {proofPoints.map((point, i) => (
                <div key={point.label} className="hero-stat-rail-cell" style={{ ["--stat-accent" as string]: point.accent }}>
                  {i > 0 ? <span className="hero-stat-rail-divider" aria-hidden="true" /> : null}
                  <div className="hero-stat-rail-inner">
                    <div className="hero-stat-tile-icon hero-stat-tile-icon--rail">
                      <AppIcon name={point.icon} size={18} />
                    </div>
                    <div className="hero-stat-tile-body">
                      <div className="hero-stat-tile-value">
                        {point.label}
                        <span className="hero-stat-tile-unit">{point.unit}</span>
                      </div>
                      <div className="hero-stat-tile-sub">{point.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-showcase-col animate-fade-in-up w-full min-w-0" style={{ animationDelay: "0.12s" }}>
            <HeroShowcase />
          </div>
        </div>

        <HeroGameMarquee />
      </div>
    </section>
  );
}
