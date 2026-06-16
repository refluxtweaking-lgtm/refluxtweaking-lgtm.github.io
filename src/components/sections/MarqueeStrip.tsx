const items = [
  "Fortnite",
  "Valorant",
  "Apex",
  "CS2",
  "Warzone",
  "Rocket League",
  "Cyberpunk",
  "Minecraft",
  "Overwatch 2",
  "Rainbow Six",
];

function MarqueePill({ label }: { label: string }) {
  return (
    <span className="marquee-pill inline-flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#b8c2ce]">
      <span className="h-1.5 w-1.5 rounded-full bg-reflux-calm/80 shadow-[0_0_6px_rgba(110,184,224,0.8)]" />
      {label}
    </span>
  );
}

export function MarqueeStrip() {
  const track = [...items, ...items];

  return (
    <div className="marquee-strip px-0">
      <p className="mb-4 text-center text-[10px] font-bold tracking-[0.2em] text-reflux-muted uppercase">
        Works with your favorite games
      </p>
      <div className="marquee-viewport">
        <div className="marquee-track flex w-max gap-3 px-4">
          {track.map((item, i) => (
            <MarqueePill key={`${item}-${i}`} label={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
