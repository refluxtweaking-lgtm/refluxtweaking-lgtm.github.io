"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPathFromSeries,
  initAfterSeries,
  initBeforeSeries,
  LIVE_CHART_CONFIG,
  LIVE_POINTS,
  LIVE_TICK_MS,
  nextAfterPoint,
  nextBeforePoint,
  seedRandom,
} from "@/components/sections/resultChartPaths";

const W = 900;
const H = 220;

interface AmbientFpsGraphProps {
  active?: boolean;
  className?: string;
}

export function AmbientFpsGraph({ active = true, className = "" }: AmbientFpsGraphProps) {
  const config = LIVE_CHART_CONFIG.fps;
  const [liveKey] = useState(42);
  const [beforeSeries, setBeforeSeries] = useState(() => initBeforeSeries(config, liveKey));
  const [afterSeries, setAfterSeries] = useState(() => initAfterSeries(config, liveKey + 17));
  const randRef = useRef(seedRandom(liveKey * 31 + 7));

  useEffect(() => {
    if (!active) return;
    randRef.current = seedRandom(liveKey * 31 + 7);
    const id = window.setInterval(() => {
      const rand = randRef.current;
      setBeforeSeries((prev) => {
        const next = [...prev.slice(1), nextBeforePoint(prev[prev.length - 1], config, rand)];
        return next;
      });
      setAfterSeries((prev) => {
        const next = [...prev.slice(1), nextAfterPoint(prev[prev.length - 1], config, rand)];
        return next;
      });
    }, LIVE_TICK_MS);
    return () => clearInterval(id);
  }, [active, config, liveKey]);

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
        <path d={beforeArea} fill="url(#ambientBeforeFill)" />
        <path d={afterArea} fill="url(#ambientAfterFill)" />
        <path
          d={beforePath}
          fill="none"
          stroke="#e85548"
          strokeWidth="2.5"
          filter="url(#lineGlow)"
          className="ambient-line-before"
        />
        <path
          d={afterPath}
          fill="none"
          stroke="#5ec4ef"
          strokeWidth="3"
          filter="url(#lineGlow)"
          className="ambient-line-after"
        />
      </svg>
      <div className="ambient-graph-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden="true" />
    </div>
  );
}

interface PingTrailProps {
  variant: "before" | "after";
  ms: number;
}

export function PingTrail({ variant, ms }: PingTrailProps) {
  const isAfter = variant === "after";
  const dotCount = isAfter ? 28 : 8;
  const color = isAfter ? "#5ec4ef" : "#e85548";

  return (
    <div className="ping-trail-wrap">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span className={isAfter ? "text-reflux-calm" : "text-[#c47068]"}>
          {isAfter ? "With REFLUX" : "Without REFLUX"}
        </span>
        <span
          className={`tabular-nums text-lg font-extrabold ${isAfter ? "text-reflux-calm" : "text-[#8b95a8]"}`}
        >
          {ms} ms
        </span>
      </div>
      <div className="ping-trail-track relative h-10 overflow-hidden rounded-lg border border-white/6 bg-[#080a0f]/80">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/8" />
        <div className={`ping-trail-dots flex h-full items-center ${isAfter ? "ping-trail-dense" : "ping-trail-sparse"}`}>
          {Array.from({ length: dotCount }, (_, i) => (
            <span
              key={i}
              className="ping-trail-dot shrink-0 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 8px ${color}`,
                animationDelay: `${i * (isAfter ? 0.08 : 0.35)}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LatencyMiniChartProps {
  active?: boolean;
}

export function LatencyMiniChart({ active = true }: LatencyMiniChartProps) {
  const config = LIVE_CHART_CONFIG.latency;
  const [liveKey] = useState(88);
  const [beforeSeries, setBeforeSeries] = useState(() => initBeforeSeries(config, liveKey));
  const [afterSeries, setAfterSeries] = useState(() => initAfterSeries(config, liveKey + 11));
  const randRef = useRef(seedRandom(liveKey));

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      const rand = randRef.current;
      setBeforeSeries((p) => [...p.slice(1), nextBeforePoint(p[p.length - 1], config, rand)]);
      setAfterSeries((p) => [...p.slice(1), nextAfterPoint(p[p.length - 1], config, rand)]);
    }, LIVE_TICK_MS);
    return () => clearInterval(id);
  }, [active, config]);

  const w = 400;
  const h = 100;
  const scaleY = (y: number) => (y / 128) * h;

  return (
    <div className="latency-mini-chart rounded-xl border border-white/8 bg-[#080a0f]/90 p-3">
      <div className="mb-2 flex gap-4 text-[10px] font-bold uppercase">
        <span className="flex items-center gap-1.5 text-[#e85548]">
          <span className="h-2 w-2 rounded-sm bg-[#e85548]" />
          Before 11 ms
        </span>
        <span className="flex items-center gap-1.5 text-reflux-calm">
          <span className="h-2 w-2 rounded-sm bg-reflux-calm" />
          After 2 ms
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" aria-hidden="true">
        <path
          d={buildPathFromSeries(beforeSeries.map(scaleY), w)}
          fill="none"
          stroke="#e85548"
          strokeWidth="2"
          className="ambient-line-before"
        />
        <path
          d={buildPathFromSeries(afterSeries.map(scaleY), w)}
          fill="none"
          stroke="#5ec4ef"
          strokeWidth="2.5"
          className="ambient-line-after"
        />
      </svg>
    </div>
  );
}
