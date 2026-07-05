import { AnimatedCursor } from "./AnimatedCursor";

const TWEAKS = [
  { name: "Disable Game DVR", on: true },
  { name: "GPU Scheduling", on: true },
  { name: "TCP NoDelay", on: false, target: true },
  { name: "Timer Resolution", on: true },
] as const;

export function StepVisualTweaks() {
  return (
    <div className="hiw-visual hiw-visual--tweaks">
      <div className="hiw-app-shell">
        <div className="hiw-app-titlebar">
          <span className="hiw-app-brand">REFLUX PRO</span>
          <span className="hiw-app-tab hiw-app-tab--active">Tweaks</span>
        </div>
        <div className="hiw-tweak-list">
          {TWEAKS.map((tweak) => (
            <div
              key={tweak.name}
              className={`hiw-tweak-row ${tweak.on ? "hiw-tweak-row--on" : ""} ${"target" in tweak && tweak.target ? "hiw-tweak-row--target" : ""}`}
            >
              <span className="hiw-tweak-name">{tweak.name}</span>
              <span
                className={`hiw-tweak-toggle ${tweak.on ? "hiw-tweak-toggle--on" : ""} ${"target" in tweak && tweak.target ? "hiw-tweak-toggle--click" : ""}`}
                aria-hidden="true"
              >
                <span className="hiw-tweak-toggle-knob" />
              </span>
            </div>
          ))}
        </div>
      </div>
      <AnimatedCursor className="hiw-cursor--tweaks" clicking />
    </div>
  );
}
