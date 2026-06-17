"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { LiveEqualizer, LiveMetricBar } from "@/components/ui/LiveMetricBar";

const metrics = [
  { label: "GPU Load", value: "78%", fill: 78, color: "linear-gradient(90deg, #ff6b5b, #ff9588)", glow: "rgba(255,107,91,0.55)", icon: "gpu" as const },
  { label: "CPU Boost", value: "94%", fill: 94, color: "linear-gradient(90deg, #5dde86, #3ecf70)", glow: "rgba(93,222,134,0.5)", icon: "cpu" as const },
  { label: "RAM Free", value: "31 GB", fill: 68, color: "linear-gradient(90deg, #b392f0, #9b7de8)", glow: "rgba(179,146,240,0.5)", icon: "ram" as const },
];

export function LiveStatsStrip() {
  return (
    <section className="live-stats-strip relative overflow-hidden border-y border-reflux-accent/25 py-6 md:py-8">
      <div className="live-stats-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex shrink-0 items-center gap-3 lg:w-48">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-reflux-green opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-reflux-green shadow-[0_0_12px_rgba(93,222,134,0.8)]" />
          </span>
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-reflux-green uppercase">Live in app</div>
            <div className="text-sm font-semibold text-white">Performance meters</div>
          </div>
        </div>

        <div className="grid flex-1 gap-4 sm:grid-cols-3">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="live-stat-card rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <AppIcon name={m.icon} size={16} />
                <span className="text-xs font-bold text-white">{m.label}</span>
              </div>
              <LiveMetricBar
                label=""
                value={m.value}
                fill={m.fill}
                color={m.color}
                glow={m.glow}
                delay={i * 0.35}
              />
            </div>
          ))}
        </div>

        <div className="hidden h-14 w-36 shrink-0 overflow-hidden rounded-xl border border-reflux-accent/30 bg-[#0a0c10]/90 p-2 lg:block">
          <LiveEqualizer bars={14} />
        </div>
      </div>
    </section>
  );
}
