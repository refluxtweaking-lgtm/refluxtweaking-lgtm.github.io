import { Button } from "@/components/ui/Button";
import { AppIcon } from "@/components/ui/AppIcon";
import { HeroLaunchRail } from "./HeroLaunchRail";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { HeroGameTicker } from "./HeroGameTicker";
import { HeroGameMarquee } from "./HeroGameMarquee";
import { HeroShowcase } from "./HeroShowcase";

const proofPoints = [
  { icon: "bolt" as const, label: "+52", unit: "avg FPS", sub: "Real user results" },
  { icon: "internet" as const, label: "-6", unit: "ms ping", sub: "Lower input delay" },
  { icon: "shield" as const, label: "100%", unit: "reversible", sub: "Restore anytime" },
];

export function Hero() {
  return (
    <section className="hero-stage relative w-full overflow-visible pb-2 pt-2 md:pt-8">
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-beam pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 xl:gap-16">
          <div className="overflow-visible text-center lg:text-left">
            <div className="animate-fade-in-up mb-5 flex justify-center lg:justify-start" style={{ animationDelay: "0.02s" }}>
              <HeroLaunchRail />
            </div>

            <p className="hero-edition-tag animate-fade-in-up mb-4" style={{ animationDelay: "0.04s" }}>
              Windows gaming optimizer
            </p>

            <h1 className="hero-headline animate-fade-in-up mb-5 font-extrabold tracking-tight" style={{ animationDelay: "0.05s" }}>
              <span className="hero-headline-line block text-white">Stop losing to lag.</span>
              <span className="hero-gradient-shimmer-wrap mt-1 block md:mt-2">
                <span className="hero-gradient-shimmer">Start winning fights.</span>
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
              className="hero-vendor-strip animate-fade-in-up mb-7 flex flex-wrap items-center justify-center lg:justify-start"
              style={{ animationDelay: "0.14s" }}
            >
              <span className="hero-vendor-strip-label">Detects</span>
              <div className="hero-vendor-row flex items-center gap-2.5">
                <VendorLogo vendor="nvidia" size={32} className="hero-vendor-logo" />
                <VendorLogo vendor="amd" size={32} className="hero-vendor-logo" />
                <VendorLogo vendor="intel" size={32} className="hero-vendor-logo" />
              </div>
            </div>

            <div
              className="animate-fade-in-up mb-9 flex flex-wrap justify-center gap-3 lg:justify-start"
              style={{ animationDelay: "0.16s" }}
            >
              <div className="hero-cta-glow">
                <Button
                  href={REFLUX_FREE_DOWNLOAD.href}
                  download={REFLUX_FREE_DOWNLOAD.filename}
                  variant="primary"
                  large
                  showIcon
                  className="min-w-[220px] !rounded-xl"
                >
                  Download Free
                </Button>
              </div>
              <Button href="#app-gallery" variant="secondary" large className="!rounded-xl">
                See the app
              </Button>
            </div>

            <div
              className="animate-fade-in-up mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0"
              style={{ animationDelay: "0.22s" }}
            >
              {proofPoints.map((point) => (
                <div key={point.label} className="hero-stat-tile">
                  <div className="hero-stat-tile-accent" aria-hidden="true" />
                  <div className="hero-stat-tile-icon">
                    <AppIcon name={point.icon} size={20} />
                  </div>
                  <div className="hero-stat-tile-body">
                    <div className="hero-stat-tile-value">
                      {point.label}
                      <span className="hero-stat-tile-unit">{point.unit}</span>
                    </div>
                    <div className="hero-stat-tile-sub">{point.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up w-full min-w-0" style={{ animationDelay: "0.12s" }}>
            <HeroShowcase />
          </div>
        </div>

        <HeroGameMarquee />
      </div>
    </section>
  );
}
