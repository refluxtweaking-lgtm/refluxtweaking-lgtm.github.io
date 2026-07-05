export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="ambient-horizon-wash" />
      <div className="top-glow-sides" />
      <div className="ambient-orb ambient-orb-center absolute -top-56 left-1/2 h-[min(80vh,760px)] w-[min(220vw,2800px)] -translate-x-1/2 rounded-full bg-reflux-accent/12 blur-[180px]" />
      <div
        className="ambient-orb ambient-orb-left absolute -top-40 -left-[10%] h-[620px] w-[min(100vw,1200px)] rounded-full bg-reflux-accent/10 blur-[150px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="ambient-orb ambient-orb-right absolute -top-40 -right-[10%] h-[620px] w-[min(100vw,1200px)] rounded-full bg-reflux-accent/10 blur-[150px]"
        style={{ animationDelay: "-14s" }}
      />
      <div
        className="ambient-orb absolute top-[42%] left-1/2 h-[480px] w-[min(160vw,2000px)] -translate-x-1/2 rounded-full bg-reflux-accent/6 blur-[140px]"
        style={{ animationDelay: "-20s" }}
      />
    </div>
  );
}
