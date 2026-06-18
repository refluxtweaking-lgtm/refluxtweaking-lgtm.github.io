"use client";

import { useState } from "react";
import Image from "next/image";
import { GameImage } from "@/components/games/GameImage";
import { AppIcon, AppIconChip } from "@/components/ui/AppIcon";
import { LiveMetricBar } from "@/components/ui/LiveMetricBar";
import { useInViewport } from "@/hooks/useInViewport";
import {
  AppPreviewHomePanel,
  AppPreviewOptimizerPanel,
  AppPreviewTweaksPanel,
  networkTweaks,
} from "./AppPreviewPanels";
import type { AppIconName } from "@/data/app-icons";

const VIEWS = ["home", "optimizer", "tweaks", "games", "network", "cleanup", "benchmarks"] as const;
type AppView = (typeof VIEWS)[number];

const STEAM_HEADER = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

const PREVIEW_GAMES = [
  {
    sources: [STEAM_HEADER(730)],
    alt: "Counter-Strike 2",
    fallbackTitle: "CS2",
    fallbackSubtitle: "Steam",
    fallbackGradient: "from-orange-900/80 via-slate-900 to-black",
  },
  {
    sources: [STEAM_HEADER(1172470)],
    alt: "Apex Legends",
    fallbackTitle: "APEX",
    fallbackSubtitle: "Steam",
    fallbackGradient: "from-red-900/80 via-slate-900 to-black",
  },
  {
    sources: [STEAM_HEADER(1091500)],
    alt: "Cyberpunk 2077",
    fallbackTitle: "CYBERPUNK",
    fallbackSubtitle: "Steam",
    fallbackGradient: "from-cyan-900/80 via-slate-900 to-black",
  },
] as const;

const BENCH_STATS = [
  { label: "GPU FPS", value: "144", color: "linear-gradient(90deg, #ff6b5b, #ff9588)", glow: "rgba(255,107,91,0.55)", fill: 78 },
  { label: "CPU", value: "94%", color: "linear-gradient(90deg, #5dde86, #3ecf70)", glow: "rgba(93,222,134,0.5)", fill: 94 },
  { label: "RAM Free", value: "31 GB", color: "linear-gradient(90deg, #b392f0, #9b7de8)", glow: "rgba(167,139,250,0.5)", fill: 68 },
] as const;

const TAB_LABELS: Record<AppView, string> = {
  home: "Home",
  optimizer: "Optimizer",
  tweaks: "Tweaks",
  games: "Games",
  network: "Network",
  cleanup: "Cleanup",
  benchmarks: "Benchmarks",
};

const sidebarNav: { icon: AppIconName; label: string; view: AppView }[] = [
  { icon: "home", label: "Home", view: "home" },
  { icon: "optimizer", label: "Opt", view: "optimizer" },
  { icon: "games", label: "Games", view: "games" },
  { icon: "internet", label: "Net", view: "network" },
  { icon: "cleanup", label: "Clean", view: "cleanup" },
  { icon: "benchmark", label: "Bench", view: "benchmarks" },
];

const sidebarExtra: { icon: AppIconName; label: string; view: AppView }[] = [
  { icon: "cpu", label: "CPU", view: "tweaks" },
  { icon: "gpu", label: "GPU", view: "optimizer" },
  { icon: "ram", label: "RAM", view: "home" },
  { icon: "debloat", label: "Debloat", view: "cleanup" },
  { icon: "system", label: "Sys", view: "tweaks" },
];

interface AppPreviewMockProps {
  hero?: boolean;
}

function PreviewBenchmarks({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {BENCH_STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="flex flex-col rounded-xl border border-reflux-border/40 bg-[#0f1217]/90 p-3 sm:p-3.5"
        >
          <div className="mb-2 text-xl font-extrabold tabular-nums sm:text-2xl">
            <span className="gradient-text">{stat.value}</span>
          </div>
          <LiveMetricBar
            label={stat.label}
            value=""
            fill={stat.fill}
            color={stat.color}
            glow={stat.glow}
            delay={i * 0.4}
            active={active}
          />
        </div>
      ))}
    </div>
  );
}

