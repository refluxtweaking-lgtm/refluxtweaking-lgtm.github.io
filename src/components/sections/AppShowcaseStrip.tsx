"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { LiveMetricBar } from "@/components/ui/LiveMetricBar";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const showcaseCards = [
  {
    id: "tweaks",
    title: "System Tweaks",
    desc: "Fine-tune Windows from core settings — each toggle explains what it does.",
    ui: "tweak",
  },
  {
    id: "detect",
    title: "Smart Detection",
    desc: "Recommendations tailored to your CPU, GPU, and Windows build.",
    ui: "detect",
  },
  {
    id: "games",
    title: "Game Optimizations",
    desc: "Auto-find Steam & Epic titles — hit Optimize on your main games.",
    ui: "games",
  },
  {
    id: "cleanup",
    title: "System Cleaner",
    desc: "Clear temp, cache, and junk — watch the recoverable space bar fill up.",
    ui: "cleanup",
  },
] as const;

function ShowcaseUi({ type }: { type: (typeof showcaseCards)[number]["ui"] }) {
  if (type === "tweak") {
    return (
      <div className="showcase-ui-panel mx-auto w-[88%] rounded-xl border border-white/10 bg-[#0d1018]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="mb-2 flex items-center gap-2">
          <AppIcon name="optimizer" size={14} />
          <span className="text-[11px] font-bold text-white">Disable Core Parking</span>
        </div>
        <p className="mb-3 text-[9px] leading-relaxed text-reflux-muted">
          Keeps all CPU cores awake during gaming for smoother 1% lows.
        </p>
        <div className="flex items-center justify-between">
          <span className="rounded-md border border-reflux-accent/30 bg-reflux-accent/10 px-2 py-0.5 text-[8px] font-bold text-reflux-accent">
            1 Warning
          </span>
          <div className="relative h-5 w-9 rounded-full bg-reflux-accent shadow-[0_0_12px_rgba(255,107,91,0.5)]">
            <div className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow-md" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "detect") {
    const items = [
      { label: "Graphics card detected", value: "NVIDIA GeForce RTX 4070", icon: "gpu" as const },
      { label: "Windows build detected", value: "Windows 11 24H2", icon: "system" as const },
      { label: "Processor detected", value: "AMD Ryzen 7 7800X3D", icon: "cpu" as const },
    ];
    return (
      <div className="showcase-ui-panel mx-auto w-[90%] space-y-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-white/8 bg-[#0d1018]/90 px-2.5 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold text-reflux-green">
              <span className="text-reflux-green">✓</span>
              {item.label}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-white/6 bg-black/30 px-2 py-1.5">
              <AppIcon name={item.icon} size={12} glow={false} />
              <span className="truncate text-[10px] font-medium text-white">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "games") {
    const games = [
      { name: "Fortnite", status: "optimize" as const },
      { name: "Valorant", status: "done" as const },
      { name: "CS2", status: "idle" as const },
    ];
    return (
      <div className="showcase-ui-panel mx-auto w-[92%] space-y-1.5">
        {games.map((g) => (
          <div
            key={g.name}
            className="flex items-center justify-between rounded-lg border border-white/8 bg-[#0d1018]/90 px-2.5 py-2"
          >
            <div className="flex items-center gap-2">
              <AppIcon name="games" size={14} glow={false} />
              <span className="text-[11px] font-semibold text-white">{g.name}</span>
            </div>
            {g.status === "optimize" ? (
              <span className="rounded-md border border-reflux-green/40 bg-reflux-green/10 px-2 py-0.5 text-[8px] font-bold text-reflux-green">
                Optimize
              </span>
            ) : g.status === "done" ? (
              <span className="text-[8px] font-bold text-reflux-green">Optimized ✓</span>
            ) : (
              <span className="rounded-md border border-orange-400/30 bg-orange-400/8 px-2 py-0.5 text-[8px] font-bold text-orange-300">
                Not optimized
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="showcase-ui-panel mx-auto w-[90%] space-y-2">
      {["Clear Temp Files", "Clear Game Cache", "Clear Installer Cache"].map((task) => (
        <div key={task} className="flex items-center gap-2 rounded-lg border border-white/6 bg-[#0d1018]/80 px-2.5 py-2">
          <AppIcon name="cleanup" size={12} glow={false} />
          <span className="text-[10px] font-medium text-white/90">{task}</span>
        </div>
      ))}
      <LiveMetricBar
        label="Recoverable"
        value="12.4 GB"
        fill={72}
        color="linear-gradient(90deg, #ff6b5b, #b392f0)"
        glow="rgba(179,146,240,0.5)"
      />
    </div>
  );
}

export function AppShowcaseStrip() {
  return (
    <section id="app-showcase" className="app-showcase-section section-flow overflow-hidden">
      <div className="section-flow-divider" aria-hidden="true" />

      <div className="mx-auto mb-10 flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-end">
        <FlowIn>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Optimize your system{" "}
            <span className="gradient-text">for free.</span>
          </h2>
          <p className="mt-2 max-w-md text-sm text-reflux-muted md:text-base">
            {PRODUCT_LIMITS.freeTweaks} tweaks in the full desktop app — real UI, not a landing-page mockup.
          </p>
        </FlowIn>
        <FlowIn delay={80}>
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            variant="secondary"
            large
            showIcon
          >
            Download for free
          </Button>
        </FlowIn>
      </div>

      <div className="showcase-scroll-wrap relative">
        <div className="showcase-scroll-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-20" aria-hidden="true" />
        <div className="showcase-scroll-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-20" aria-hidden="true" />
        <div className="showcase-scroll-track flex gap-4 overflow-x-auto px-4 pb-4 md:gap-5 md:px-8">
          {showcaseCards.map((card, i) => (
            <FlowIn
              key={card.id}
              delay={i * 80}
              className="showcase-card group w-[min(82vw,300px)] shrink-0 md:w-[280px]"
            >
              <div className="showcase-card-inner flex h-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#141820] to-[#0a0c12] transition-all duration-300 group-hover:border-reflux-accent/35 group-hover:shadow-[0_0_48px_-12px_rgba(255,107,91,0.45)]">
                <div className="showcase-card-ui relative flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_80%,rgba(255,107,91,0.08),transparent_70%)] p-4 pt-6">
                  <ShowcaseUi type={card.ui} />
                </div>
                <div className="border-t border-white/8 p-4">
                  <div className="font-bold text-white">{card.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-reflux-muted">{card.desc}</p>
                </div>
              </div>
            </FlowIn>
          ))}
        </div>
      </div>
    </section>
  );
}
