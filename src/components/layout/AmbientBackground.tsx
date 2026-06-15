export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div
        className="hero-glow -top-40 left-[10%] h-[560px] w-[560px] bg-reflux-accent/25"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="hero-glow top-1/4 -right-40 h-[480px] w-[480px] bg-reflux-discord/18"
        style={{ animationDelay: "2s", animationDuration: "10s" }}
      />
      <div
        className="hero-glow bottom-[-80px] left-1/3 h-[420px] w-[420px] bg-reflux-purple/15"
        style={{ animationDelay: "4s", animationDuration: "12s" }}
      />
      <div
        className="hero-glow top-[55%] left-[55%] h-[300px] w-[300px] bg-reflux-green/8"
        style={{ animationDelay: "1s", animationDuration: "14s" }}
      />
      <div className="grid-overlay absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 50% -10%, rgba(241,91,80,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 100% 40%, rgba(88,101,242,0.08) 0%, transparent 50%), radial-gradient(ellipse 40% 30% at 0% 70%, rgba(179,146,240,0.06) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
