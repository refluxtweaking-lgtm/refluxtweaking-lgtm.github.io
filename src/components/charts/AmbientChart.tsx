"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { buildSmoothPathFromSeries } from "@/components/sections/resultChartPaths";

const INTRO_MS = 5000;

const W = 900;
const H = 220;

const FPS_BEFORE = [
  16, 34, 12, 30, 18, 36, 14, 32, 20, 28, 15, 33, 17, 29, 13, 35, 19, 27, 14, 31,
  21, 26, 16, 34, 18, 24, 15, 30, 20, 28, 17, 33, 14, 29, 19, 25, 16, 32, 18, 27,
];
const FPS_AFTER = Array.from({ length: 40 }, (_, i) => 78 + (i % 3 === 0 ? 0.8 : i % 3 === 1 ? -0.4 : 0.2));

const LATENCY_BEFORE = [
  20, 38, 16, 34, 18, 40, 14, 32, 22, 36, 17, 30, 19, 38, 15, 33, 21, 28, 16, 35,
  18, 31, 14, 37, 20, 29, 17, 34, 19, 27, 15, 32, 21, 26, 16, 36, 18, 30, 14, 28,
];
const LATENCY_AFTER = Array.from({ length: 40 }, () => 72.5);

function toPath(values: number[], width: number, height: number) {
  const ys = values.map((v) => (v / 128) * height);
  return buildSmoothPathFromSeries(ys, width);
}

function toArea(linePath: string, width: number, height: number) {
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

const FPS_BEFORE_PATH = toPath(FPS_BEFORE, W, H);
const FPS_AFTER_PATH = toPath(FPS_AFTER, W, H);
const FPS_BEFORE_AREA = toArea(FPS_BEFORE_PATH, W, H);
const FPS_AFTER_AREA = toArea(FPS_AFTER_PATH, W, H);

const LAT_W = 400;
const LAT_H = 100;
const LATENCY_BEFORE_PATH = toPath(LATENCY_BEFORE, LAT_W, LAT_H);
const LATENCY_AFTER_PATH = toPath(LATENCY_AFTER, LAT_W, LAT_H);

function setupLineDraw(svg: SVGSVGElement | null) {
  if (!svg) return;
  svg.querySelectorAll<SVGPathElement>(".proof-line-draw").forEach((path) => {
    const len = path.getTotalLength();
    path.style.setProperty("--path-len", `${len}`);
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
  });
}

function ProofChartStage({
  children,
  mini = false,
  className = "",
}: {
  children: (svgRef: React.RefObject<SVGSVGElement | null>) => ReactNode;
  mini?: boolean;
  className?: string;
}) {
  const [intro, setIntro] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    setupLineDraw(svg);

    const finish = () => {
      svg?.querySelectorAll<SVGPathElement>(".proof-line-draw").forEach((path) => {
        path.style.strokeDashoffset = "0";
      });
      setIntro(false);
    };

    if (document.documentElement.classList.contains("reduce-effects")) {
      finish();
      return;
    }

    const timer = window.setTimeout(finish, INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`proof-chart-stage relative overflow-hidden ${intro ? "proof-chart-intro" : "proof-chart-done"} ${className}`}
    >
      {intro ? (
        <div className={`proof-chart-scan ${mini ? "proof-chart-scan-mini" : ""}`} aria-hidden="true" />
      ) : null}
      <div className="proof-chart-svg-wrap relative z-[1]">{children(svgRef)}</div>
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
        {(svgRef) => (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="ambient-graph-svg w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ambientBeforeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(232,85,72,0.16)" />
                <stop offset="100%" stopColor="rgba(232,85,72,0)" />
              </linearGradient>
              <linearGradient id="ambientAfterFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(94,196,239,0.2)" />
                <stop offset="100%" stopColor="rgba(94,196,239,0)" />
              </linearGradient>
            </defs>
            <path d={FPS_BEFORE_AREA} fill="url(#ambientBeforeFill)" className="proof-area-fill" />
            <path d={FPS_AFTER_AREA} fill="url(#ambientAfterFill)" className="proof-area-fill" />
            <path
              d={FPS_BEFORE_PATH}
              fill="none"
              stroke="#e85548"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-before proof-line-before proof-line-draw"
            />
            <path
              d={FPS_AFTER_PATH}
              fill="none"
              stroke="#5ec4ef"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-after proof-line-after proof-line-draw"
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
      <ProofChartStage mini className="rounded-lg">
        {(svgRef) => (
          <svg
            ref={svgRef}
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
              className="ambient-line-before proof-line-before proof-line-draw"
            />
            <path
              d={LATENCY_AFTER_PATH}
              fill="none"
              stroke="#5ec4ef"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-after proof-line-after proof-line-draw"
            />
          </svg>
        )}
      </ProofChartStage>
    </div>
  );
}
