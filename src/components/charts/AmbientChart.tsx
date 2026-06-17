"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  buildJaggedPathFromSeries,
  buildSmoothPathFromSeries,
} from "@/components/sections/resultChartPaths";

const INTRO_MS = 5000;

const W = 900;
const H = 220;

const FPS_BEFORE = [
  22, 30, 18, 28, 20, 32, 17, 26, 21, 29, 19, 27, 23, 31, 18, 25, 22, 28, 20, 26,
  24, 27, 19, 30, 21, 25, 18, 28, 22, 26, 20, 29, 19, 27, 23, 24, 21, 28, 20, 25,
];
const FPS_AFTER = Array.from({ length: 40 }, (_, i) => 78 + (i % 2 === 0 ? 0.5 : -0.3));

const LATENCY_BEFORE = [
  24, 32, 20, 30, 22, 34, 19, 28, 23, 31, 21, 27, 24, 33, 20, 29, 22, 26, 21, 30,
  23, 28, 19, 32, 22, 27, 20, 29, 24, 26, 21, 30, 23, 25, 20, 31, 22, 28, 19, 27,
];
const LATENCY_AFTER = Array.from({ length: 40 }, () => 72.5);

function toJaggedPath(values: number[], width: number, height: number) {
  const ys = values.map((v) => (v / 128) * height);
  return buildJaggedPathFromSeries(ys, width);
}

function toSmoothPath(values: number[], width: number, height: number) {
  const ys = values.map((v) => (v / 128) * height);
  return buildSmoothPathFromSeries(ys, width);
}

function toArea(linePath: string, width: number, height: number) {
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

const FPS_BEFORE_PATH = toJaggedPath(FPS_BEFORE, W, H);
const FPS_AFTER_PATH = toSmoothPath(FPS_AFTER, W, H);
const FPS_BEFORE_AREA = toArea(FPS_BEFORE_PATH, W, H);
const FPS_AFTER_AREA = toArea(FPS_AFTER_PATH, W, H);

const LAT_W = 400;
const LAT_H = 100;
const LATENCY_BEFORE_PATH = toJaggedPath(LATENCY_BEFORE, LAT_W, LAT_H);
const LATENCY_AFTER_PATH = toSmoothPath(LATENCY_AFTER, LAT_W, LAT_H);

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
    const timer = window.setTimeout(() => setIntro(false), INTRO_MS);
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

interface AmbientFpsGraphProps {
  className?: string;
}

export function AmbientFpsGraph({ className = "" }: AmbientFpsGraphProps) {
  return (
    <div className={`ambient-graph-wrap proof-chart relative ${className}`}>
      <div className="ambient-graph-legend absolute right-0 top-0 z-10 flex gap-4 text-[11px] font-semibold sm:text-xs">
        <span className="flex items-center gap-2 text-reflux-calm">
          <span className="h-0.5 w-5 rounded-full bg-reflux-calm shadow-[0_0_8px_rgba(94,196,239,0.8)]" />
          After REFLUX
        </span>
        <span className="flex items-center gap-2 text-[#e85548]">
          <span className="h-0.5 w-5 rounded-full bg-[#e85548] shadow-[0_0_8px_rgba(232,85,72,0.7)]" />
          Before
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
                <stop offset="0%" stopColor="rgba(94,196,239,0.18)" />
                <stop offset="100%" stopColor="rgba(94,196,239,0)" />
              </linearGradient>
            </defs>
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
              stroke="#5ec4ef"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-after proof-line-after"
            />
          </svg>
        )}
      </ProofChartStage>
      <div className="ambient-graph-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden="true" />
    </div>
  );
}

export function LatencyMiniChart() {
  return (
    <div className="latency-mini-chart proof-chart rounded-xl border border-white/8 bg-[#080a0f]/90 p-4">
      <div className="mb-3 flex gap-4 text-[10px] font-bold uppercase tracking-wide">
        <span className="flex items-center gap-1.5 text-[#e85548]">
          <span className="h-2 w-2 rounded-sm bg-[#e85548]" />
          Before 11 ms
        </span>
        <span className="flex items-center gap-1.5 text-reflux-calm">
          <span className="h-2 w-2 rounded-sm bg-reflux-calm" />
          After 2 ms
        </span>
      </div>
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
              stroke="#5ec4ef"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-after proof-line-after"
            />
          </svg>
        )}
      </ProofChartStage>
    </div>
  );
}
