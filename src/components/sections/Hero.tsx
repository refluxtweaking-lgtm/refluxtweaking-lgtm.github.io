import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { HeroShowcase } from "./HeroShowcase";
import { MarqueeStrip } from "./MarqueeStrip";

const highlights = [
  { icon: "shield" as const, label: "Restore points" },
  { icon: "undo" as const, label: "Fully reversible" },
  { icon: "sparkle" as const, label: "No background bloat" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-4 pt-8 md:pt-12 lg:pt-16">
      <div className="hero-beam pointer-events-none absolute top-0 left-1/2 h-[520px] w-[min(100%,900px)] -translate-x-1/2" aria-hidden="true" />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
        <div className="text-center lg:text-left">
          <div className="animate-fade-in-up mb-6 flex justify-center lg:justify-start">
            <span className="section-eyebrow inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
              Windows gaming optimizer
            </span>
          </div>

          <h1
            className="animate-fade-in-up mb-6 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-extrabold tracking-tight"
            style={{ animationDelay: "0.08s" }}
          >
            More FPS.
            <br />
            Lower latency.
            <br />
            <span className="gradient-text">One clean app.</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mb-8 max-w-xl text-lg leading-relaxed text-reflux-muted md:text-xl lg:mx-0"
            style={{ animationDelay: "0.16s" }}
          >
            {PRODUCT_LIMITS.proTweaks} hand-picked optimizations — not thousands of random registry edits.
            Start free with {PRODUCT_LIMITS.freeTweaks} tweaks, then unlock the full toolkit with Pro.
          </p>

          <div
            className="animate-fade-in-up mb-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            style={{ animationDelay: "0.22s" }}
          >
            {highlights.map((item) => (
              <span key={item.label} className="badge-pill badge-accent inline-flex items-center gap-1.5 text-[11px]">
                <Icon name={item.icon} size={13} strokeWidth={2.4} />
                {item.label}
              </span>
            ))}
          </div>

          <div
            className="animate-fade-in-up flex flex-wrap justify-center gap-4 lg:justify-start"
            style={{ animationDelay: "0.28s" }}
          >
            <Button
              href={REFLUX_FREE_DOWNLOAD.href}
              download={REFLUX_FREE_DOWNLOAD.filename}
              variant="primary"
              large
              showIcon
            >
              Download Free — {PRODUCT_LIMITS.freeTweaks} Tweaks
            </Button>
            <Button href="#pricing" variant="secondary" large>
              See Pro Plans
            </Button>
          </div>

          <div
            className="animate-fade-in-up mt-10 grid grid-cols-3 gap-3 sm:max-w-md lg:max-w-none"
            style={{ animationDelay: "0.36s" }}
          >
            {[
              { val: String(PRODUCT_LIMITS.freeTweaks), label: "Free tweaks", accent: false },
              { val: PRODUCT_LIMITS.totalTweaksLabel, label: "Pro tweaks", accent: true },
              { val: "5 min", label: "To optimize", accent: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="hero-stat-card rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm sm:px-4 sm:py-5"
              >
                <div className={`text-2xl font-extrabold tabular-nums md:text-3xl ${stat.accent ? "gradient-text" : "text-white"}`}>
                  {stat.val}
                </div>
                <div className="mt-1 text-[10px] font-bold tracking-wider text-reflux-muted uppercase sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up relative" style={{ animationDelay: "0.2s" }}>
          <HeroShowcase />
        </div>
      </div>

      <div className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2">
        <MarqueeStrip />
      </div>
    </section>
  );
}
