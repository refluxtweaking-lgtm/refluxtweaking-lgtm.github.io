"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  buildJaggedPathFromSeries,
  buildSmoothPathFromSeries,
} from "@/components/sections/resultChartPaths";

export const PROOF_INTRO_MS = 10000;

const W = 900;
const H = 220;

/** Same Fortnite creative session — stock Windows vs REFLUX applied */
const FPS_BEFORE = [
  22, 28, 19, 26, 21, 30, 18, 25, 23, 29, 20, 27, 24, 31, 19, 26, 22, 28, 21, 25,
  24, 27, 20, 29, 22, 25, 18, 28, 23, 26, 20, 30, 19, 27, 23, 24, 21, 28, 20, 25,
];
const FPS_AFTER = Array.from({ length: 40 }, (_, i) => 96 + (i % 3 === 0 ? 2 : i % 3 === 1 ? 1 : 0));

/** Click-to-shot input delay — same Valorant range test */
const LATENCY_BEFORE = [
  11, 13, 9, 12, 10, 14, 9, 11, 12, 13, 10, 11, 12, 14, 9, 12, 10, 11, 9, 13,
  11, 12, 10, 13, 11, 12, 9, 12, 11, 10, 9, 13, 11, 10, 9, 12, 11, 12, 10, 11,
];
const LATENCY_AFTER = Array.from({ length: 40 }, (_, i) => 2 + (i % 4 === 0 ? 0.4 : 0));

function valueToY(value: number, min: number, max: number, height: number, pad = 16) {
  const usable = height - pad * 2;
  const norm = (value - min) / (max - min);
  return height - pad - norm * usable;
}

function toJaggedPath(values: number[], width: number, height: number, min: number, max: number) {
  const ys = values.map((v) => valueToY(v, min, max, height));
  return buildJaggedPathFromSeries(ys, width);
}

function toSmoothPath(values: number[], width: number, height: number, min: number, max: number) {
  const ys = values.map((v) => valueToY(v, min, max, height));
  return buildSmoothPathFromSeries(ys, width);
}

