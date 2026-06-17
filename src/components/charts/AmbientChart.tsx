"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPathFromSeries,
  initAfterSeries,
  initBeforeSeries,
  LIVE_CHART_CONFIG,
  type LiveChartConfig,
  nextAfterPoint,
  nextBeforePoint,
  seedRandom,
} from "@/components/sections/resultChartPaths";

const W = 900;
const H = 220;
const POINT_INTERVAL_MS = 140;
const LERP = 0.18;

function useSmoothLiveSeries(config: LiveChartConfig, seed: number, active: boolean) {
  const [beforeSeries, setBeforeSeries] = useState(() => initBeforeSeries(config, seed));
  const [afterSeries, setAfterSeries] = useState(() => initAfterSeries(config, seed + 17));
  const targetBefore = useRef(beforeSeries);
  const targetAfter = useRef(afterSeries);
  const randRef = useRef(seedRandom(seed * 31 + 7));

  useEffect(() => {
    targetBefore.current = initBeforeSeries(config, seed);
    targetAfter.current = initAfterSeries(config, seed + 17);
    setBeforeSeries(targetBefore.current);
    setAfterSeries(targetAfter.current);
    randRef.current = seedRandom(seed * 31 + 7);
  }, [config, seed]);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let lastPoint = performance.now();

    const frame = (now: number) => {
      if (now - lastPoint >= POINT_INTERVAL_MS) {
        lastPoint = now;
        const rand = randRef.current;
        targetBefore.current = [
          ...targetBefore.current.slice(1),
          nextBeforePoint(targetBefore.current[targetBefore.current.length - 1], config, rand),
        ];
        targetAfter.current = [
          ...targetAfter.current.slice(1),
          nextAfterPoint(targetAfter.current[targetAfter.current.length - 1], config, rand),
        ];
      }

      setBeforeSeries((prev) =>
        prev.map((v, i) => v + (targetBefore.current[i] - v) * LERP),
      );
      setAfterSeries((prev) =>
        prev.map((v, i) => v + (targetAfter.current[i] - v) * LERP),
      );

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, config]);

  return { beforeSeries, afterSeries };
}

interface AmbientFpsGraphProps {
  active?: boolean;
  className?: string;
}

export function AmbientFpsGraph({ active = true, className = "" }: AmbientFpsGraphProps) {
  const config = LIVE_CHART_CONFIG.fps;
  const { beforeSeries, afterSeries } = useSmoothLiveSeries(config, 42, active);

  const scaleY = (y: number) => (y / 128) * H;
  const beforePath = useMemo(
    () => buildPathFromSeries(beforeSeries.map((y) => scaleY(y)), W),
    [beforeSeries],
  );
  const afterPath = useMemo(
    () => buildPathFromSeries(afterSeries.map((y) => scaleY(y)), W),
    [afterSeries],
  );

  const beforeArea = `${beforePath} L ${W} ${H} L 0 ${H} Z`;
  const afterArea = `${afterPath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className={`ambient-graph-wrap relative ${className}`}>
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
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="ambient-graph-svg w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ambientBeforeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(232,85,72,0.18)" />
            <stop offset="100%" stopColor="rgba(232,85,72,0)" />
          </linearGradient>
          <linearGradient id="ambientAfterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(94,196,239,0.22)" />
            <stop offset="100%" stopColor="rgba(94,196,239,0)" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={beforeArea} fill="url(#ambientBeforeFill)" className="ambient-chart-area" />
        <path d={afterArea} fill="url(#ambientAfterFill)" className="ambient-chart-area" />
        <path
          d={beforePath}
          fill="none"
          stroke="#e85548"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#lineGlow)"
          className="ambient-line-before"
        />
        <path
          d={afterPath}
          fill="none"
          stroke="#5ec4ef"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#lineGlow)"
          className="ambient-line-after"
        />
      </svg>
      <div className="ambient-graph-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden="true" />
    </div>
  );
}

interface LatencyMiniChartProps {
  active?: boolean;
}

export function LatencyMiniChart({ active = true }: LatencyMiniChartProps) {
  const config = LIVE_CHART_CONFIG.latency;
  const { beforeSeries, afterSeries } = useSmoothLiveSeries(config, 88, active);

  const w = 400;
  const h = 100;
  const scaleY = (y: number) => (y / 128) * h;

  const beforePath = useMemo(
    () => buildPathFromSeries(beforeSeries.map(scaleY), w),
    [beforeSeries, w],
  );
  const afterPath = useMemo(
    () => buildPathFromSeries(afterSeries.map(scaleY), w),
    [afterSeries, w],
  );

  return (
    <div className="latency-mini-chart rounded-xl border border-white/8 bg-[#080a0f]/90 p-4">
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
      <svg viewBox={`0 0 ${w} ${h}`} className="ambient-graph-svg w-full" preserveAspectRatio="none" aria-hidden="true">
        <path
          d={beforePath}
          fill="none"
          stroke="#e85548"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="ambient-line-before"
        />
        <path
          d={afterPath}
          fill="none"
          stroke="#5ec4ef"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="ambient-line-after"
        />
      </svg>
    </div>
  );
}
