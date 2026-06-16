const WIDTH = 480;
const HEIGHT = 128;
const POINTS = 32;

function toPath(yValues: number[]) {
  return yValues
    .map((y, i) => {
      const x = (i / (POINTS - 1)) * WIDTH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Fortnite FPS — choppy frame line (top), tight stable line (bottom) */
const FPS_BEFORE_Y = [
  22, 40, 14, 44, 18, 36, 11, 42, 20, 38, 13, 41, 17, 34, 10, 39, 19, 35, 12, 43, 21, 33, 15, 40, 24, 31, 14, 37, 18, 36, 11, 38,
];
const FPS_AFTER_Y = [
  78, 80, 77, 79, 78, 81, 77, 78, 80, 79, 78, 77, 80, 78, 79, 77, 78, 80, 79, 78, 77, 79, 78, 80, 79, 78, 77, 80, 78, 79, 78, 77,
];

/** Input latency — spiky high ms (top), smooth low ms (bottom) */
const LATENCY_BEFORE_Y = [
  20, 36, 16, 40, 22, 32, 14, 38, 24, 30, 13, 37, 19, 28, 15, 35, 23, 31, 17, 39, 21, 27, 14, 34, 26, 29, 18, 33, 20, 30, 16, 36,
];
const LATENCY_AFTER_Y = [
  74, 76, 73, 75, 74, 77, 73, 74, 76, 75, 74, 73, 76, 74, 75, 73, 74, 76, 75, 74, 73, 75, 74, 76, 75, 74, 73, 76, 74, 75, 74, 73,
];

/** 1% lows — deep dips & spikes (top), smoother floor (bottom) */
const LOWS_BEFORE_Y = [
  26, 44, 16, 48, 20, 40, 12, 46, 22, 42, 14, 45, 18, 38, 11, 43, 21, 39, 13, 47, 24, 36, 15, 41, 19, 37, 10, 44, 23, 35, 14, 40,
];
const LOWS_AFTER_Y = [
  76, 79, 75, 78, 76, 80, 75, 76, 79, 78, 76, 75, 79, 76, 78, 75, 76, 79, 78, 76, 75, 78, 76, 79, 78, 76, 75, 79, 76, 78, 76, 75,
];

export type ResultChartId = "fps" | "latency" | "lows";

export const RESULT_CHART = {
  width: WIDTH,
  height: HEIGHT,
  midline: 64,
  fps: { before: toPath(FPS_BEFORE_Y), after: toPath(FPS_AFTER_Y) },
  latency: { before: toPath(LATENCY_BEFORE_Y), after: toPath(LATENCY_AFTER_Y) },
  lows: { before: toPath(LOWS_BEFORE_Y), after: toPath(LOWS_AFTER_Y) },
} as const;
