"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import type { AppIconName } from "@/data/app-icons";

type MetricId = "cpu" | "gpu" | "ram";

const METRIC_CHARTS: Record<
  MetricId,
  { color: string; fill: string; points: string; fillPoints: string }
> = {
  cpu: {
    color: "#5DDE86",
    fill: "rgba(93,222,134,0.18)",
    points: "0,38 24,34 48,30 72,26 96,28 120,22 144,18 168,20 192,14 216,16 240,10",
    fillPoints:
      "0,56 0,38 24,34 48,30 72,26 96,28 120,22 144,18 168,20 192,14 216,16 240,10 240,56",
  },
  gpu: {
    color: "#F15B50",
    fill: "rgba(241,91,80,0.18)",
    points: "0,42 20,38 40,35 60,28 80,32 100,22 120,18 140,24 160,14 180,16 200,10 220,12 240,8",
    fillPoints:
      "0,56 0,42 20,38 40,35 60,28 80,32 100,22 120,18 140,24 160,14 180,16 200,10 220,12 240,8 240,56",
  },
  ram: {
    color: "#B392F0",
    fill: "rgba(179,146,240,0.18)",
    points: "0,30 30,32 60,28 90,34 120,26 150,30 180,22 210,24 240,18",
    fillPoints:
      "0,56 0,30 30,32 60,28 90,34 120,26 150,30 180,22 210,24 240,18 240,56",
  },
};

const HOME_STATS = [
  { id: "cpu" as const, label: "CPU", val: "24%", accent: "#5DDE86", name: "Intel i7-13700K", vendor: "intel" as const },
  { id: "gpu" as const, label: "GPU", val: "31%", accent: "#F15B50", name: "RTX 4070", vendor: "nvidia" as const },
  { id: "ram" as const, label: "RAM", val: "56%", accent: "#B392F0", name: "32 GB Total", vendor: "ram" as const },
];