export function AppPreviewMock({ hero = false }: AppPreviewMockProps) {
  const [view, setView] = useState<AppView>("home");
  const { ref, visible } = useInViewport<HTMLDivElement>("120px");

  const shellClass = hero
    ? "rounded-none border-0 bg-transparent shadow-none"
    : "max-w-4xl rounded-2xl border border-[rgba(241,91,80,0.35)] bg-[#080a0d] shadow-[0_0_60px_rgba(241,91,80,0.12),0_0_0_1px_rgba(255,255,255,0.04)_inset]";

  const selectView = (next: AppView) => setView(next);

  return (
    <div ref={ref} className={`mx-auto w-full overflow-hidden ${shellClass}`}>
      {!hero && (
        <div className="flex items-center gap-2 border-b border-reflux-border/80 bg-[#0a0b0e] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-reflux-muted">REFLUX PRO — Unlocked</span>
        </div>
      )}

      <div
        className={`flex items-center justify-between border-b border-reflux-border/60 bg-gradient-to-r from-[#0c0e12] to-[#0a0b0e] ${hero ? "px-4 py-3" : "px-5 py-4"}`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Image src="/favicon.ico" alt="" width={32} height={32} className="rounded-lg shadow-[0_0_12px_rgba(255,107,91,0.5)]" />
          <span className="text-base font-extrabold gradient-text sm:text-lg">REFLUX PRO</span>
          <span className="badge-pill badge-live text-[9px] sm:text-[10px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
            Ready
          </span>
        </div>
        <span className="hidden text-[10px] text-reflux-muted sm:inline">Administrator</span>
      </div>

      <div className="flex min-h-[320px] sm:min-h-[360px]">
        {hero && (
          <aside className="hidden w-[76px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-reflux-border/40 bg-[#080a0d] py-2 sm:flex">
            {[...sidebarNav, ...sidebarExtra].map((item) => {
              const isActive = view === item.view;
              return (
                <button
                  key={`${item.icon}-${item.label}`}
                  type="button"
                  onClick={() => selectView(item.view)}
                  className={`mx-1.5 flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[8px] font-bold transition-all ${
                    isActive
                      ? "bg-reflux-accent/15 text-reflux-accent"
                      : "text-reflux-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <AppIconChip name={item.icon} size={16} chipSize={30} active={isActive} />
                  {item.label}
                </button>
              );
            })}
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex gap-0.5 overflow-x-auto border-b border-reflux-border/40 bg-[#0a0c10] px-2 sm:px-3">
            {VIEWS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectView(id)}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:px-4 sm:py-3 sm:text-sm ${
                  view === id
                    ? "border-reflux-accent text-reflux-accent"
                    : "border-transparent text-reflux-muted hover:text-white"
                }`}
              >
                {TAB_LABELS[id]}
              </button>
            ))}
          </div>

          <div className={`min-h-[260px] bg-gradient-to-b from-[#0c0e12] to-[#080a0d] ${hero ? "p-4 sm:p-5" : "p-6"}`}>
            {view === "home" && <AppPreviewHomePanel />}
            {view === "optimizer" && <AppPreviewOptimizerPanel />}
            {view === "tweaks" && <AppPreviewTweaksPanel />}

            {view === "games" && (
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {PREVIEW_GAMES.map((game) => (
                  <div
                    key={game.alt}
                    className="group relative overflow-hidden rounded-xl border border-reflux-border/60 bg-[#0f1217] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  >
                    <div className="aspect-[460/215] overflow-hidden">
                      <GameImage {...game} sources={[...game.sources]} />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                    <div className="absolute inset-x-0 bottom-0 p-2">
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-reflux-accent/50 bg-black/45 py-1.5 text-[9px] font-bold text-reflux-accent backdrop-blur-sm sm:text-[10px]"
                      >
                        <AppIcon name="games" size={12} glow={false} />
                        Optimize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "network" && (
              <div className="space-y-2">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AppIcon name="internet" size={20} />
                    <div>
                      <div className="text-sm font-bold text-white">Network</div>
                      <div className="text-[11px] text-reflux-muted">Latency & connection tweaks</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-reflux-accent/40 bg-reflux-accent/10 px-3 py-1.5 text-[10px] font-bold text-reflux-accent sm:px-4 sm:py-2 sm:text-xs"
                  >
                    Apply All
                  </button>
                </div>
                {networkTweaks.map((tweak) => (
                  <div
                    key={tweak.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-reflux-border/50 bg-[#0f1217]/90 px-3 py-2.5 sm:px-4 sm:py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white sm:text-sm">{tweak.name}</div>
                      <div className="mt-0.5 text-[10px] text-reflux-muted">{tweak.desc}</div>
                    </div>
                    <div
                      className={`relative h-5 w-9 shrink-0 rounded-full sm:h-6 sm:w-11 ${tweak.on ? "bg-reflux-accent shadow-[0_0_10px_rgba(241,91,80,0.45)]" : "bg-reflux-border"}`}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform sm:h-5 sm:w-5 ${tweak.on ? "translate-x-4 sm:translate-x-5" : "translate-x-0.5"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "cleanup" && (
              <div className="py-4 text-center sm:py-6">
                <AppIcon name="cleanup" size={28} className="mx-auto mb-2" />
                <div className="text-4xl font-extrabold text-reflux-green sm:text-5xl">12.4 GB</div>
                <div className="mt-2 text-xs text-reflux-muted sm:text-sm">Ready to recover</div>
                <div className="mx-auto mt-4 max-w-xs">
                  <LiveMetricBar
                    label="Disk recoverable"
                    value="12.4 GB"
                    fill={68}
                    color="linear-gradient(90deg, #ff6b5b, #5dde86)"
                    glow="rgba(93,222,134,0.45)"
                    active={visible}
                  />
                </div>
              </div>
            )}

            {view === "benchmarks" && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <AppIcon name="benchmark" size={18} />
                  <span className="text-sm font-bold text-white">Live Benchmarks</span>
                </div>
                <PreviewBenchmarks active={visible} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
