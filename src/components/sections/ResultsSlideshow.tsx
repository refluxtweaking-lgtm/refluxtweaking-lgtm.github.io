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
    delta: "+52 FPS",
    color: "text-reflux-accent",
    stroke: "#ff6b5b",
    fill: "from-reflux-accent to-reflux-accent-light",
    gain: "0.82",
    beforeLabel: "Without REFLUX",
    afterLabel: "With REFLUX Pro",
  },
  {
    id: "latency",
    label: "Valorant · Range",
    session: "240 Hz monitor · same mouse polling · wired connection",
    scenario: "Click-to-shot input delay measured in the practice range",
    before: 21,
    after: 15,
    unit: "ms",
    delta: "-6 ms",
    color: "text-reflux-green",
    stroke: "#5dde86",
    fill: "from-reflux-green/80 to-reflux-green",
    gain: "0.71",
    beforeLabel: "Before tweaks",
    afterLabel: "After tweaks",
  },
  {
    id: "lows",
    label: "Cyberpunk · City",
    session: "Same save · Night City drive loop · RT medium",
    scenario: "1% low FPS during heavy NPC traffic — worst frames in the run",
    before: 170,
    after: 220,
    unit: "FPS",
    delta: "+50 FPS",
    color: "text-reflux-purple",
    stroke: "#a78bfa",
    fill: "from-reflux-purple/80 to-reflux-purple",
    gain: "0.78",
    beforeLabel: "Stutters & drops",
    afterLabel: "Smoother floor",
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
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                i === index
                  ? "border-reflux-accent/40 bg-reflux-accent/12 text-white"
                  : "border-white/8 bg-white/[0.02] text-reflux-muted hover:border-white/14 hover:text-white"
              }`}
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
                i === index ? "w-6 bg-reflux-accent" : "w-2 bg-reflux-border hover:bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#080b12] p-5 sm:p-7">
        <div key={`${metric.id}-${liveKey}`} className="result-slide-enter">
          <ResultMetricChart metric={metric} isLive={animate} liveKey={liveKey} large />
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-reflux-muted">
        Each test records live for 5 seconds — top line is real frame variance before REFLUX, bottom line is after
      </p>
    </div>
  );
}
