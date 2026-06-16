import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { HeroShowcase } from "./HeroShowcase";
import { MarqueeStrip } from "./MarqueeStrip";

const highlights = [
  { icon: "shield" as const, label: "Safe restore points" },
  { icon: "undo" as const, label: "Undo anytime" },
  { icon: "sparkle" as const, label: "No extra bloat" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-4 pt-10 md:pt-14 lg:pt-16">
      <div className="hero-beam pointer-events-none absolute top-0 left-1/2 h-[480px] w-[min(100%,820px)] -translate-x-1/2" aria-hidden="true" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
        <div className="text-center lg:text-left">
          <div className="animate-fade-in-up mb-5 flex justify-center lg:justify-start">
            <span className="section-eyebrow inline-flex">
              Built for PC gamers
            </span>
          </div>

          <h1
            className="animate-fade-in-up mb-5 text-[clamp(2.35rem,6vw,4.25rem)] leading-[1.08] font-extrabold tracking-tight"
            style={{ animationDelay: "0.06s" }}
          >
            Play smoother.
            <br />
            Hit more shots.
            <br />
            <span className="gradient-text">Feel the difference.</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mb-7 max-w-lg text-base leading-relaxed text-reflux-muted md:text-lg lg:mx-0"
            style={{ animationDelay: "0.12s" }}
          >
            REFLUX tunes your PC for gaming — more FPS, lower delay, cleaner Windows.
            Start free with {PRODUCT_LIMITS.freeTweaks} tweaks. Go Pro for {PRODUCT_LIMITS.totalTweaksLabel}.
          </p>

          <div
            className="animate-fade-in-up mb-7 flex flex-wrap justify-center gap-2.5 lg:justify-start"
            style={{ animationDelay: "0.18s" }}
          >
            {highlights.map((item) => (
              <span key={item.label} className="badge-pill badge-accent inline-flex items-center gap-1.5 text-[11px]">
                <Icon name={item.icon} size={13} strokeWidth={2.4} />
                {item.label}
              </span>
            ))}
          </div>

          <div
            className="animate-fade-in-up flex flex-wrap justify-center gap-3 lg:justify-start"
            style={{ animationDelay: "0.24s" }}
          >
            <Button
              href={REFLUX_FREE_DOWNLOAD.href}
              download={REFLUX_FREE_DOWNLOAD.filename}
              variant="primary"
              large
              showIcon
            >
              Download Free
            </Button>
            <Button href="#pricing" variant="secondary" large>
              See Pro
            </Button>
          </div>

          <div
            className="animate-fade-in-up mt-8 grid grid-cols-3 gap-2.5 sm:max-w-md lg:max-w-none"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { val: String(PRODUCT_LIMITS.freeTweaks), label: "Free tweaks", accent: false },
              { val: PRODUCT_LIMITS.totalTweaksLabel, label: "Pro tweaks", accent: true },
              { val: "5 min", label: "Setup time", accent: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="hero-stat-card rounded-2xl border border-white/8 bg-white/[0.025] px-3 py-3.5 text-center sm:px-4 sm:py-4"
              >
                <div className={`text-xl font-extrabold tabular-nums md:text-2xl ${stat.accent ? "gradient-text" : "text-white"}`}>
                  {stat.val}
                </div>
                <div className="mt-1 text-[10px] font-semibold tracking-wider text-reflux-muted uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up relative" style={{ animationDelay: "0.14s" }}>
          <HeroShowcase />
        </div>
      </div>

      <div className="relative left-1/2 mt-12 w-screen max-w-[100vw] -translate-x-1/2">
        <MarqueeStrip />
      </div>
    </section>
  );
}
