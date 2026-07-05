import { AnimatedCursor } from "./AnimatedCursor";

const TWEAKS = [
  { name: "Disable Game DVR", on: true },
  { name: "GPU Scheduling", on: true },
  { name: "TCP NoDelay", on: false },
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
            <div key={tweak.name} className={`hiw-tweak-row ${tweak.on ? "hiw-tweak-row--on" : ""}`}>
              <span className="hiw-tweak-name">{tweak.name}</span>
              <span className={`hiw-tweak-toggle ${tweak.on ? "hiw-tweak-toggle--on" : ""}`} aria-hidden="true">
                <span className="hiw-tweak-toggle-knob" />
              </span>
            </div>
          ))}
        </div>
        <button type="button" className="hiw-apply-all" tabIndex={-1}>
          Apply all tweaks
        </button>
      </div>
      <AnimatedCursor className="hiw-cursor--tweaks" />
    </div>
  );
}
