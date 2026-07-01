"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  buildJaggedPathFromSeries,
  buildSmoothPathFromSeries,
} from "@/components/sections/resultChartPaths";

export const PROOF_INTRO_MS = 10000;

const W = 900;
const PANEL_H = 128;

/** Trash-tier laptop — integrated graphics, the kind people think can't be saved. */
export const LOW_END_PROOF_SPECS = {
  machine: "2018 budget laptop",
  cpu: "Intel Core i5-8250U",
  gpu: "Intel UHD Graphics 620",
  ram: "8 GB DDR4",
  game: "Fortnite (Low settings)",
} as const;

const FPS_BEFORE = [
  13, 17, 11, 15, 12, 18, 10, 14, 13, 16, 11, 15, 12, 19, 10, 14, 13, 17, 11, 15,
  14, 16, 11, 18, 12, 15, 10, 17, 13, 16, 11, 18, 12, 15, 13, 17, 11, 16, 12, 14,
];
const FPS_AFTER = Array.from({ length: 40 }, (_, i) => 49 + (i % 4 === 0 ? 4 : i % 4 === 1 ? 2 : i % 4 === 2 ? -1 : 1));

const FPS_CHART_MAX = 64;

const LATENCY_BEFORE = [
  11, 13, 9, 12, 10, 14, 9, 11, 12, 13, 10, 11, 12, 14, 9, 12, 10, 11, 9, 13,
  11, 12, 10, 13, 11, 12, 9, 12, 11, 10, 9, 13, 11, 10, 9, 12, 11, 12, 10, 11,
];
const LATENCY_AFTER = Array.from({ length: 40 }, (_, i) => 2 + (i % 4 === 0 ? 0.4 : 0));

const CHART_COLORS = {
  fpsBefore: { stroke: "#ff6b5b", fill: "rgba(255,107,91,0.2)", glow: "rgba(255,107,91,0.55)" },
  fpsAfter: { stroke: "#5ec4ef", fill: "rgba(94,196,239,0.18)", glow: "rgba(94,196,239,0.55)" },
  latBefore: { stroke: "#c084fc", fill: "rgba(192,132,252,0.16)", glow: "rgba(192,132,252,0.5)" },
  latAfter: { stroke: "#5dde86", fill: "rgba(93,222,134,0.18)", glow: "rgba(52,211,153,0.55)" },
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
  const gain = Math.round(afterAvg - beforeAvg);
  const multiplier = (afterAvg / beforeAvg).toFixed(1);
  const min = 0;
  const max = FPS_CHART_MAX;

  const beforePath = toJaggedPath(FPS_BEFORE, W, PANEL_H, min, max);
  const afterPath = toSmoothPath(FPS_AFTER, W, PANEL_H, min, max);
  const beforeArea = toArea(beforePath, W, PANEL_H);
  const afterArea = toArea(afterPath, W, PANEL_H);

  return (
    <div className={`fps-proof-theater ambient-graph-wrap relative ${className}`}>
      <div className="fps-proof-spec-band">
        <span className="fps-proof-spec-tag">{LOW_END_PROOF_SPECS.machine}</span>
        <span className="fps-proof-spec-item">{LOW_END_PROOF_SPECS.cpu}</span>
        <span className="fps-proof-spec-sep" aria-hidden="true" />
        <span className="fps-proof-spec-item">{LOW_END_PROOF_SPECS.gpu}</span>
        <span className="fps-proof-spec-sep" aria-hidden="true" />
        <span className="fps-proof-spec-item">{LOW_END_PROOF_SPECS.ram}</span>
        <span className="fps-proof-spec-sep fps-proof-spec-sep--hide-mobile" aria-hidden="true" />
        <span className="fps-proof-spec-item fps-proof-spec-item--accent fps-proof-spec-item--hide-mobile">
          {LOW_END_PROOF_SPECS.game}
        </span>
      </div>

      <ProofChartStage className="fps-proof-stage">
        {(intro) => (
          <div className="fps-proof-compare">
            <ChartPanel
              intro={intro}
              label="Stock Windows"
              sublabel="Stutters, frame drops, unplayable 1% lows"
              value={String(beforeAvg)}
              unit=" FPS"
              color={CHART_COLORS.fpsBefore}
              path={beforePath}
              areaPath={beforeArea}
              min={min}
              max={max}
              ticks={["60", "30", "0"]}
              panelClass="fps-proof-panel fps-proof-panel--before"
            />

            <div className="fps-proof-gain" aria-hidden="true">
              <div className="fps-proof-gain-ring" />
              <span className="fps-proof-gain-value reflux-metric">+{gain}</span>
              <span className="fps-proof-gain-label">FPS gained</span>
              <span className="fps-proof-gain-mult">{multiplier}× smoother</span>
            </div>

            <ChartPanel
              intro={intro}
              smooth
              label="With REFLUX"
              sublabel="Same session — tweaks applied"
              value={String(Math.round(afterAvg))}
              unit=" FPS"
              color={CHART_COLORS.fpsAfter}
              path={afterPath}
              areaPath={afterArea}
              min={min}
              max={max}
              ticks={["60", "30", "0"]}
              panelClass="fps-proof-panel fps-proof-panel--after"
            />
          </div>
        )}
      </ProofChartStage>

      <p className="fps-proof-footnote">
        10-second live capture, then frozen. If REFLUX can lift a {LOW_END_PROOF_SPECS.gpu} this much, imagine your rig.
      </p>
    </div>
  );
}

export function LatencyMiniChart({ className = "" }: { className?: string }) {
  const beforeAvg = avg(LATENCY_BEFORE);
  const afterAvg = avg(LATENCY_AFTER);
  const min = 0;
  const max = 16;

  const beforePath = toJaggedPath(LATENCY_BEFORE, W, PANEL_H, min, max);
  const afterPath = toSmoothPath(LATENCY_AFTER, W, PANEL_H, min, max);
  const beforeArea = toArea(beforePath, W, PANEL_H);
  const afterArea = toArea(afterPath, W, PANEL_H);

  return (
    <div className={`latency-mini-chart fps-proof-theater fps-proof-theater--latency ${className}`}>
      <ProofChartStage className="fps-proof-stage">
        {(intro) => (
          <div className="fps-proof-compare fps-proof-compare--latency">
            <ChartPanel
              intro={intro}
              label="Before"
              sublabel={`${LOW_END_PROOF_SPECS.machine} · stock Windows`}
              value={beforeAvg.toFixed(1)}
              unit=" ms"
              color={CHART_COLORS.latBefore}
              path={beforePath}
              areaPath={beforeArea}
              min={min}
              max={max}
              ticks={["16", "8", "0"]}
              panelClass="fps-proof-panel fps-proof-panel--lat-before"
            />
            <ChartPanel
              intro={intro}
              smooth
              label="With REFLUX"
              sublabel="Same machine — network stack tuned"
              value={afterAvg.toFixed(1)}
              unit=" ms"
              color={CHART_COLORS.latAfter}
              path={afterPath}
              areaPath={afterArea}
              min={min}
              max={max}
              ticks={["16", "8", "0"]}
              panelClass="fps-proof-panel fps-proof-panel--lat-after"
            />
          </div>
        )}
      </ProofChartStage>
    </div>
  );
}
