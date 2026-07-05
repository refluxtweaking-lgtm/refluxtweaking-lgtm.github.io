"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { AppPreviewMock } from "@/components/app/AppPreviewMock";

const FLOAT_BADGES = [
  {
    id: "fps",
    className: "hero-float-badge-a",
    icon: "bolt" as const,
    value: "+52",
    unit: "FPS",
    sub: "avg gain",
    accent: "text-reflux-accent",
  },
  {
    id: "ping",
    className: "hero-float-badge-b",
    icon: "internet" as const,
    value: "-6",
    unit: "ms",
    sub: "lower ping",
    accent: "text-reflux-calm",
  },
] as const;

export function HeroShowcase() {
  return (
    <div className="hero-showcase-wrap relative mx-auto w-full px-0 sm:px-2">
      <div className="hero-showcase-halo pointer-events-none absolute -inset-12" aria-hidden="true" />
      <div className="hero-showcase-ring pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[min(88%,520px)] w-[min(95%,640px)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -inset-8 bg-[radial-gradient(ellipse_80%_65%_at_50%_40%,rgba(241,91,80,0.28),transparent_68%)]"
        aria-hidden="true"
      />

      <div className="hero-device-stage relative pb-6">
        {FLOAT_BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`hero-float-badge ${badge.className} pointer-events-none absolute z-20 hidden sm:flex`}
          >
            <span className="hero-float-badge-icon">
              <AppIcon name={badge.icon} size={14} />
            </span>
            <span className="min-w-0">
              <span className={`hero-float-badge-value ${badge.accent}`}>
                {badge.value}
                {badge.unit ? <span className="ml-0.5 text-[10px] font-bold opacity-90">{badge.unit}</span> : null}
              </span>
              <span className="hero-float-badge-sub">{badge.sub}</span>
            </span>
          </div>
        ))}

        <div className="hero-device-frame">
          <div className="hero-device-notch" aria-hidden="true" />
          <div className="hero-device-shell overflow-hidden">
            <div className="hero-device-inner hero-device-scan overflow-hidden bg-[#030507]">
              <AppPreviewMock hero />
            </div>
          </div>
          <div className="hero-device-base" aria-hidden="true" />
        </div>

        <div className="hero-device-reflection pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}
