"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";

type HeroShowcaseProps = {
  compact?: boolean;
};

export function HeroShowcase({ compact = false }: HeroShowcaseProps) {
  return (
    <div className={`hero-showcase-wrap ${compact ? "hero-showcase-wrap--compact" : ""} relative mx-auto w-full px-0 sm:px-2`}>
      <div className="hero-showcase-halo pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="hero-device-stage relative pb-1">
        <div className="hero-device-frame">
          <div className="hero-device-notch" aria-hidden="true" />
          <div className="hero-device-shell overflow-hidden">
            <div className="hero-device-inner hero-device-scan overflow-hidden bg-[#030507]">
              <AppPreviewMock hero />
            </div>
          </div>
          <div className="hero-device-base" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
