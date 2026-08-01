"use client";

const MARQUEE_GAMES = [
  { id: 1172470, name: "Apex Legends" },
  { id: 730, name: "CS2" },
  { id: 1938090, name: "Call of Duty" },
  { id: 252490, name: "Rust" },
  { id: 359550, name: "Rainbow Six" },
  { id: 578080, name: "PUBG" },
  { id: 2357570, name: "Overwatch 2" },
  { id: 271590, name: "GTA V" },
  { id: 1245620, name: "Elden Ring" },
  { id: 1091500, name: "Cyberpunk 2077" },
  { id: 1085660, name: "Destiny 2" },
  { id: 440, name: "Team Fortress 2" },
] as const;

function GameCapsule({ appId, name }: { appId: number; name: string }) {
  const src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`;

  return (
    <div className="hero-game-capsule hero-game-capsule--compact group shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} loading="lazy" className="hero-game-capsule-img" />
      <span className="hero-game-capsule-label">{name}</span>
    </div>
  );
}

type HeroGameMarqueeProps = {
  prominent?: boolean;
};

export function HeroGameMarquee({ prominent = false }: HeroGameMarqueeProps) {
  const track = [...MARQUEE_GAMES, ...MARQUEE_GAMES];

  return (
    <div
      className={`hero-game-marquee ${prominent ? "hero-game-marquee--prominent" : ""}`}
      aria-label="Games optimized by REFLUX"
    >
      <div className="hero-game-marquee-header">
        <span className="hero-game-marquee-dot" aria-hidden="true" />
        <span>Tuned for your library</span>
      </div>
      <div className="hero-game-marquee-viewport">
        <div className="hero-game-marquee-edge hero-game-marquee-edge--left" aria-hidden="true" />
        <div className="hero-game-marquee-edge hero-game-marquee-edge--right" aria-hidden="true" />
        <div className="marquee-viewport">
          <div className="marquee-track hero-game-marquee-track flex w-max gap-2.5 px-1">
            {track.map((game, i) => (
              <GameCapsule key={`${game.id}-${i}`} appId={game.id} name={game.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
