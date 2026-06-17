"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { AppIcon } from "@/components/ui/AppIcon";

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
    </div>
  );
}
