const items = [
  "Fortnite",
  "Valorant",
  "Apex Legends",
  "CS2",
  "Warzone",
  "Rocket League",
  "Cyberpunk 2077",
  "Minecraft",
  "Overwatch 2",
  "Rainbow Six",
  "Lower latency",
  "Higher FPS",
  "Cleaner Windows",
  "One-click tweaks",
];

export function MarqueeStrip() {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-strip relative mt-16 overflow-hidden border-y border-white/5 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-reflux-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-reflux-bg to-transparent" />
      <div className="marquee-track flex w-max gap-3">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-[#b8c2ce] backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-reflux-accent shadow-[0_0_8px_rgba(241,91,80,0.8)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
