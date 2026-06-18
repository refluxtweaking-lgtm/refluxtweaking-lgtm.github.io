"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";

export function HeroShowcase() {
  return (
    <div className="hero-showcase-wrap relative mx-auto w-full px-2 sm:px-0">
      <div className="hero-device-stage relative pb-2">
        <div className="hero-device-shell overflow-hidden rounded-[24px] p-px">
          <div className="hero-device-inner overflow-hidden rounded-[23px] bg-[#070a10]">
            <AppPreviewMock hero />
          </div>
        </div>
      </div>
    </div>
  );
}
