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

export function MarqueeStrip() {
  return (
    <div className="marquee-strip px-4">
      <p className="mb-3 text-center text-[10px] font-bold tracking-[0.2em] text-reflux-muted uppercase">
        Works with your favorite games
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#b8c2ce]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-reflux-calm/80" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
