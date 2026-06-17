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

function MarqueePill({ name }: { name: string }) {
  return (
    <span className="marquee-pill inline-flex shrink-0 items-center rounded-full border border-white/[0.08] bg-[#12151c] px-4 py-2 text-sm font-medium text-white/90">
      {name}
    </span>
  );
}

export function MarqueeStrip() {
  const track = [...items, ...items];

  return (
    <div className="marquee-strip border-y border-white/[0.06] bg-[#0c0e12]/80 py-5">
      <p className="mb-4 text-center text-xs font-medium tracking-widest text-reflux-muted uppercase">
        Works with the games you actually play
      </p>
      <div className="marquee-viewport">
        <div className="marquee-track flex w-max gap-3 px-4">
          {track.map((name, i) => (
            <MarqueePill key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}
