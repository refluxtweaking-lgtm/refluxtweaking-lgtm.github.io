export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="ambient-orb hero-glow absolute -top-40 left-[-8%] h-[480px] w-[55vw] max-w-[720px] rounded-full bg-reflux-accent/20 blur-[110px]" />
      <div
        className="ambient-orb hero-glow absolute -top-40 right-[-8%] h-[480px] w-[55vw] max-w-[720px] rounded-full bg-reflux-accent/20 blur-[110px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="ambient-orb hero-glow absolute top-[15%] left-1/2 h-[420px] w-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-reflux-accent/14 blur-[100px]"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="ambient-orb hero-glow absolute bottom-[8%] left-[15%] h-[360px] w-[360px] rounded-full bg-reflux-accent/14 blur-[80px]"
        style={{ animationDelay: "-12s" }}
      />
      <div
        className="ambient-orb hero-glow absolute top-[55%] right-[25%] h-[280px] w-[280px] rounded-full bg-reflux-accent/10 blur-[70px]"
        style={{ animationDelay: "-18s" }}
      />
      <div className="grid-overlay absolute inset-0 opacity-35" />
      <div className="hero-beam absolute inset-x-0 top-0 h-[480px]" />
    </div>
  );
}
