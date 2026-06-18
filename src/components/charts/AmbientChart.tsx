"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  buildJaggedPathFromSeries,
  buildSmoothPathFromSeries,
} from "@/components/sections/resultChartPaths";

export const PROOF_INTRO_MS = 10000;

const W = 900;
const PANEL_H = 110;

const FPS_BEFORE = [
  22, 28, 19, 26, 21, 30, 18, 25, 23, 29, 20, 27, 24, 31, 19, 26, 22, 28, 21, 25,
  24, 27, 20, 29, 22, 25, 18, 28, 23, 26, 20, 30, 19, 27, 23, 24, 21, 28, 20, 25,
];
const FPS_AFTER = Array.from({ length: 40 }, (_, i) => 96 + (i % 3 === 0 ? 2 : i % 3 === 1 ? 1 : 0));

const LATENCY_BEFORE = [
  11, 13, 9, 12, 10, 14, 9, 11, 12, 13, 10, 11, 12, 14, 9, 12, 10, 11, 9, 13,
  11, 12, 10, 13, 11, 12, 9, 12, 11, 10, 9, 13, 11, 10, 9, 12, 11, 12, 10, 11,
];
const LATENCY_AFTER = Array.from({ length: 40 }, (_, i) => 2 + (i % 4 === 0 ? 0.4 : 0));

const CHART_COLORS = {
  fpsBefore: { stroke: "#f97316", fill: "rgba(249,115,22,0.18)", glow: "rgba(249,115,22,0.55)" },
  fpsAfter: { stroke: "#38bdf8", fill: "rgba(56,189,248,0.2)", glow: "rgba(56,189,248,0.55)" },
  latBefore: { stroke: "#c084fc", fill: "rgba(192,132,252,0.16)", glow: "rgba(192,132,252,0.5)" },
  latAfter: { stroke: "#34d399", fill: "rgba(52,211,153,0.18)", glow: "rgba(52,211,153,0.55)" },
};

function valueToY(value: number, min: number, max: number, height: number, pad = 14) {
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

function ChartPanel({
  label,
  sublabel,
  value,
  unit,
  color,
  path,
  areaPath,
  min,
  max,
  ticks,
  smooth = false,
  intro,
  panelClass,
}: {
  label: string;
  sublabel: string;
  value: string;
  unit: string;
  color: (typeof CHART_COLORS)["fpsBefore"];
  path: string;
  areaPath: string;
  min: number;
  max: number;
  ticks: string[];
  smooth?: boolean;
  intro: boolean;
  panelClass?: string;
}) {
  const variant =
    panelClass ?? (smooth ? "proof-chart-panel-after" : "proof-chart-panel-before");

  return (
    <div className={`proof-chart-panel reflux-glow-box ${variant}`}>
      <div className="proof-chart-panel-head">
        <div>
          <div className="proof-chart-panel-label" style={{ color: color.stroke }}>
            {label}
          </div>
          <div className="proof-chart-panel-sublabel">{sublabel}</div>
        </div>
        <div className="proof-stat-value reflux-metric" style={{ color: color.stroke }}>
          {value}
          <span className="proof-stat-unit">{unit}</span>
        </div>
      </div>
      <div className="proof-chart-panel-body">
        <div className="proof-chart-axis proof-chart-axis-inline" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} className="proof-chart-axis-tick-inline">
              {tick}
            </span>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${W} ${PANEL_H}`}
          className="ambient-graph-svg w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[0.33, 0.66].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={PANEL_H * pct}
              x2={W}
              y2={PANEL_H * pct}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {!intro ? <path d={areaPath} fill={color.fill} /> : null}
          <path
            d={path}
            fill="none"
            stroke={color.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color.glow})` }}
          />
        </svg>
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
  const min = 0;
  const max = 120;

  const beforePath = toJaggedPath(FPS_BEFORE, W, PANEL_H, min, max);
  const afterPath = toSmoothPath(FPS_AFTER, W, PANEL_H, min, max);
  const beforeArea = toArea(beforePath, W, PANEL_H);
  const afterArea = toArea(afterPath, W, PANEL_H);

  return (
    <div className={`ambient-graph-wrap proof-chart-stacked relative ${className}`}>
      <ProofChartStage>
        {(intro) => (
          <div className="flex flex-col gap-3">
            <ChartPanel
              intro={intro}
              label="Before"
              sublabel="Stock Windows — stutters & drops"
              value={String(beforeAvg)}
              unit=" FPS avg"
              color={CHART_COLORS.fpsBefore}
              path={beforePath}
              areaPath={beforeArea}
              min={min}
              max={max}
              ticks={["120", "60", "0"]}
            />
            <ChartPanel
              intro={intro}
              smooth
              label="After REFLUX"
              sublabel="Same Fortnite session — tweaks on"
              value={String(Math.round(afterAvg))}
              unit=" FPS avg"
              color={CHART_COLORS.fpsAfter}
              path={afterPath}
              areaPath={afterArea}
              min={min}
              max={max}
              ticks={["120", "60", "0"]}
            />
          </div>
        )}
      </ProofChartStage>
      <p className="proof-chart-caption mt-4 text-sm text-reflux-text-soft">
        RTX 4070 · Ryzen 7 7800X3D · Fortnite creative. Top = before, bottom = after. 10s scan then freeze.
      </p>
    </div>
  );
}

export function LatencyMiniChart() {
  const beforeAvg = avg(LATENCY_BEFORE);
  const afterAvg = avg(LATENCY_AFTER);
  const min = 0;
  const max = 16;

  const beforePath = toJaggedPath(LATENCY_BEFORE, W, PANEL_H, min, max);
  const afterPath = toSmoothPath(LATENCY_AFTER, W, PANEL_H, min, max);
  const beforeArea = toArea(beforePath, W, PANEL_H);
  const afterArea = toArea(afterPath, W, PANEL_H);

  return (
    <div className="latency-mini-chart proof-chart-stacked">
      <ProofChartStage>
        {(intro) => (
          <div className="flex flex-col gap-3">
            <ChartPanel
              intro={intro}
              label="Before"
              sublabel="Input delay — stock Windows"
              value={beforeAvg.toFixed(1)}
              unit=" ms"
              color={CHART_COLORS.latBefore}
              path={beforePath}
              areaPath={beforeArea}
              min={min}
              max={max}
              ticks={["16ms", "8ms", "0"]}
              panelClass="proof-chart-panel-lat-before"
            />
            <ChartPanel
              intro={intro}
              smooth
              label="After REFLUX"
              sublabel="Valorant range — click-to-shot"
              value={afterAvg.toFixed(1)}
              unit=" ms"
              color={CHART_COLORS.latAfter}
              path={afterPath}
              areaPath={afterArea}
              min={min}
              max={max}
              ticks={["16ms", "8ms", "0"]}
              panelClass="proof-chart-panel-lat-after"
            />
          </div>
        )}
      </ProofChartStage>
      <p className="proof-chart-caption mt-4 text-sm text-reflux-text-soft">
        Lower line = faster clicks. Purple = before, green = after.
      </p>
    </div>
  );
}
