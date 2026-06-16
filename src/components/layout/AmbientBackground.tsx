export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="hero-glow -top-32 left-[8%] h-[420px] w-[420px] bg-reflux-calm/20" />
      <div className="hero-glow top-[18%] -right-32 h-[360px] w-[360px] bg-reflux-discord/14" />
      <div className="grid-overlay absolute inset-0" />
    </div>
  );
}
