const WIDTH = 280;
const HEIGHT = 120;
const POINTS = 28;

function toPath(yValues: number[], yOffset = 0) {
  return yValues
    .map((y, i) => {
      const x = (i / (POINTS - 1)) * WIDTH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(y + yOffset).toFixed(1)}`;
    })
    .join(" ");
}

/** Top band — jagged, unstable (bad performance) */
const BEFORE_Y = [
  18, 32, 12, 36, 14, 28, 10, 34, 16, 30, 11, 35, 15, 29, 13, 33, 17, 31, 12, 34, 16, 28, 14, 32, 18, 26, 13, 30,
];

/** Bottom band — smooth, stable (good performance) */
const AFTER_Y = [
  82, 84, 81, 83, 82, 85, 81, 82, 84, 83, 82, 81, 84, 82, 83, 81, 82, 84, 83, 82, 81, 83, 82, 84, 83, 82, 81, 83,
];

export const RESULT_CHART = {
  width: WIDTH,
  height: HEIGHT,
  midline: 60,
  before: toPath(BEFORE_Y),
  after: toPath(AFTER_Y),
} as const;
