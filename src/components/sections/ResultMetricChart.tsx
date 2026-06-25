"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPathFromSeries,
  CHART_HEIGHT,
  CHART_MIDLINE,
  CHART_WIDTH,
  initAfterSeries,
  initBeforeSeries,
  jitterReadout,
  LIVE_CHART_CONFIG,
  LIVE_DURATION_MS,
  LIVE_POINTS,
  LIVE_TICK_MS,
  nextAfterPoint,
  nextBeforePoint,
  seedRandom,
  type ResultChartId,
} from "./resultChartPaths";

export interface ResultMetric {
  id: ResultChartId;
  label: string;
  session: string;
  scenario: string;
  before: number;
  after: number;
  unit: string;
  delta: string;
  color: string;
  stroke: string;
  fill: string;
  gain: string;
  beforeLabel: string;
  afterLabel: string;
  beforeStroke: string;
  afterStroke: string;
  beforeGlow: string;
  afterGlow: string;
}

interface ResultMetricChartProps {
  metric: ResultMetric;
  isLive: boolean;
  liveKey: number;
  large?: boolean;
}

export function ResultMetricChart({ metric, isLive, liveKey, large = false }: ResultMetricChartProps) {
  const config = LIVE_CHART_CONFIG[metric.id];
  const [beforeSeries, setBeforeSeries] = useState<number[]>(() => initBeforeSeries(config, liveKey));
  const [afterSeries, setAfterSeries] = useState<number[]>(() => initAfterSeries(config, liveKey + 17));
  const [beforeReadout, setBeforeReadout] = useState(metric.before);
  const [afterReadout, setAfterReadout] = useState(metric.after);
  const [phase, setPhase] = useState<"idle" | "live" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const randRef = useRef(seedRandom(liveKey * 31 + 7));

  useEffect(() => {
    randRef.current = seedRandom(liveKey * 31 + 7);
    setBeforeSeries(initBeforeSeries(config, liveKey));
    setAfterSeries(initAfterSeries(config, liveKey + 17));
    setBeforeReadout(metric.before);
    setAfterReadout(metric.after);
    setProgress(0);
    setPhase(isLive ? "live" : "idle");
  }, [config, isLive, liveKey, metric.after, metric.before]);

  useEffect(() => {
    if (!isLive || phase !== "live") return;

    const start = performance.now();
    let intervalId = 0;

    intervalId = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const rand = randRef.current;

      if (elapsed >= LIVE_DURATION_MS) {
        window.clearInterval(intervalId);
        setBeforeReadout(metric.before);
        setAfterReadout(metric.after);
        setProgress(1);
        setPhase("done");
        return;
      }

      setProgress(elapsed / LIVE_DURATION_MS);
      setBeforeSeries((s) => {
        const last = s[s.length - 1] ?? s[0];
        const next = nextBeforePoint(last, config, rand);
        return [...s.slice(1), next];
      });
      setAfterSeries((s) => {
        const last = s[s.length - 1] ?? s[0];
        const next = nextAfterPoint(last, config, rand);
        return [...s.slice(1), next];
      });

      const spread = metric.id === "latency" ? 1.2 : metric.id === "fps" ? 14 : 11;
      const decimals = metric.id === "latency" ? 1 : 0;
      setBeforeReadout(jitterReadout(metric.before, spread, rand, decimals));
      setAfterReadout(jitterReadout(metric.after, spread * 0.35, rand, decimals));
    }, LIVE_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [config, isLive, metric.after, metric.before, metric.id, phase, liveKey]);

  const beforePath = useMemo(() => buildPathFromSeries(beforeSeries), [beforeSeries]);
  const afterPath = useMemo(() => buildPathFromSeries(afterSeries), [afterSeries]);
  const scanX = progress * CHART_WIDTH;
  const isRecording = phase === "live";
  const chartHeight = large ? 200 : 168;

  return (
    <div className="result-metric-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-base font-bold text-white">{metric.label}</p>
            {isRecording && (
              <span className="reflux-glow-readable inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-reflux-green">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green shadow-[0_0_8px_#5dde86]" />
                Recording
              </span>
            )}
            {phase === "done" && (
              <span className="reflux-glow-readable rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-reflux-text-soft">
                Captured
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-reflux-text-soft">{metric.session}</p>
        </div>
        <p className="reflux-glow-readable max-w-[220px] rounded-lg px-3 py-2 text-right text-[11px] leading-snug text-reflux-text-soft">
          {metric.scenario}
        </p>
      </div>

      <div className="result-chart-split flex flex-col gap-2.5">
        <div
          className="result-chart-panel result-chart-panel-before reflux-glow-box overflow-hidden rounded-xl p-3"
          style={{
            borderColor: `color-mix(in srgb, ${metric.beforeStroke} 35%, transparent)`,
            boxShadow: `0 0 32px -14px ${metric.beforeGlow}`,
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: metric.beforeStroke }}
            >
              Before — {metric.beforeLabel}
            </span>
            <span className="reflux-metric text-sm font-bold tabular-nums" style={{ color: metric.beforeStroke }}>
              {beforeReadout}
              <span className="ml-0.5 text-[10px] font-medium text-reflux-muted">{metric.unit}</span>
            </span>
          </div>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_MIDLINE}`}
            className="w-full"
            style={{ height: chartHeight * 0.42 }}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={`before-clip-${metric.id}-${liveKey}`}>
                <rect x="0" y="0" width={CHART_WIDTH} height={CHART_MIDLINE} />
              </clipPath>
            </defs>
            <g clipPath={`url(#before-clip-${metric.id}-${liveKey})`}>
              <path
                d={beforePath}
                fill="none"
                stroke={metric.beforeStroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 5px ${metric.beforeGlow})` }}
              />
              {isRecording && (
                <line
                  x1={scanX}
                  y1="0"
                  x2={scanX}
                  y2={CHART_MIDLINE}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          </svg>
        </div>

        <div
          className="result-chart-panel result-chart-panel-after reflux-glow-box overflow-hidden rounded-xl p-3"
          style={{
            borderColor: `color-mix(in srgb, ${metric.afterStroke} 35%, transparent)`,
            boxShadow: `0 0 32px -14px ${metric.afterGlow}`,
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: metric.afterStroke }}
            >
              After — {metric.afterLabel}
            </span>
            <span className="reflux-metric text-sm font-bold tabular-nums" style={{ color: metric.afterStroke }}>
              {afterReadout}
              <span className="ml-0.5 text-[10px] font-medium text-reflux-muted">{metric.unit}</span>
            </span>
          </div>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full"
            style={{ height: chartHeight * 0.42 }}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={`after-clip-${metric.id}-${liveKey}`}>
                <rect x="0" y={CHART_MIDLINE} width={CHART_WIDTH} height={CHART_HEIGHT - CHART_MIDLINE} />
              </clipPath>
            </defs>
            <g clipPath={`url(#after-clip-${metric.id}-${liveKey})`}>
              <path
                d={`${afterPath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`}
                fill={metric.afterStroke}
                opacity="0.1"
              />
              <path
                d={afterPath}
                fill="none"
                stroke={metric.afterStroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${metric.afterGlow})` }}
              />
              {isRecording && (
                <line
                  x1={scanX}
                  y1={CHART_MIDLINE}
                  x2={scanX}
                  y2={CHART_HEIGHT}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="reflux-glow-box reflux-glow-box-sm rounded-xl p-3 text-center">
          <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Without REFLUX</div>
          <div
            className="reflux-metric mt-1 text-xl font-bold line-through tabular-nums sm:text-2xl"
            style={{ color: metric.beforeStroke }}
          >
            {metric.before}
            <span className="ml-0.5 text-xs font-medium text-reflux-muted">{metric.unit}</span>
          </div>
        </div>
        <div
          className="reflux-glow-box rounded-xl p-3 text-center"
          style={{
            borderColor: `color-mix(in srgb, ${metric.afterStroke} 40%, transparent)`,
            boxShadow: `0 0 36px -12px ${metric.afterGlow}`,
          }}
        >
          <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Gain</div>
          <div className="reflux-metric mt-1 text-2xl font-extrabold sm:text-3xl" style={{ color: metric.afterStroke }}>
            {metric.delta}
            <span className="ml-1 text-sm font-bold text-reflux-muted">{metric.unit}</span>
          </div>
        </div>
        <div
          className="reflux-glow-box rounded-xl p-3 text-center"
          style={{
            borderColor: `color-mix(in srgb, ${metric.afterStroke} 35%, transparent)`,
            boxShadow: `0 0 28px -14px ${metric.afterGlow}`,
          }}
        >
          <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color: metric.afterStroke }}>
            With REFLUX PRO
          </div>
          <div className="reflux-metric mt-1 text-xl font-extrabold tabular-nums sm:text-2xl" style={{ color: metric.afterStroke }}>
            {metric.after}
            <span className="ml-0.5 text-xs font-medium text-reflux-muted">{metric.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
