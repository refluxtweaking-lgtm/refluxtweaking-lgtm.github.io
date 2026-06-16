export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="ambient-orb hero-glow -top-32 left-[6%] h-[460px] w-[460px] bg-reflux-calm/22" style={{ animationDelay: "0s" }} />
      <div className="ambient-orb hero-glow top-[22%] -right-28 h-[380px] w-[380px] bg-reflux-discord/16" style={{ animationDelay: "-6s" }} />
      <div className="ambient-orb hero-glow bottom-[8%] left-[18%] h-[320px] w-[320px] bg-reflux-accent/12" style={{ animationDelay: "-12s" }} />
      <div className="grid-overlay absolute inset-0" />
      <div className="ambient-mesh absolute inset-0" />
    </div>
  );
}
