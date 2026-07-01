import { PRODUCT_LIMITS } from "@/data/tweaks";

export function HeroLaunchRail() {
  return (
    <div className="hero-spec-strip" aria-label="REFLUX availability">
      <div className="hero-spec-scan" aria-hidden="true" />
      <div className="hero-spec-cell">
        <span className="hero-spec-index">01</span>
        <div className="hero-spec-copy">
          <span className="hero-spec-title">FREE</span>
          <span className="hero-spec-meta">no card · desktop app</span>
        </div>
      </div>
      <div className="hero-spec-split" aria-hidden="true">
        <span />
      </div>
      <div className="hero-spec-cell hero-spec-cell--pro">
        <span className="hero-spec-index">02</span>
        <div className="hero-spec-copy">
          <span className="hero-spec-title hero-spec-title--pro">
            <span className="hero-spec-metric reflux-metric">{PRODUCT_LIMITS.totalTweaksLabel}</span>
            <span className="hero-spec-pro-tag">PRO</span>
          </span>
          <span className="hero-spec-meta">full tweak library</span>
        </div>
      </div>
    </div>
  );
}
