export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div
        className="aurora-band hero-glow absolute -top-40 left-[10%] h-[520px] w-[520px] rounded-full bg-reflux-accent/20 blur-[100px]"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-band hero-glow absolute top-[15%] -right-32 h-[440px] w-[440px] rounded-full bg-reflux-calm/18 blur-[90px]"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="aurora-band hero-glow absolute bottom-[5%] left-[15%] h-[380px] w-[380px] rounded-full bg-reflux-discord/14 blur-[80px]"
        style={{ animationDelay: "-10s" }}
      />
      <div
        className="aurora-band hero-glow absolute top-[55%] right-[20%] h-[280px] w-[280px] rounded-full bg-reflux-accent/10 blur-[70px]"
        style={{ animationDelay: "-14s" }}
      />
      <div className="hero-beam pointer-events-none absolute top-0 left-1/2 h-[420px] w-[min(100%,900px)] -translate-x-1/2" />
      <div className="grid-overlay absolute inset-0" />
      <div className="ambient-mesh absolute inset-0" />
    </div>
  );
}
