"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildSmoothPathFromSeries,
  initAfterSeries,
  initBeforeSeries,
  LIVE_CHART_CONFIG,
  LIVE_POINTS,
  type LiveChartConfig,
  nextAfterPoint,
  nextBeforePoint,
  seedRandom,
} from "@/components/sections/resultChartPaths";

const W = 900;
const H = 220;
const POINT_INTERVAL_MS = 160;

function useScrollingChartPair(config: LiveChartConfig, seed: number, active: boolean, width: number) {
  const [beforeSeries, setBeforeSeries] = useState(() => initBeforeSeries(config, seed));
  const [afterSeries, setAfterSeries] = useState(() => initAfterSeries(config, seed + 17));
  const beforeRef = useRef(beforeSeries);
  const afterRef = useRef(afterSeries);
  const beforeGroupRef = useRef<SVGGElement>(null);
  const afterGroupRef = useRef<SVGGElement>(null);
  const randBefore = useRef(seedRandom(seed * 31 + 7));
  const randAfter = useRef(seedRandom(seed * 31 + 29));
  const scrollRef = useRef(0);
  const pointStep = width / (LIVE_POINTS - 1);

  useEffect(() => {
    beforeRef.current = initBeforeSeries(config, seed);
    afterRef.current = initAfterSeries(config, seed + 17);
    setBeforeSeries(beforeRef.current);
    setAfterSeries(afterRef.current);
    randBefore.current = seedRandom(seed * 31 + 7);
    randAfter.current = seedRandom(seed * 31 + 29);
    scrollRef.current = 0;
    beforeGroupRef.current?.setAttribute("transform", "translate(0, 0)");
    afterGroupRef.current?.setAttribute("transform", "translate(0, 0)");
  }, [config, seed]);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      scrollRef.current += (pointStep / POINT_INTERVAL_MS) * dt;

      if (scrollRef.current >= pointStep) {
        scrollRef.current -= pointStep;
        const lastBefore = beforeRef.current[beforeRef.current.length - 1];
        const lastAfter = afterRef.current[afterRef.current.length - 1];
        beforeRef.current = [...beforeRef.current.slice(1), nextBeforePoint(lastBefore, config, randBefore.current)];
        afterRef.current = [...afterRef.current.slice(1), nextAfterPoint(lastAfter, config, randAfter.current)];
        setBeforeSeries([...beforeRef.current]);
        setAfterSeries([...afterRef.current]);
      }

      const offset = -scrollRef.current.toFixed(2);
      beforeGroupRef.current?.setAttribute("transform", `translate(${offset}, 0)`);
      afterGroupRef.current?.setAttribute("transform", `translate(${offset}, 0)`);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, config, pointStep, seed]);

  return { beforeSeries, afterSeries, beforeGroupRef, afterGroupRef };
}

interface AmbientFpsGraphProps {
  active?: boolean;
  className?: string;
}

export function AmbientFpsGraph({ active = true, className = "" }: AmbientFpsGraphProps) {
  const config = LIVE_CHART_CONFIG.fps;
  const { beforeSeries, afterSeries, beforeGroupRef, afterGroupRef } = useScrollingChartPair(config, 42, active, W);

  const scaleY = (y: number) => (y / 128) * H;
  const beforePath = useMemo(
    () => buildSmoothPathFromSeries(beforeSeries.map((y) => scaleY(y)), W),
    [beforeSeries],
  );
  const afterPath = useMemo(
    () => buildSmoothPathFromSeries(afterSeries.map((y) => scaleY(y)), W),
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
          <clipPath id="ambientFpsClip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
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
        <g clipPath="url(#ambientFpsClip)">
          <g ref={beforeGroupRef} className="ambient-chart-scroll">
            <path d={beforeArea} fill="url(#ambientBeforeFill)" />
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
          </g>
          <g ref={afterGroupRef} className="ambient-chart-scroll">
            <path d={afterArea} fill="url(#ambientAfterFill)" />
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
          </g>
        </g>
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
  const w = 400;
  const h = 100;
  const { beforeSeries, afterSeries, beforeGroupRef, afterGroupRef } = useScrollingChartPair(config, 88, active, w);

  const scaleY = (y: number) => (y / 128) * h;
  const beforePath = useMemo(
    () => buildSmoothPathFromSeries(beforeSeries.map(scaleY), w),
    [beforeSeries, w],
  );
  const afterPath = useMemo(
    () => buildSmoothPathFromSeries(afterSeries.map(scaleY), w),
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
        <defs>
          <clipPath id="ambientLatencyClip">
            <rect x="0" y="0" width={w} height={h} />
          </clipPath>
        </defs>
        <g clipPath="url(#ambientLatencyClip)">
          <g ref={beforeGroupRef} className="ambient-chart-scroll">
            <path
              d={beforePath}
              fill="none"
              stroke="#e85548"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-before"
            />
          </g>
          <g ref={afterGroupRef} className="ambient-chart-scroll">
            <path
              d={afterPath}
              fill="none"
              stroke="#5ec4ef"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ambient-line-after"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
