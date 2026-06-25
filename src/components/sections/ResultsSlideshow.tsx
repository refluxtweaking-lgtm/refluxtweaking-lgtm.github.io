"use client";

import { useCallback, useEffect, useState } from "react";
import { ResultMetricChart, type ResultMetric } from "./ResultMetricChart";
import { LIVE_DURATION_MS } from "./resultChartPaths";

/** Live capture per slide + short pause before next */
const SLIDE_MS = LIVE_DURATION_MS + 1200;

const results: ResultMetric[] = [
  {
    id: "fps",
    label: "Fortnite · Arena",
    session: "RTX 4070 · Ryzen 7 7800X3D · Performance mode",
    scenario: "Avg FPS while fighting in endgame — same creative map, same 15 min session",
    before: 280,
    after: 332,
    unit: "FPS",
    delta: "+52",
    color: "text-[#38bdf8]",
    stroke: "#38bdf8",
    fill: "from-reflux-accent to-reflux-accent-light",
    gain: "0.82",
    beforeLabel: "Default Windows",
    afterLabel: "With REFLUX PRO",
    beforeStroke: "#f97316",
    afterStroke: "#38bdf8",
    beforeGlow: "rgba(249,115,22,0.55)",
    afterGlow: "rgba(56,189,248,0.55)",
  },
  {
    id: "latency",
    label: "Valorant · Range",
    session: "240 Hz monitor · same mouse polling · wired connection",
    scenario: "Click-to-shot input delay measured in the practice range",
    before: 21,
    after: 15,
    unit: "ms",
    delta: "-6",
    color: "text-[#34d399]",
    stroke: "#34d399",
    fill: "from-reflux-green/80 to-reflux-green",
    gain: "0.71",
    beforeLabel: "Before tweaks",
    afterLabel: "After tweaks",
    beforeStroke: "#c084fc",
    afterStroke: "#34d399",
    beforeGlow: "rgba(192,132,252,0.5)",
    afterGlow: "rgba(52,211,153,0.55)",
  },
  {
    id: "lows",
    label: "Cyberpunk · City",
    session: "Same save · Night City drive loop · RT medium",
    scenario: "1% low FPS during heavy NPC traffic — worst frames in the run",
    before: 170,
    after: 220,
    unit: "FPS",
    delta: "+50",
    color: "text-[#a78bfa]",
    stroke: "#a78bfa",
    fill: "from-reflux-purple/80 to-reflux-purple",
    gain: "0.78",
    beforeLabel: "Stutters & drops",
    afterLabel: "Smoother floor",
    beforeStroke: "#fb7185",
    afterStroke: "#a78bfa",
    beforeGlow: "rgba(251,113,133,0.5)",
    afterGlow: "rgba(167,139,250,0.55)",
  },
];

interface ResultsSlideshowProps {
  animate: boolean;
}

export function ResultsSlideshow({ animate }: ResultsSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [liveKey, setLiveKey] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setLiveKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % results.length);
      setLiveKey((k) => k + 1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [animate]);

  const metric = results[index];

  return (
    <div className="results-slideshow">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {results.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              className={`reflux-glow-interactive rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                i === index ? "reflux-glow-interactive-active" : "text-reflux-muted hover:text-white"
              }`}
              style={
                i === index
                  ? {
                      borderColor: `color-mix(in srgb, ${item.afterStroke} 45%, transparent)`,
                      boxShadow: `0 0 32px -10px ${item.afterGlow}`,
                    }
                  : undefined
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {results.map((item, i) => (
            <button
              key={`dot-${item.id}`}
              type="button"
              aria-label={`Show ${item.label}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 shadow-[0_0_10px_rgba(255,77,61,0.6)]" : "w-2 bg-white/15 hover:bg-white/30"
              }`}
              style={i === index ? { background: item.afterStroke } : undefined}
            />
          ))}
        </div>
      </div>

      <div className="reflux-glow-box overflow-hidden rounded-2xl p-5 sm:p-7">
        <div key={`${metric.id}-${liveKey}`} className="result-slide-enter">
          <ResultMetricChart metric={metric} isLive={animate} liveKey={liveKey} large />
        </div>
      </div>
    </div>
  );
}
