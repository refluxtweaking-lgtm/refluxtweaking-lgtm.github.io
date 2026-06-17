"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { Icon } from "@/components/ui/Icon";

const floatBadges = [
  { id: "fps", label: "+52 FPS", sub: "Avg gain", icon: "bolt" as const, className: "hero-float-badge-a" },
  { id: "lat", label: "-6 ms", sub: "Latency", icon: "target" as const, className: "hero-float-badge-b" },
  { id: "pro", label: "PRO", sub: "Unlocked", icon: "sparkle" as const, className: "hero-float-badge-c" },
];

export function HeroShowcase() {
  return (
    <div className="hero-showcase-wrap relative mx-auto w-full px-2 sm:px-4">
      <div className="hero-device-glow pointer-events-none absolute inset-4 scale-105 rounded-[32px] blur-3xl" aria-hidden="true" />

      {floatBadges.map((badge) => (
        <div
          key={badge.id}
          className={`hero-float-badge ${badge.className} absolute z-20 flex items-center gap-2.5 rounded-2xl border border-white/18 bg-[#0c0f16]/95 px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_-6px_rgba(255,107,91,0.4)] backdrop-blur-md sm:gap-2.5`}
        >
          <span className="icon-chip flex h-9 w-9 items-center justify-center rounded-xl border border-reflux-accent/40 bg-reflux-accent/15">
            <Icon name={badge.icon} size={16} glow />
          </span>
          <div>
            <div className="text-sm font-extrabold tabular-nums text-white">{badge.label}</div>
            <div className="text-[10px] font-semibold tracking-wide text-reflux-muted uppercase">{badge.sub}</div>
          </div>
        </div>
      ))}

      <div className="hero-device-stage relative pt-6 pb-2 sm:pt-8 sm:pb-4">
        <div className="hero-device-shell relative overflow-hidden rounded-[26px] p-px">
          <div className="hero-device-inner overflow-hidden rounded-[25px] bg-[#070a10]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0e15] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-reflux-muted uppercase">
                <span className="hero-live-dot h-1.5 w-1.5 rounded-full bg-reflux-green" />
                Live preview
              </span>
            </div>

            <AppPreviewMock hero autoPlay />
          </div>
        </div>
      </div>

      <div className="hero-metrics-bar mt-4 grid w-full grid-cols-3 gap-3">
        {[
          { label: "Before", value: "187", unit: "FPS", tone: "text-reflux-muted" },
          { label: "After REFLUX", value: "239", unit: "FPS", tone: "text-reflux-green" },
          { label: "Gain", value: "+52", unit: "FPS", tone: "gradient-text-static font-extrabold" },
        ].map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-white/15 bg-white/[0.07] px-2 py-3 text-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md sm:px-3 sm:py-3.5"
          >
            <div className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase">{row.label}</div>
            <div className={`stat-number mt-1 text-base font-extrabold tabular-nums sm:text-lg ${row.tone}`}>
              {row.value}
              <span className="ml-0.5 text-xs font-bold opacity-80">{row.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
