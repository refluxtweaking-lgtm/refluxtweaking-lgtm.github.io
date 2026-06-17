const items = [
  { name: "Fortnite", color: "#6eb8e0" },
  { name: "Valorant", color: "#ff6b5b" },
  { name: "Apex", color: "#ff4655" },
  { name: "CS2", color: "#f1c40f" },
  { name: "Warzone", color: "#5dde86" },
  { name: "Rocket League", color: "#5865f2" },
  { name: "Cyberpunk", color: "#fcee09" },
  { name: "Minecraft", color: "#5dde86" },
  { name: "Overwatch 2", color: "#ff9f43" },
  { name: "Rainbow Six", color: "#b392f0" },
];

function MarqueePill({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="marquee-pill inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-[#12151c] px-4 py-2.5 text-sm font-semibold text-white"
      style={{ boxShadow: `0 0 16px -6px ${color}66` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
      {name}
    </span>
  );
}

export function MarqueeStrip() {
  const track = [...items, ...items];

  return (
    <div className="marquee-strip hero-marquee px-0">
      <p className="mb-4 text-center text-xs font-bold tracking-[0.25em] text-reflux-muted uppercase">
        Works with the games you <span className="gradient-text-static">actually play</span>
      </p>
      <div className="marquee-viewport">
        <div className="marquee-track flex w-max gap-3 px-4">
          {track.map((item, i) => (
            <MarqueePill key={`${item.name}-${i}`} name={item.name} color={item.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
