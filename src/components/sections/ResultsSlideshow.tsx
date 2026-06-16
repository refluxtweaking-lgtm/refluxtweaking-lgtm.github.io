"use client";

import { useCallback, useEffect, useState } from "react";
import { ResultMetricChart, type ResultMetric } from "./ResultMetricChart";

const SLIDE_MS = 5500;

const results: ResultMetric[] = [
  {
    id: "fps",
    label: "Fortnite FPS",
    game: "Same rig · competitive settings",
    before: 280,
    after: 332,
    unit: "FPS",
    delta: "+52 FPS",
    color: "text-reflux-accent",
    stroke: "#ff6b5b",
    fill: "from-reflux-accent to-reflux-accent-light",
    gain: "82%",
    hint: "Higher line = more frames",
  },
  {
    id: "latency",
    label: "Input Latency",
    game: "Same rig · mouse + display chain",
    before: 21,
    after: 15,
    unit: "ms",
    delta: "-6 ms",
    color: "text-reflux-green",
    stroke: "#5dde86",
    fill: "from-reflux-green/80 to-reflux-green",
    gain: "71%",
    hint: "Lower line = snappier inputs",
  },
  {
    id: "lows",
    label: "1% Lows",
    game: "Same rig · worst-frame spikes",
    before: 170,
    after: 220,
    unit: "FPS",
    delta: "+50 FPS",
    color: "text-reflux-purple",
    stroke: "#a78bfa",
    fill: "from-reflux-purple/80 to-reflux-purple",
    gain: "78%",
    hint: "Smoother floor = fewer stutters",
  },
];

interface ResultsSlideshowProps {
  animate: boolean;
}

export function ResultsSlideshow({ animate }: ResultsSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [drawKey, setDrawKey] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setDrawKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % results.length);
      setDrawKey((k) => k + 1);
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
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors sm:text-sm ${
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

      <div className={`results-charts-active overflow-hidden rounded-2xl border border-white/8 bg-[#080b12] p-5 sm:p-7 ${animate ? "" : ""}`}>
        <div
          key={`${metric.id}-${drawKey}`}
          className="result-slide-enter"
        >
          <ResultMetricChart metric={metric} animate={animate} large />
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-reflux-muted">
        Swaps every few seconds · top squiggle is before REFLUX, bottom smooth line is after
      </p>
    </div>
  );
}
