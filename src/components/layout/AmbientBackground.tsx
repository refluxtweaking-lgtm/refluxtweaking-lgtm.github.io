export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="ambient-orb hero-glow absolute -top-32 left-[8%] h-[520px] w-[520px] rounded-full bg-reflux-accent/24 blur-[100px]" />
      <div className="ambient-orb hero-glow absolute top-[15%] -right-20 h-[440px] w-[440px] rounded-full bg-reflux-calm/16 blur-[90px]" style={{ animationDelay: "-6s" }} />
      <div className="ambient-orb hero-glow absolute bottom-[8%] left-[15%] h-[360px] w-[360px] rounded-full bg-reflux-purple/12 blur-[80px]" style={{ animationDelay: "-12s" }} />
      <div className="ambient-orb hero-glow absolute top-[55%] right-[25%] h-[280px] w-[280px] rounded-full bg-reflux-green/10 blur-[70px]" style={{ animationDelay: "-18s" }} />
      <div className="grid-overlay absolute inset-0 opacity-55" />
      <div className="hero-beam absolute inset-x-0 top-0 h-[420px]" />
    </div>
  );
}
