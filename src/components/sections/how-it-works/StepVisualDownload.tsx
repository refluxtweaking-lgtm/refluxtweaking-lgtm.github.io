import { AnimatedCursor } from "./AnimatedCursor";

export function StepVisualDownload() {
  return (
    <div className="hiw-visual hiw-visual--download">
      <div className="hiw-download-stage">
        <span className="hiw-download-logo">REFLUX TWEAKS</span>
        <span className="hiw-download-cta hiw-download-cta--pulse">Get App</span>
        <span className="hiw-download-hint">Free download · no card</span>
      </div>
      <AnimatedCursor className="hiw-cursor--download" clicking />
    </div>
  );
}
