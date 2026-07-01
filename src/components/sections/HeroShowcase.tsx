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
  {
    id: "detect",
    className: "hero-float-badge-c",
    icon: "gpu" as const,
    value: "Live",
    unit: "",
    sub: "HW detect",
    accent: "text-reflux-green",
  },
] as const;

export function HeroShowcase() {
  return (
    <div className="hero-showcase-wrap relative mx-auto w-full px-2 sm:px-0">
      <div
        className="pointer-events-none absolute -inset-10 rounded-[48px] bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(241,91,80,0.18),transparent_72%)]"
        aria-hidden="true"
      />
      <div className="hero-orbit-ring pointer-events-none absolute left-1/2 top-1/2 -z-1 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="hero-device-stage relative pb-4">
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

        <div className="hero-device-shell overflow-hidden rounded-[24px] p-px">
          <div className="hero-device-inner hero-device-scan overflow-hidden rounded-[23px] bg-[#030507]">
            <AppPreviewMock hero />
          </div>
        </div>

        <div className="hero-device-reflection pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}
