const items = [
  { name: "Fortnite", color: "#5ec4ef" },
  { name: "Valorant", color: "#ff6b5b" },
  { name: "Apex", color: "#ff4655" },
  { name: "CS2", color: "#f1c40f" },
  { name: "Warzone", color: "#4ee88a" },
  { name: "Rocket League", color: "#5865f2" },
  { name: "Cyberpunk", color: "#fcee09" },
  { name: "Minecraft", color: "#4ee88a" },
  { name: "Overwatch 2", color: "#ff9f43" },
  { name: "Rainbow Six", color: "#b794f6" },
];

function MarqueePill({ name, color }: { name: string; color: string }) {
  return (
    <span className="marquee-pill inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
      <span
        className="h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor]"
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
      <p className="mb-6 text-center text-xs font-bold tracking-[0.3em] text-reflux-muted uppercase">
        Works with the games you <span className="gradient-text-static">actually play</span>
      </p>
      <div className="marquee-viewport">
        <div className="marquee-track flex w-max gap-3.5 px-4">
          {track.map((item, i) => (
            <MarqueePill key={`${item.name}-${i}`} name={item.name} color={item.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
