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
  const [slideHeight, setSlideHeight] = useState(520);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measureSlides = useCallback(() => {
    const heights = slideRefs.current.map((el) => el?.offsetHeight ?? 0);
    setSlideHeight(Math.max(...heights, 480));
  }, []);

  useEffect(() => {
    measureSlides();
    window.addEventListener("resize", measureSlides);
    return () => window.removeEventListener("resize", measureSlides);
  }, [measureSlides, currentSlide]);

  const goTo = (index: number) => setCurrentSlide(index);
  const goToPrev = () => goTo((currentSlide - 1 + slides.length) % slides.length);
  const goToNext = () => goTo((currentSlide + 1) % slides.length);

  return (
    <div className="glass-card-static overflow-hidden rounded-3xl p-6 md:p-8">
      <div
        className="relative mx-auto w-full max-w-[960px] overflow-hidden"
        style={{ minHeight: slideHeight }}
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
              className="flex w-full min-w-full shrink-0 items-start px-2 sm:px-4"
            >
              <SlideComponent isActive={currentSlide === index} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-5">
        <div className="flex flex-wrap justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                currentSlide === index
                  ? "bg-gradient-to-r from-reflux-accent to-[#c43d35] text-white shadow-[0_0_20px_rgba(241,91,80,0.45)]"
                  : "border border-reflux-border/60 bg-reflux-card/40 text-reflux-muted hover:border-reflux-accent/30 hover:text-white"
              }`}
            >
              {slide.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
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
      className="inline-flex items-center gap-2 rounded-xl border border-reflux-accent/40 bg-reflux-accent/10 px-8 py-3 text-sm font-bold text-reflux-accent backdrop-blur-sm transition-all hover:bg-reflux-accent/25 hover:text-white hover:shadow-[0_0_24px_rgba(241,91,80,0.35)]"
    >
      {children}
    </button>
  );
}
