"use client";

import { useState } from "react";
import { TweaksSlide } from "./slides/TweaksSlide";
import { GameScannerSlide } from "./slides/GameScannerSlide";
import { LatencySlide } from "./slides/LatencySlide";
import { SystemCleanupSlide } from "./slides/SystemCleanupSlide";
import { BenchmarksSlide } from "./slides/BenchmarksSlide";
import { SafeReversibleSlide } from "./slides/SafeReversibleSlide";
import { Icon } from "@/components/ui/Icon";
import type { SlideProps } from "./slides/types";
import type { ComponentType } from "react";

const slides: { id: string; label: string; component: ComponentType<SlideProps> }[] = [
  { id: "tweaks", label: "Tweaks", component: TweaksSlide },
  { id: "game-scanner", label: "Games", component: GameScannerSlide },
  { id: "latency", label: "Network", component: LatencySlide },
  { id: "cleanup", label: "Cleanup", component: SystemCleanupSlide },
  { id: "benchmarks", label: "Benchmarks", component: BenchmarksSlide },
  { id: "safe", label: "Safety", component: SafeReversibleSlide },
];

export function FeatureSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goTo = (index: number) => setCurrentSlide(index);
  const goToPrev = () => goTo((currentSlide - 1 + slides.length) % slides.length);
  const goToNext = () => goTo((currentSlide + 1) % slides.length);

  return (
    <div className="glass-card-static overflow-hidden rounded-3xl p-3 sm:p-5 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/6 pb-4 sm:mb-6">
        <div className="text-sm font-semibold text-reflux-muted">
          Feature <span className="text-white">{currentSlide + 1}</span>
          <span className="text-reflux-muted/70"> / {slides.length}</span>
        </div>
        <div className="flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={slides[index].id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to ${slides[index].label}`}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? "w-5 bg-reflux-accent" : "w-2 bg-reflux-border hover:bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[960px]">
        {slides.map(({ id, component: SlideComponent }, index) => (
          <div
            key={id}
            className={`w-full transition-opacity duration-300 ${
              index === currentSlide
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            <SlideComponent isActive={currentSlide === index} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col items-center gap-2.5 md:mt-5 md:gap-3">
        <div className="flex max-w-full flex-wrap justify-center gap-1.5 sm:gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 sm:px-4 sm:py-2 sm:text-xs ${
                currentSlide === index
                  ? "bg-gradient-to-r from-reflux-accent to-[#c43d35] text-white shadow-[0_0_20px_rgba(241,91,80,0.45)]"
                  : "border border-reflux-border/60 bg-reflux-card/40 text-reflux-muted hover:border-reflux-accent/30 hover:text-white"
              }`}
            >
              {slide.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 sm:gap-4">
          <NavBtn onClick={goToPrev}>
            <Icon name="arrowLeft" size={16} strokeWidth={2.2} /> Prev
          </NavBtn>
          <NavBtn onClick={goToNext}>
            Next <Icon name="arrowRight" size={16} strokeWidth={2.2} />
          </NavBtn>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-reflux-accent/40 bg-reflux-accent/10 px-5 py-2.5 text-sm font-bold text-reflux-accent backdrop-blur-sm transition-all hover:bg-reflux-accent/25 hover:text-white hover:shadow-[0_0_24px_rgba(241,91,80,0.35)] sm:px-8 sm:py-3"
    >
      {children}
    </button>
  );
}
