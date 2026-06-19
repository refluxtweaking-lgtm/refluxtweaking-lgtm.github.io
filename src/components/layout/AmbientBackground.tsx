export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-visible" aria-hidden="true">
      <div className="top-glow-sides" />
      <div
        className="ambient-orb hero-glow absolute -top-40 -left-[14%] h-[520px] w-[min(58vw,720px)] rounded-full bg-reflux-accent/24 blur-[130px]"
      />
      <div
        className="ambient-orb hero-glow absolute -top-40 -right-[14%] h-[520px] w-[min(58vw,720px)] rounded-full bg-reflux-accent/24 blur-[130px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="ambient-orb hero-glow absolute top-[18%] left-[22%] h-[380px] w-[380px] rounded-full bg-reflux-accent/10 blur-[100px]"
        style={{ animationDelay: "-14s" }}
      />
      <div
        className="ambient-orb hero-glow absolute top-[55%] right-[18%] h-[300px] w-[300px] rounded-full bg-reflux-accent/8 blur-[80px]"
        style={{ animationDelay: "-20s" }}
      />
      <div className="grid-overlay absolute inset-0 opacity-30" />
    </div>
  );
}
