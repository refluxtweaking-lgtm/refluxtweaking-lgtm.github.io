export type ResultChartId = "fps" | "latency" | "lows";

export const CHART_WIDTH = 480;
export const CHART_HEIGHT = 128;
export const CHART_MIDLINE = 64;
export const LIVE_POINTS = 40;
export const LIVE_DURATION_MS = 5000;
export const LIVE_TICK_MS = 90;

export interface LiveChartConfig {
  beforeBand: [number, number];
  afterBand: [number, number];
  beforeSpikeChance: number;
  beforeSpikeSize: number;
  beforeDrift: number;
  afterDrift: number;
  afterNoise: number;
}

export const LIVE_CHART_CONFIG: Record<ResultChartId, LiveChartConfig> = {
  fps: {
    beforeBand: [10, 46],
    afterBand: [74, 84],
    beforeSpikeChance: 0.05,
    beforeSpikeSize: 10,
    beforeDrift: 5,
    afterDrift: 1.6,
    afterNoise: 0.7,
  },
  latency: {
    beforeBand: [12, 44],
    afterBand: [70, 80],
    beforeSpikeChance: 0.06,
    beforeSpikeSize: 8,
    beforeDrift: 4,
    afterDrift: 1.2,
    afterNoise: 0.5,
  },
  lows: {
    beforeBand: [8, 50],
    afterBand: [72, 82],
    beforeSpikeChance: 0.18,
    beforeSpikeSize: 26,
    beforeDrift: 13,
    afterDrift: 2.4,
    afterNoise: 1.2,
  },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function buildPathFromSeries(yValues: number[], width = CHART_WIDTH) {
  return buildSmoothPathFromSeries(yValues, width);
}

/** Catmull-Rom style cubic bezier through explicit x/y points */
export function buildSmoothPathFromPoints(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n < 2) return `M 0 ${(points[0]?.y ?? 0).toFixed(2)}`;

  const tension = 6;
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / tension;
    const cp1y = p1.y + (p2.y - p0.y) / tension;
    const cp2x = p2.x - (p3.x - p1.x) / tension;
    const cp2y = p2.y - (p3.y - p1.y) / tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

/** Catmull-Rom style cubic bezier — no sharp corners between points */
export function buildSmoothPathFromSeries(yValues: number[], width = CHART_WIDTH) {
  const n = yValues.length;
  if (n < 2) return `M 0 ${(yValues[0] ?? 0).toFixed(2)}`;

  const points = yValues.map((y, i) => ({
    x: (i / (n - 1)) * width,
    y,
  }));
  return buildSmoothPathFromPoints(points);
}

export function seedRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function initBeforeSeries(config: LiveChartConfig, seed: number): number[] {
  const rand = seedRandom(seed);
  const mid = (config.beforeBand[0] + config.beforeBand[1]) / 2;
  const series: number[] = [];
  let current = mid;

  for (let i = 0; i < LIVE_POINTS; i++) {
    const spike = rand() < config.beforeSpikeChance ? config.beforeSpikeSize * rand() : 0;
    const drift = (rand() - 0.5) * config.beforeDrift;
    current = clamp(current + drift + spike * (rand() > 0.5 ? 1 : -1), config.beforeBand[0], config.beforeBand[1]);
    series.push(current);
  }

  return series;
}

export function initAfterSeries(config: LiveChartConfig, seed: number): number[] {
  const rand = seedRandom(seed + 991);
  const mid = (config.afterBand[0] + config.afterBand[1]) / 2;
  const series: number[] = [];
  let current = mid;

  for (let i = 0; i < LIVE_POINTS; i++) {
    current = clamp(current + (rand() - 0.5) * config.afterNoise, config.afterBand[0], config.afterBand[1]);
    series.push(current);
  }

  return series;
}

export function nextBeforePoint(prev: number, config: LiveChartConfig, rand: () => number) {
  const spike = rand() < config.beforeSpikeChance ? config.beforeSpikeSize * (0.5 + rand() * 0.5) : 0;
  const direction = rand() > 0.45 ? 1 : -1;
  return clamp(prev + (rand() - 0.5) * config.beforeDrift + spike * direction, config.beforeBand[0], config.beforeBand[1]);
}

export function nextAfterPoint(prev: number, config: LiveChartConfig, rand: () => number) {
  return clamp(prev + (rand() - 0.5) * config.afterDrift + (rand() - 0.5) * config.afterNoise, config.afterBand[0], config.afterBand[1]);
}

export function jitterReadout(target: number, spread: number, rand: () => number, decimals = 0) {
  const delta = (rand() - 0.5) * spread * 2;
  const value = target + delta;
  return decimals > 0 ? Math.round(value * 10) / 10 : Math.round(value);
}
