export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div
        className="hero-glow -top-32 left-1/4 h-[500px] w-[500px] bg-reflux-accent/20"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="hero-glow top-1/3 -right-32 h-[400px] w-[400px] bg-reflux-discord/15"
        style={{ animationDelay: "2s", animationDuration: "10s" }}
      />
      <div
        className="hero-glow bottom-0 left-1/3 h-[350px] w-[350px] bg-reflux-purple/12"
        style={{ animationDelay: "4s", animationDuration: "12s" }}
      />
      <div className="grid-overlay absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(241,91,80,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(88,101,242,0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
