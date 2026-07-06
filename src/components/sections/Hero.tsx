import { Button } from "@/components/ui/Button";
import { AppIcon } from "@/components/ui/AppIcon";
import { HeroLaunchRail } from "./HeroLaunchRail";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { HeroGameMarquee } from "./HeroGameMarquee";
import { HeroShowcase } from "./HeroShowcase";

const proofPoints = [
  { icon: "bolt" as const, label: "+52", unit: "avg FPS", sub: "Real user results", accent: "#5dde86" },
  { icon: "internet" as const, label: "-6", unit: "ms ping", sub: "Lower input delay", accent: "#5ec4ef" },
  { icon: "shield" as const, label: "100%", unit: "reversible", sub: "Restore anytime", accent: "#ff9588" },
];

export function Hero() {
  return (
    <section className="hero-stage hero-stage--bleed hero-stage--compact relative w-full overflow-x-clip pb-2 pt-0">
      <div className="hero-bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="hero-stage-inner relative mx-auto w-full max-w-[1480px]">
        <div className="hero-compact-flow flex flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.72fr)] lg:items-start lg:gap-6">
            <div className="hero-copy order-1 overflow-visible text-center lg:text-left">
              <div className="animate-fade-in-up mb-3 flex justify-center lg:justify-start" style={{ animationDelay: "0.02s" }}>
                <HeroLaunchRail />
              </div>

              <h1
                className="hero-headline hero-headline--compact animate-fade-in-up mb-3 font-extrabold tracking-tight"
                style={{ animationDelay: "0.05s" }}
              >
                <span className="hero-headline-line block text-white">Stop losing to lag.</span>
                <span className="hero-headline-row hero-headline-row--accent mt-1 block md:mt-1.5">
                  <span className="hero-gradient-shimmer-wrap inline-block">
                    <span className="hero-gradient-shimmer">Start winning fights.</span>
                  </span>
                </span>
              </h1>

              <p
                className="hero-tune-copy hero-tune-copy--compact animate-fade-in-up mx-auto mb-4 max-w-lg text-sm leading-relaxed text-reflux-text-soft md:text-base lg:mx-0"
                style={{ animationDelay: "0.08s" }}
              >
                One-click Windows tuning for CS2, Apex, Valorant, and every game you grind. Intel, AMD, and NVIDIA
                detected automatically.
              </p>

              <div
                className="animate-fade-in-up mb-1 flex flex-wrap justify-center gap-2.5 lg:justify-start"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="hero-cta-glow">
                  <Button
                    href={REFLUX_FREE_DOWNLOAD.href}
                    download={REFLUX_FREE_DOWNLOAD.filename}
                    variant="primary"
                    large
                    showIcon
                    className="btn-angular min-w-[210px]"
                  >
                    Download Free
                  </Button>
                </div>
                <Button href="#app-gallery" variant="secondary" large className="btn-angular">
                  See the app
                </Button>
              </div>
            </div>

            <div className="hero-marquee-slot order-2 lg:order-3 lg:col-span-2">
              <HeroGameMarquee prominent />
            </div>

            <div className="hero-showcase-col order-3 animate-fade-in-up w-full min-w-0 lg:order-2" style={{ animationDelay: "0.12s" }}>
              <HeroShowcase compact />
            </div>
          </div>

          <div
            className="hero-foot-band animate-fade-in-up flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-start lg:gap-4"
            style={{ animationDelay: "0.16s" }}
          >
            <div className="hero-vendor-strip hero-vendor-strip--compact flex flex-wrap items-center justify-center lg:justify-start">
              <span className="hero-vendor-strip-label">Detects</span>
              <div className="hero-vendor-row flex items-center gap-2.5">
                <VendorLogo vendor="nvidia" size={28} className="hero-vendor-logo" />
                <VendorLogo vendor="amd" size={28} className="hero-vendor-logo" />
                <VendorLogo vendor="intel" size={28} className="hero-vendor-logo" />
              </div>
            </div>

            <div className="hero-stat-rail hero-stat-rail--compact min-w-0 flex-1 sm:max-w-xl">
              {proofPoints.map((point, i) => (
                <div key={point.label} className="hero-stat-rail-cell" style={{ ["--stat-accent" as string]: point.accent }}>
                  {i > 0 ? <span className="hero-stat-rail-divider" aria-hidden="true" /> : null}
                  <div className="hero-stat-rail-inner">
                    <div className="hero-stat-tile-icon hero-stat-tile-icon--rail hero-stat-tile-icon--compact">
                      <AppIcon name={point.icon} size={16} />
                    </div>
                    <div className="hero-stat-tile-body">
                      <div className="hero-stat-tile-value hero-stat-tile-value--compact">
                        {point.label}
                        <span className="hero-stat-tile-unit">{point.unit}</span>
                      </div>
                      <div className="hero-stat-tile-sub hero-stat-tile-sub--compact">{point.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
