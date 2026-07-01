export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="ambient-horizon-wash" />
      <div className="top-glow-sides" />
      <div className="ambient-orb ambient-orb-center absolute -top-56 left-1/2 h-[min(72vh,680px)] w-[min(140vw,1600px)] -translate-x-1/2 rounded-full bg-reflux-accent/12 blur-[180px]" />
      <div
        className="ambient-orb ambient-orb-left absolute -top-32 -left-[28%] h-[520px] w-[min(72vw,920px)] rounded-full bg-reflux-accent/10 blur-[150px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="ambient-orb ambient-orb-right absolute -top-32 -right-[28%] h-[520px] w-[min(72vw,920px)] rounded-full bg-reflux-accent/10 blur-[150px]"
        style={{ animationDelay: "-14s" }}
      />
      <div
        className="ambient-orb absolute top-[42%] left-1/2 h-[420px] w-[min(100vw,1100px)] -translate-x-1/2 rounded-full bg-reflux-accent/6 blur-[140px]"
        style={{ animationDelay: "-20s" }}
      />
      <div className="grid-overlay absolute inset-0 opacity-30" />
    </div>
  );
}
