export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15" aria-hidden="true">
      <div className="top-glow-wash" />
      <div className="ambient-orb top-glow-orb top-glow-orb-left" />
      <div className="ambient-orb top-glow-orb top-glow-orb-right" style={{ animationDelay: "-9s" }} />
      <div className="ambient-orb top-glow-orb-center" style={{ animationDelay: "-4s" }} />
      <div
        className="ambient-orb hero-glow absolute bottom-[8%] left-[15%] h-[360px] w-[360px] rounded-full bg-reflux-accent/12 blur-[90px]"
        style={{ animationDelay: "-14s" }}
      />
      <div className="grid-overlay absolute inset-0 opacity-[0.18]" />
    </div>
  );
}