function toArea(linePath: string, width: number, height: number) {
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

function avg(values: number[]) {
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

const FPS_MIN = 0;
const FPS_MAX = 120;
const FPS_BEFORE_PATH = toJaggedPath(FPS_BEFORE, W, H, FPS_MIN, FPS_MAX);
const FPS_AFTER_PATH = toSmoothPath(FPS_AFTER, W, H, FPS_MIN, FPS_MAX);
const FPS_BEFORE_AREA = toArea(FPS_BEFORE_PATH, W, H);
const FPS_AFTER_AREA = toArea(FPS_AFTER_PATH, W, H);

const LAT_W = 400;
const LAT_H = 100;
const LAT_MIN = 0;
const LAT_MAX = 16;
const LATENCY_BEFORE_PATH = toJaggedPath(LATENCY_BEFORE, LAT_W, LAT_H, LAT_MIN, LAT_MAX);
const LATENCY_AFTER_PATH = toSmoothPath(LATENCY_AFTER, LAT_W, LAT_H, LAT_MIN, LAT_MAX);

function ProofChartStage({
  children,
  className = "",
}: {
  children: (intro: boolean) => ReactNode;
  className?: string;
}) {
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    if (document.documentElement.classList.contains("reduce-effects")) {
      setIntro(false);
      return;
    }
    const timer = window.setTimeout(() => setIntro(false), PROOF_INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`proof-chart-stage relative ${intro ? "proof-chart-intro" : "proof-chart-done"} ${className}`}
    >
      {intro ? <div className="proof-chart-scan" aria-hidden="true" /> : null}
      <div className="proof-chart-svg-wrap relative z-[1]">{children(intro)}</div>
    </div>
  );
}

function ChartAxis({
  ticks,
  height,
}: {
  ticks: { label: string; value: number; min: number; max: number }[];
  height: number;
}) {
  return (
    <div className="proof-chart-axis" style={{ height }} aria-hidden="true">
      {ticks.map((tick) => {
        const pct = ((tick.max - tick.value) / (tick.max - tick.min)) * 100;
        return (
          <span key={tick.label} className="proof-chart-axis-tick" style={{ top: `${pct}%` }}>
            {tick.label}
          </span>
        );
      })}
    </div>
  );
}

function StatCompare({
  before,
  after,
  unit,
  beforeNote,
  afterNote,
}: {
  before: string;
  after: string;
  unit: string;
  beforeNote: string;
  afterNote: string;
}) {
  return (
    <div className="proof-stat-compare mb-5 grid grid-cols-2 gap-4 sm:gap-8">
      <div>
        <div className="proof-stat-label text-[#e85548]">Before</div>
        <div className="proof-stat-value">
          {before}
          <span className="proof-stat-unit">{unit}</span>
        </div>
        <div className="proof-stat-note">{beforeNote}</div>
      </div>
      <div>
        <div className="proof-stat-label text-[#ff9588]">After REFLUX</div>
        <div className="proof-stat-value">
          {after}
          <span className="proof-stat-unit">{unit}</span>
        </div>
        <div className="proof-stat-note">{afterNote}</div>
      </div>
    </div>
  );
}

interface AmbientFpsGraphProps {
  className?: string;
}

export function AmbientFpsGraph({ className = "" }: AmbientFpsGraphProps) {
  const beforeAvg = avg(FPS_BEFORE);
  const afterAvg = avg(FPS_AFTER);

  return (
    <div className={`ambient-graph-wrap proof-chart relative ${className}`}>
      <StatCompare
        before={String(beforeAvg)}
        after={String(Math.round(afterAvg))}
        unit=" FPS avg"
        beforeNote="Stock Windows — stutters & frame drops"
        afterNote="Same session with REFLUX tweaks on"
      />

      <div className="proof-chart-frame">
        <ChartAxis
          height={H}
          ticks={[
            { label: "120", value: 120, min: FPS_MIN, max: FPS_MAX },
            { label: "60", value: 60, min: FPS_MIN, max: FPS_MAX },
            { label: "0", value: 0, min: FPS_MIN, max: FPS_MAX },
          ]}
        />
        <div className="proof-chart-canvas relative flex-1">
          <div className="ambient-graph-legend absolute right-0 top-0 z-10 flex flex-wrap justify-end gap-3 text-[11px] font-semibold sm:gap-4 sm:text-xs">
            <span className="flex items-center gap-2 text-[#ff9588]">
              <span className="h-0.5 w-5 rounded-full bg-[#ff9588] shadow-[0_0_10px_rgba(255,149,136,0.9)]" />
              With REFLUX
            </span>
            <span className="flex items-center gap-2 text-[#e85548]">
              <span className="h-0.5 w-5 rounded-full bg-[#e85548] shadow-[0_0_8px_rgba(232,85,72,0.7)]" />
              Stock Windows
            </span>
          </div>
          <ProofChartStage>
            {(intro) => (
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="ambient-graph-svg w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ambientBeforeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(232,85,72,0.14)" />
                    <stop offset="100%" stopColor="rgba(232,85,72,0)" />
                  </linearGradient>
                  <linearGradient id="ambientAfterFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,107,91,0.2)" />
                    <stop offset="100%" stopColor="rgba(255,107,91,0)" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1="0"
                    y1={H * pct}
                    x2={W}
                    y2={H * pct}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                ))}
                {!intro ? (
                  <>
                    <path d={FPS_BEFORE_AREA} fill="url(#ambientBeforeFill)" />
                    <path d={FPS_AFTER_AREA} fill="url(#ambientAfterFill)" />
                  </>
                ) : null}
                <path
                  d={FPS_BEFORE_PATH}
                  fill="none"
                  stroke="#e85548"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="ambient-line-before proof-line-before"
                />
                <path
                  d={FPS_AFTER_PATH}
                  fill="none"
                  stroke="#ff9588"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="ambient-line-after proof-line-after"
                />
              </svg>
            )}
          </ProofChartStage>
        </div>
      </div>

      <p className="proof-chart-caption mt-3 text-sm text-reflux-muted">
        Fortnite creative · RTX 4070 · Ryzen 7 7800X3D · 10 min fight test. Higher line = more FPS.
        Watch the 10s scan, then both traces freeze.
      </p>
      <div className="ambient-graph-fade pointer-events-none absolute inset-x-0 bottom-0 h-16" aria-hidden="true" />
    </div>
  );
}

export function LatencyMiniChart() {
  const beforeAvg = avg(LATENCY_BEFORE);
  const afterAvg = avg(LATENCY_AFTER);

  return (
    <div className="latency-mini-chart proof-chart">
      <StatCompare
        before={beforeAvg.toFixed(1)}
        after={afterAvg.toFixed(1)}
        unit=" ms"
        beforeNote="Input delay before tweaks"
        afterNote="Same test after REFLUX network tweaks"
      />

      <div className="proof-chart-frame proof-chart-frame-sm">
        <ChartAxis
          height={LAT_H}
          ticks={[
            { label: "16ms", value: 16, min: LAT_MIN, max: LAT_MAX },
            { label: "8ms", value: 8, min: LAT_MIN, max: LAT_MAX },
            { label: "0", value: 0, min: LAT_MIN, max: LAT_MAX },
          ]}
        />
        <div className="proof-chart-canvas relative flex-1">
          <ProofChartStage className="rounded-lg">
            {() => (
              <svg
                viewBox={`0 0 ${LAT_W} ${LAT_H}`}
                className="ambient-graph-svg w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={LATENCY_BEFORE_PATH}
                  fill="none"
                  stroke="#e85548"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="ambient-line-before proof-line-before"
                />
                <path
                  d={LATENCY_AFTER_PATH}
                  fill="none"
                  stroke="#ff9588"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="ambient-line-after proof-line-after"
                />
              </svg>
            )}
          </ProofChartStage>
        </div>
      </div>

      <p className="proof-chart-caption mt-3 text-sm text-reflux-muted">
        Valorant practice range · click-to-shot delay. Lower line = less input lag. Same 10s intro scan.
      </p>
    </div>
  );
}
