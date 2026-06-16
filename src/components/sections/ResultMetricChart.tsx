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
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const rand = randRef.current;

      if (elapsed >= LIVE_DURATION_MS) {
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

    return () => clearInterval(id);
  }, [config, isLive, metric.after, metric.before, metric.id, phase, liveKey]);

  const beforePath = useMemo(() => buildPathFromSeries(beforeSeries), [beforeSeries]);
  const afterPath = useMemo(() => buildPathFromSeries(afterSeries), [afterSeries]);
  const scanX = progress * CHART_WIDTH;
  const isRecording = phase === "live";

  return (
    <div className="result-metric-card">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-white">{metric.label}</p>
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-reflux-green/30 bg-reflux-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-reflux-green">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
                Recording
              </span>
            )}
            {phase === "done" && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-reflux-muted">
                Captured
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-reflux-muted">{metric.session}</p>
        </div>
        <p className="max-w-[200px] text-right text-[11px] leading-snug text-reflux-muted">{metric.scenario}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-[#070a10]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-2 text-[10px] font-medium text-reflux-muted">
          <span>{metric.beforeLabel}</span>
          <span className="tabular-nums">{isRecording ? "Live · 5s capture" : "Session avg"}</span>
          <span className={metric.color}>{metric.afterLabel}</span>
        </div>

        <div className="relative px-3 py-4 sm:px-5 sm:py-5">
          <div className="absolute top-4 bottom-4 left-3 z-10 flex w-14 flex-col justify-between text-[10px] font-bold sm:left-5">
            <span className="text-[#8b95a8] tabular-nums">
              {beforeReadout}
              <span className="ml-0.5 text-[8px] font-medium">{metric.unit}</span>
            </span>
            <span className={`tabular-nums ${metric.color}`}>
              {afterReadout}
              <span className="ml-0.5 text-[8px] font-medium text-reflux-muted">{metric.unit}</span>
            </span>
          </div>

          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className={`ml-16 w-full sm:ml-[4.5rem] ${large ? "h-[168px] sm:h-[188px]" : "h-[140px]"}`}
            role="img"
            aria-label={`${metric.label} live capture`}
            preserveAspectRatio="none"
          >
            <rect x="0" y="0" width={CHART_WIDTH} height={CHART_MIDLINE - 2} fill="rgba(95,106,122,0.06)" rx="4" />
            <rect
              x="0"
              y={CHART_MIDLINE + 2}
              width={CHART_WIDTH}
              height={CHART_HEIGHT - CHART_MIDLINE - 2}
              fill="rgba(255,255,255,0.02)"
              rx="4"
            />
            <line
              x1="0"
              y1={CHART_MIDLINE}
              x2={CHART_WIDTH}
              y2={CHART_MIDLINE}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="5 4"
            />

            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={CHART_HEIGHT * ratio}
                x2={CHART_WIDTH}
                y2={CHART_HEIGHT * ratio}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}

            <path d={`${afterPath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`} fill={metric.stroke} opacity="0.07" />

            <path d={beforePath} className="result-line result-line-before result-line-done" />
            <path d={afterPath} className="result-line result-line-after result-line-done" style={{ stroke: metric.stroke }} />

            {isRecording && (
              <line
                x1={scanX}
                y1="0"
                x2={scanX}
                y2={CHART_HEIGHT}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}
          </svg>

          <div className="mt-2 flex justify-between px-1 text-[9px] tabular-nums text-reflux-muted/70">
            <span>-5s</span>
            <span>now</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 items-end gap-3 text-center">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Without REFLUX</div>
          <div className="mt-1 text-lg font-bold text-[#5a6578] line-through tabular-nums sm:text-xl">
            {metric.before}
            <span className="ml-0.5 text-xs font-medium">{metric.unit}</span>
          </div>
        </div>
        <div className={`text-xl font-extrabold sm:text-2xl ${metric.color}`}>{metric.delta}</div>
        <div>
          <div className="text-[10px] font-bold tracking-wider text-reflux-accent uppercase">With REFLUX Pro</div>
          <div className={`mt-1 text-lg font-extrabold tabular-nums sm:text-xl ${metric.color}`}>
            {metric.after}
            <span className="ml-0.5 text-xs font-medium text-reflux-muted">{metric.unit}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-reflux-border">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${metric.fill} transition-[width] duration-150 ease-linear`}
          style={{ width: phase === "idle" ? "0%" : `${progress * parseFloat(metric.gain) * 100}%` }}
        />
      </div>
    </div>
  );
}
