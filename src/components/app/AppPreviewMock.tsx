"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GameImage } from "@/components/games/GameImage";
import { AppIcon, AppIconChip } from "@/components/ui/AppIcon";
import { LiveMetricBar } from "@/components/ui/LiveMetricBar";
import { useInViewport } from "@/hooks/useInViewport";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import type { AppIconName } from "@/data/app-icons";

const tabs = ["Tweaks", "Games", "Network", "Cleanup", "Benchmarks"] as const;
type Tab = (typeof tabs)[number];
type AppView = "home" | Tab;

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
  { label: "RAM Free", value: "31 GB", color: "linear-gradient(90deg, #b392f0, #9b7de8)", glow: "rgba(179,146,240,0.5)", fill: 68 },
] as const;

function PreviewHome({ visible }: { visible: boolean }) {
  const demoExpires = useMemo(() => Date.now() + 29 * 86400 * 1000 + 5 * 3600 * 1000, []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [visible]);

  const remaining = Math.max(0, demoExpires - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="space-y-3">
      <div className="reflux-glow-box rounded-xl p-3">
        <div className="mb-1 text-[10px] font-bold tracking-wider text-reflux-accent uppercase">PRO access</div>
        <div className="reflux-metric text-2xl font-extrabold text-white sm:text-3xl">
          {days}d {hours}h {minutes}m {seconds}s
        </div>
        <p className="mt-1 text-[10px] text-reflux-muted">Countdown starts when you activate your license key.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "CPU", val: "24%", color: "#5DDE86" },
          { label: "GPU", val: "31%", color: "#F15B50" },
          { label: "RAM", val: "56%", color: "#B392F0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-reflux-border/50 bg-[#0f1217]/90 p-2.5">
            <div className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase">{stat.label}</div>
            <div className="mt-1 text-lg font-extrabold tabular-nums" style={{ color: stat.color }}>
              {stat.val}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {["Clean RAM", "Optimize Network", "Apply Tweaks"].map((action) => (
          <span
            key={action}
            className="rounded-lg border border-reflux-accent/30 bg-reflux-accent/10 px-2.5 py-1.5 text-[10px] font-bold text-reflux-accent"
          >
            {action}
          </span>
        ))}
      </div>
    </div>
  );
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

const sidebarNav: { icon: AppIconName; label: string; tab: Tab }[] = [
  { icon: "optimizer", label: "Opt", tab: "Tweaks" },
  { icon: "games", label: "Games", tab: "Games" },
  { icon: "internet", label: "Net", tab: "Network" },
  { icon: "cleanup", label: "Clean", tab: "Cleanup" },
  { icon: "benchmark", label: "Bench", tab: "Benchmarks" },
];

const sidebarExtra: { icon: AppIconName; label: string }[] = [
  { icon: "home", label: "Home" },
  { icon: "cpu", label: "CPU" },
  { icon: "gpu", label: "GPU" },
  { icon: "ram", label: "RAM" },
  { icon: "debloat", label: "Debloat" },
  { icon: "system", label: "Sys" },
];

type SidebarItem = { icon: AppIconName; label: string; tab?: Tab };

const heroSidebarItems: SidebarItem[] = [
  sidebarExtra[0],
  ...sidebarNav,
  ...sidebarExtra.slice(1),
];

const sampleTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, tag: "Network", icon: "internet" as AppIconName },
  { name: "High Performance Power Plan", on: true, tag: "CPU", icon: "cpu" as AppIconName },
  { name: "Disable Core Parking", on: true, tag: "CPU", icon: "cpu" as AppIconName },
  { name: "QoS Packet Prioritization", on: false, tag: "Network", icon: "internet" as AppIconName },
];

const networkTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, desc: "Cuts micro-delays on small game packets" },
  { name: "Flush DNS Cache", on: true, desc: "Clears stale resolver entries" },
  { name: "Optimize TCP/IP Stack", on: true, desc: "Tunes Windows network defaults" },
  { name: "Reset Winsock Catalog", on: false, desc: "Repairs broken socket bindings" },
];

interface AppPreviewMockProps {
  hero?: boolean;
  autoPlay?: boolean;
}

export function AppPreviewMock({ hero = false, autoPlay = false }: AppPreviewMockProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Tweaks");
  const [view, setView] = useState<AppView>("home");
  const { ref, visible } = useInViewport<HTMLDivElement>("120px");

  useEffect(() => {
    if (!autoPlay || !visible) return;
    const interval = setInterval(() => {
      setView((current) => {
        if (current === "home") return "Tweaks";
        const idx = tabs.indexOf(current as Tab);
        return tabs[(idx + 1) % tabs.length];
      });
    }, 3600);
    return () => clearInterval(interval);
  }, [autoPlay, visible]);

  useEffect(() => {
    if (view !== "home") setActiveTab(view);
  }, [view]);

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

      <div className="flex min-h-[300px] sm:min-h-[340px]">
        {hero && (
          <aside className="hidden w-[76px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-reflux-border/40 bg-[#080a0d] py-2 sm:flex">
            {heroSidebarItems.map((item) => {
              const tab = item.tab;
              const isHome = item.icon === "home";
              const isActive = isHome ? view === "home" : view === tab;
              return (
                <button
                  key={`${item.icon}-${item.label}`}
                  type="button"
                  onClick={() => {
                    if (isHome) {
                      setView("home");
                      return;
                    }
                    if (tab) {
                      setActiveTab(tab);
                      setView(tab);
                    }
                  }}
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
            <button
              type="button"
              onClick={() => setView("home")}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:px-4 sm:py-3 sm:text-sm ${
                view === "home"
                  ? "border-reflux-accent text-reflux-accent"
                  : "border-transparent text-reflux-muted hover:text-white"
              }`}
            >
              Home
            </button>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setView(tab);
                }}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:px-4 sm:py-3 sm:text-sm ${
                  view === tab
                    ? "border-reflux-accent text-reflux-accent"
                    : "border-transparent text-reflux-muted hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`bg-gradient-to-b from-[#0c0e12] to-[#080a0d] ${hero ? "p-4 sm:p-5" : "p-6"}`}>
            {view === "home" && <PreviewHome visible={visible} />}

            {view === "Tweaks" && (
              <div className="space-y-2">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AppIcon name="optimizer" size={20} />
                    <div>
                      <div className="text-sm font-bold text-white">Optimizer</div>
                      <div className="text-[11px] text-reflux-muted">
                        {PRODUCT_LIMITS.freeTweaks} free · {PRODUCT_LIMITS.totalTweaksLabel} pro
                      </div>
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
                    <div className="flex min-w-0 items-center gap-2.5">
                      <AppIcon name={tweak.icon} size={16} glow={false} className="shrink-0 opacity-80" />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold sm:text-sm">{tweak.name}</div>
                        <div className="mt-0.5 text-[10px] text-reflux-muted">{tweak.tag}</div>
                      </div>
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

            {view === "Games" && (
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

            {view === "Network" && (
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

            {view === "Cleanup" && (
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

            {view === "Benchmarks" && (
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
    </>
  );

  return (
    <div ref={ref} className={`mx-auto w-full overflow-hidden ${shellClass}`}>
      {content}
    </div>
  );
}
