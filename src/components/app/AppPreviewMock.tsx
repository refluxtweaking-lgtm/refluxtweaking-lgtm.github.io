"use client";

import { useEffect, useState } from "react";
import { GameImage } from "@/components/games/GameImage";
import { useInViewport } from "@/hooks/useInViewport";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const tabs = ["Tweaks", "Games", "Network", "Cleanup", "Benchmarks"] as const;

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
  { label: "GPU FPS", value: "144", color: "text-reflux-accent", stroke: "#F15B50", width: "78%" },
  { label: "CPU", value: "94%", color: "text-reflux-green", stroke: "#5DDE86", width: "94%" },
  { label: "RAM Free", value: "31 GB", color: "text-reflux-purple", stroke: "#B392F0", width: "68%" },
] as const;

function PreviewBenchmarks() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
      {BENCH_STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col rounded-xl border border-reflux-border/40 bg-[#0f1217]/90 p-2.5 sm:p-3"
        >
          <div className="text-xl font-extrabold tabular-nums sm:text-2xl">
            <span className={stat.color}>{stat.value}</span>
          </div>
          <div className="text-[9px] font-semibold uppercase tracking-wider text-reflux-muted">{stat.label}</div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-reflux-border/80">
            <div
              className="h-full rounded-full"
              style={{ width: stat.width, backgroundColor: stat.stroke, opacity: 0.85 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const navItems = [
  { id: "Tweaks", label: "Home", short: "Tw" },
  { id: "Games", label: "Games", short: "Gm" },
  { id: "Network", label: "Net", short: "Nw" },
  { id: "Cleanup", label: "Clean", short: "Cl" },
  { id: "Benchmarks", label: "Bench", short: "Bn" },
] as const;

const sampleTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, tag: "Network" },
  { name: "High Performance Power Plan", on: true, tag: "CPU" },
  { name: "Disable Core Parking", on: true, tag: "CPU" },
  { name: "QoS Packet Prioritization", on: false, tag: "Network" },
];

interface AppPreviewMockProps {
  hero?: boolean;
  autoPlay?: boolean;
}

export function AppPreviewMock({ hero = false, autoPlay = false }: AppPreviewMockProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Tweaks");
  const { ref, visible } = useInViewport<HTMLDivElement>("120px");

  useEffect(() => {
    if (!autoPlay || !visible) return;
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const idx = tabs.indexOf(current);
        return tabs[(idx + 1) % tabs.length];
      });
    }, 3600);
    return () => clearInterval(interval);
  }, [autoPlay, visible]);

  const shellClass = hero
    ? "rounded-none border-0 bg-transparent shadow-none"
    : "max-w-4xl rounded-2xl border border-[rgba(241,91,80,0.35)] bg-[#080a0d] shadow-[0_0_60px_rgba(241,91,80,0.12),0_0_0_1px_rgba(255,255,255,0.04)_inset]";

  const content = (
    <>
      {!hero && (
        <div className="flex items-center gap-2 border-b border-reflux-border/80 bg-[#0a0b0e] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-reflux-muted">REFLUX PRO — Unlocked</span>
        </div>
      )}

      <div className={`flex items-center justify-between border-b border-reflux-border/60 bg-gradient-to-r from-[#0c0e12] to-[#0a0b0e] ${hero ? "px-4 py-3" : "px-5 py-4"}`}>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-reflux-accent to-[#c43d35] text-[10px] font-black text-white sm:h-8 sm:w-8 sm:text-xs">
            R
          </span>
          <span className="text-base font-extrabold gradient-text sm:text-lg">REFLUX PRO</span>
          <span className="badge-pill badge-live text-[9px] sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-reflux-green" />
            Ready
          </span>
        </div>
        <span className="hidden text-[10px] text-reflux-muted sm:inline">Administrator</span>
      </div>

      <div className="flex min-h-[300px] sm:min-h-[320px]">
        {hero && (
          <aside className="hidden w-[72px] shrink-0 border-r border-reflux-border/40 bg-[#080a0d] py-3 sm:flex sm:flex-col sm:gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`mx-2 flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[9px] font-bold transition-all ${
                  activeTab === item.id
                    ? "bg-reflux-accent/15 text-reflux-accent shadow-[inset_0_0_0_1px_rgba(241,91,80,0.35)]"
                    : "text-reflux-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/6 bg-black/30 text-[10px]">
                  {item.short}
                </span>
                {item.label}
              </button>
            ))}
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex gap-0.5 overflow-x-auto border-b border-reflux-border/40 bg-[#0a0c10] px-2 sm:px-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:px-4 sm:py-3 sm:text-sm ${
                  activeTab === tab
                    ? "border-reflux-accent text-reflux-accent"
                    : "border-transparent text-reflux-muted hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`bg-gradient-to-b from-[#0c0e12] to-[#080a0d] ${hero ? "p-4 sm:p-5" : "p-6"}`}>
            {activeTab === "Tweaks" && (
              <div className="space-y-2">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">Optimizer</div>
                    <div className="text-[11px] text-reflux-muted">
                      {PRODUCT_LIMITS.freeTweaks} free · {PRODUCT_LIMITS.totalTweaksLabel} pro
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg bg-gradient-to-r from-reflux-accent to-[#c43d35] px-3 py-1.5 text-[10px] font-bold text-white shadow-[0_0_16px_rgba(241,91,80,0.35)] sm:px-4 sm:py-2 sm:text-xs"
                  >
                    Apply All
                  </button>
                </div>
                {sampleTweaks.map((tweak) => (
                  <div
                    key={tweak.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-reflux-border/50 bg-[#0f1217]/90 px-3 py-2.5 sm:px-4 sm:py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold sm:text-sm">{tweak.name}</div>
                      <div className="mt-0.5 text-[10px] text-reflux-muted">{tweak.tag}</div>
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

            {activeTab === "Games" && (
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {PREVIEW_GAMES.map((game) => (
                  <div
                    key={game.alt}
                    className="group relative overflow-hidden rounded-xl border border-reflux-border/60 bg-[#0f1217] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  >
                    <div className="aspect-[460/215] overflow-hidden">
                      <GameImage {...game} sources={[...game.sources]} />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-2">
                      <button
                        type="button"
                        className="w-full rounded-lg border border-reflux-accent/50 bg-black/45 py-1.5 text-[9px] font-bold text-reflux-accent backdrop-blur-sm transition-colors group-hover:border-reflux-accent group-hover:bg-reflux-accent/15 sm:text-[10px]"
                      >
                        Optimize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Network" && (
              <div className="py-2 sm:py-4">
                <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-reflux-border/50 bg-[#0f1217]/80 p-3 text-center">
                    <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Before</div>
                    <div className="mt-1 text-2xl font-extrabold text-[#5a6578] line-through sm:text-3xl">85</div>
                    <div className="text-[10px] text-reflux-muted">ms ping</div>
                  </div>
                  <div className="rounded-xl border border-reflux-green/25 bg-reflux-green/5 p-3 text-center shadow-[0_0_20px_rgba(93,222,134,0.08)]">
                    <div className="text-[10px] font-bold tracking-wider text-reflux-green uppercase">After</div>
                    <div className="mt-1 text-2xl font-extrabold gradient-text sm:text-3xl">18</div>
                    <div className="text-[10px] text-reflux-muted">ms ping</div>
                  </div>
                </div>
                <div className="h-16 overflow-hidden rounded-xl border border-reflux-border/40 bg-[#0a0c10] px-3 py-2">
                  <svg viewBox="0 0 200 48" className="h-full w-full" aria-hidden="true">
                    <polyline
                      fill="none"
                      stroke="rgba(241,91,80,0.85)"
                      strokeWidth="2"
                      points="0,38 24,34 48,30 72,24 96,18 120,14 144,12 168,10 200,8"
                    />
                    <linearGradient id="pingFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(241,91,80,0.25)" />
                      <stop offset="100%" stopColor="rgba(241,91,80,0)" />
                    </linearGradient>
                    <polygon
                      fill="url(#pingFill)"
                      points="0,48 0,38 24,34 48,30 72,24 96,18 120,14 144,12 168,10 200,8 200,48"
                    />
                  </svg>
                </div>
              </div>
            )}

            {activeTab === "Cleanup" && (
              <div className="py-4 text-center sm:py-6">
                <div className="text-4xl font-extrabold text-reflux-green sm:text-5xl">12.4 GB</div>
                <div className="mt-2 text-xs text-reflux-muted sm:text-sm">Ready to recover</div>
                <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-reflux-border">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-reflux-accent to-reflux-green" />
                </div>
              </div>
            )}

            {activeTab === "Benchmarks" && <PreviewBenchmarks />}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div ref={ref} className={`mx-auto w-full overflow-hidden ${shellClass}`}>
      {content}
    </div>
  );
}