function PerformanceMonitor({ hero = false }: { hero?: boolean }) {
  const [metric, setMetric] = useState<MetricId>("gpu");
  const chart = METRIC_CHARTS[metric];

  useEffect(() => {
    const id = window.setInterval(() => {
      setMetric((m) => (m === "cpu" ? "gpu" : m === "gpu" ? "ram" : "cpu"));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`app-mock-card app-mock-chart-card p-3 sm:p-3.5 ${hero ? "app-mock-chart-card--hero" : ""}`}>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-white sm:text-sm">Performance Monitor</div>
        <div className="flex gap-1">
          {(["cpu", "gpu", "ram"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMetric(id)}
              className={`app-mock-metric-pill rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                metric === id ? "active" : ""
              }`}
              style={
                metric === id
                  ? ({
                      "--pill-accent": METRIC_CHARTS[id].color,
                      color: METRIC_CHARTS[id].color,
                    } as CSSProperties)
                  : undefined
              }
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <div className="app-mock-chart-canvas">
        <svg viewBox="0 0 240 56" className="h-16 w-full sm:h-[4.75rem]" aria-hidden="true">
          <defs>
            <linearGradient id={`chartGrad-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chart.color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
            </linearGradient>
            <filter id={`chartGlow-${metric}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[14, 28, 42].map((y) => (
            <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          <polygon
            key={`fill-${metric}`}
            className="app-mock-chart-fill"
            fill={`url(#chartGrad-${metric})`}
            points={chart.fillPoints}
          />
          <polyline
            key={`line-${metric}`}
            className="app-mock-chart-line"
            fill="none"
            stroke={chart.color}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#chartGlow-${metric})`}
            points={chart.points}
          />
          {(() => {
            const last = chart.points.split(" ").pop()?.split(",") ?? ["240", "10"];
            return (
              <circle
                className="app-mock-chart-dot"
                cx={last[0]}
                cy={last[1]}
                r="3.5"
                fill={chart.color}
                style={{ filter: `drop-shadow(0 0 6px ${chart.color})` }}
              />
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

export function AppPreviewHomePanel({ hero = false }: { hero?: boolean }) {
  const demoExpires = useMemo(() => Date.now() + 29 * 86400000 + 5 * 3600000, []);
  const [now, setNow] = useState(() => Date.now());
  const [activeStat, setActiveStat] = useState<MetricId>("gpu");

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, demoExpires - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className={`space-y-3 ${hero ? "app-mock-home--hero" : ""}`}>
      <div className="app-mock-card app-mock-card-accent app-mock-countdown p-4 sm:p-4.5">
        <div className="app-mock-countdown-glow" aria-hidden="true" />
        <div className="relative z-1">
          <div className="mb-1 text-[10px] font-bold tracking-[0.2em] text-reflux-accent uppercase">
            PRO access countdown
          </div>
          <div
            aria-live="polite"
            className="app-mock-countdown-time reflux-metric text-3xl font-extrabold tracking-tight sm:text-[2.15rem]"
          >
            {days}d {hours}h {minutes}m {seconds}s
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-reflux-muted">
            Live timer — starts when you activate your license key in the app.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {HOME_STATS.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => setActiveStat(stat.id)}
            className={`app-mock-stat p-2.5 text-left sm:p-3 ${activeStat === stat.id ? "app-mock-stat--active" : ""}`}
            style={{ "--stat-accent": stat.accent } as CSSProperties}
          >
            <div className="app-mock-stat-glow" aria-hidden="true" />
            <div className="relative z-1">
              <div className="mb-1.5 flex items-center justify-between gap-1">
                <span className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase">{stat.label}</span>
                <VendorLogo vendor={stat.vendor} size={14} className="opacity-90" />
              </div>
              <div className="app-mock-stat-value text-xl font-extrabold tabular-nums sm:text-2xl" style={{ color: stat.accent }}>
                {stat.val}
              </div>
              <div className="mt-1 truncate text-[9px] text-reflux-muted sm:text-[10px]">{stat.name}</div>
            </div>
          </button>
        ))}
      </div>

      <PerformanceMonitor hero={hero} />

      <div className="flex flex-wrap gap-2">
        {["Clean RAM", "Optimize Network", "Apply Tweaks"].map((action, i) => (
          <button
            key={action}
            type="button"
            className={`app-mock-action px-3 py-1.5 text-[10px] sm:text-[11px] ${i === 2 ? "app-mock-action--primary" : ""}`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

function OptimizerHwChip({
  accent,
  kind,
  name,
  sub,
  vendor,
}: {
  accent: string;
  kind: string;
  name: string;
  sub: string;
  vendor: "intel" | "nvidia" | "amd" | "ram";
}) {
  return (
    <div
      className="app-mock-card flex min-w-[140px] flex-1 items-center gap-3 p-3"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 30%, #161616)`,
        boxShadow: `inset 3px 0 0 ${accent}, 0 0 24px -12px ${accent}`,
      }}
    >
      <VendorLogo vendor={vendor} size={36} className="shrink-0" />
      <div className="min-w-0">
        <div className="text-[9px] font-bold tracking-wider uppercase" style={{ color: accent }}>
          {kind}
        </div>
        <div className="truncate text-xs font-bold text-white">{name}</div>
        <div className="text-[10px] text-reflux-muted">{sub}</div>
      </div>
    </div>
  );
}

export function AppPreviewOptimizerPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AppIcon name="optimizer" size={20} />
        <div>
          <div className="text-sm font-bold text-white">Smart Optimizer</div>
          <div className="text-[11px] text-reflux-muted">Matched to your detected hardware</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <OptimizerHwChip accent="#0071C5" kind="Processor" name="Intel Core i7-13700K" sub="Matched profile" vendor="intel" />
        <OptimizerHwChip accent="#76B900" kind="Graphics" name="NVIDIA RTX 4070" sub="Matched profile" vendor="nvidia" />
      </div>
      {[
        "Max Gaming Performance Suite",
        "Full Network Stack Reset",
        "Aggressive RAM Cleanup",
      ].map((cmd, i) => (
        <div key={cmd} className="app-mock-card p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-reflux-accent/15 text-[10px] font-bold text-reflux-accent">
              {i + 1}
            </span>
            <span className="text-xs font-bold text-white">{cmd}</span>
          </div>
          <div className="flex gap-2">
            <span className="rounded-md border border-white/10 px-2 py-1 text-[9px] font-semibold text-reflux-muted">Copy</span>
            <span className="app-mock-action px-2 py-1 text-[9px]">Run</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const sampleTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, tag: "Network", icon: "internet" as AppIconName },
  { name: "High Performance Power Plan", on: true, tag: "CPU", icon: "cpu" as AppIconName },
  { name: "Disable Core Parking", on: true, tag: "CPU", icon: "cpu" as AppIconName },
  { name: "QoS Packet Prioritization", on: false, tag: "Network", icon: "internet" as AppIconName },
];

export const networkTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, desc: "Cuts micro-delays on small game packets" },
  { name: "Flush DNS Cache", on: true, desc: "Clears stale resolver entries" },
  { name: "Optimize TCP/IP Stack", on: true, desc: "Tunes Windows network defaults" },
  { name: "Reset Winsock Catalog", on: false, desc: "Repairs broken socket bindings" },
];

export function AppPreviewTweaksPanel() {
  return (
    <div className="space-y-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AppIcon name="optimizer" size={20} />
          <div>
            <div className="text-sm font-bold text-white">Optimizer</div>
            <div className="text-[11px] text-reflux-muted">
              {PRODUCT_LIMITS.freeTweaks} free · {PRODUCT_LIMITS.totalTweaksLabel} Pro
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
          className="app-mock-card flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3"
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
  );
}
