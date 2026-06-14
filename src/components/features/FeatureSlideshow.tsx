"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [slideHeight, setSlideHeight] = useState<number | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measureCurrentSlide = useCallback(() => {
    const currentEl = slideRefs.current[currentSlide];
    if (currentEl) {
      setSlideHeight(currentEl.offsetHeight);
    }
  }, [currentSlide]);

  useEffect(() => {
    measureCurrentSlide();
    const frame = requestAnimationFrame(measureCurrentSlide);
    const timer = setTimeout(measureCurrentSlide, 350);
    window.addEventListener("resize", measureCurrentSlide);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("resize", measureCurrentSlide);
    };
  }, [measureCurrentSlide, currentSlide]);

  const goTo = (index: number) => setCurrentSlide(index);
  const goToPrev = () => goTo((currentSlide - 1 + slides.length) % slides.length);
  const goToNext = () => goTo((currentSlide + 1) % slides.length);

  return (
    <div className="glass-card-static overflow-hidden rounded-3xl p-3 sm:p-5 md:p-8">
      <div
        className="relative mx-auto w-full max-w-[960px] overflow-hidden transition-[min-height] duration-300 ease-out"
        style={slideHeight ? { minHeight: slideHeight } : undefined}
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map(({ id, component: SlideComponent }, index) => (
            <div
              key={id}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="flex w-full min-w-full shrink-0 items-start px-1 sm:px-4"
            >
              <SlideComponent isActive={currentSlide === index} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 md:mt-6 md:gap-4">
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
