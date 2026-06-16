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
  { name: "Rainbow Six", color: "#a78bfa" },
];

function MarqueePill({ name, color }: { name: string; color: string }) {
  return (
    <span className="marquee-pill inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white">
      <span
        className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
        style={{ backgroundColor: color, color }}
      />
      {name}
    </span>
  );
}

export function MarqueeStrip() {
  const track = [...items, ...items];

  return (
    <div className="marquee-strip hero-marquee px-0">
      <p className="mb-5 text-center text-xs font-bold tracking-[0.25em] text-reflux-muted uppercase">
        Works with the games you actually play
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
