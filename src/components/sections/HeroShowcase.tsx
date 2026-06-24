"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";

export function HeroShowcase() {
  return (
    <div className="hero-showcase-wrap relative mx-auto w-full px-2 sm:px-0">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(241,91,80,0.14),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="hero-device-stage relative pb-2">
        <div className="hero-device-shell overflow-hidden rounded-[24px] p-px">
          <div className="hero-device-inner overflow-hidden rounded-[23px] bg-[#030507]">
            <AppPreviewMock hero />
          </div>
        </div>
      </div>
    </div>
  );
}
