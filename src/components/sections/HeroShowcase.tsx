"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { AppIcon } from "@/components/ui/AppIcon";
import { FpsCompareBar } from "@/components/ui/LiveMetricBar";

const floatBadges = [
  { id: "fps", label: "+52 FPS", sub: "Avg gain", icon: "bolt" as const, className: "hero-float-badge-a" },
  { id: "lat", label: "-6 ms", sub: "Latency", icon: "internet" as const, className: "hero-float-badge-b" },
  { id: "pro", label: "PRO", sub: "Unlocked", icon: "sparkle" as const, className: "hero-float-badge-c" },
];

export function HeroShowcase() {
  return (
    <div className="hero-showcase-wrap relative mx-auto w-full px-2 sm:px-0">
      <div className="hero-device-glow pointer-events-none absolute inset-2 scale-110 rounded-[28px] blur-3xl" aria-hidden="true" />
      <div className="hero-ring pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border border-reflux-accent/20 opacity-60" aria-hidden="true" />

      {floatBadges.map((badge) => (
        <div
          key={badge.id}
          className={`hero-float-badge ${badge.className} absolute z-20 flex items-center gap-2 rounded-2xl border border-white/20 bg-[#0c0f16]/95 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_28px_-4px_rgba(255,107,91,0.55)] backdrop-blur-md`}
        >
          <AppIcon name={badge.icon} size={16} />
          <div>
            <div className="text-sm font-extrabold tabular-nums text-white">{badge.label}</div>
            <div className="text-[10px] font-semibold tracking-wide text-reflux-muted uppercase">{badge.sub}</div>
          </div>
        </div>
      ))}

      <div className="hero-device-stage relative pt-8 pb-2">
        <div className="hero-device-shell overflow-hidden rounded-[24px] p-px">
          <div className="hero-device-inner overflow-hidden rounded-[23px] bg-[#070a10]">
            <AppPreviewMock hero autoPlay />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/15 bg-gradient-to-br from-[#12151c]/95 to-[#0a0c12]/95 p-4 backdrop-blur-sm">
        <div className="mb-3 text-center text-[10px] font-bold tracking-[0.2em] text-reflux-muted uppercase">
          Fortnite · same session · RTX 4070
        </div>
        <FpsCompareBar before={187} after={239} max={280} />
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/8 pt-3">
          {[
            { label: "Before", value: "187 FPS", tone: "text-reflux-muted" },
            { label: "After", value: "239 FPS", tone: "text-reflux-green" },
            { label: "Gain", value: "+52", tone: "gradient-text font-extrabold" },
          ].map((row) => (
            <div key={row.label} className="text-center">
              <div className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase">{row.label}</div>
              <div className={`mt-0.5 text-sm font-extrabold tabular-nums sm:text-base ${row.tone}`}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
