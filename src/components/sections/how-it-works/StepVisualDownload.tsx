import { AnimatedCursor } from "./AnimatedCursor";

export function StepVisualDownload() {
  return (
    <div className="hiw-visual hiw-visual--download">
      <div className="hiw-browser-chrome">
        <div className="hiw-browser-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hiw-browser-bar">
          <span className="hiw-browser-logo">REFLUX</span>
          <span className="hiw-browser-link">Pricing</span>
          <span className="hiw-browser-link">Reviews</span>
        </div>
        <div className="hiw-browser-actions">
          <span className="hiw-browser-login">Log In</span>
          <span className="hiw-browser-btn hiw-browser-btn--discord">Discord</span>
          <span className="hiw-browser-btn hiw-browser-btn--cta hiw-browser-btn--pulse">Get App</span>
        </div>
      </div>
      <div className="hiw-browser-body">
        <div className="hiw-browser-hero-line" />
        <div className="hiw-browser-hero-line hiw-browser-hero-line--short" />
      </div>
      <AnimatedCursor className="hiw-cursor--download" clicking />
    </div>
  );
}
