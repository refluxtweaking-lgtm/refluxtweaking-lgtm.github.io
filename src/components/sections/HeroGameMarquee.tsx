"use client";

const MARQUEE_GAMES = [
  { id: 730, name: "CS2" },
  { id: 1172470, name: "Apex Legends" },
  { id: 1091500, name: "Cyberpunk 2077" },
  { id: 1938090, name: "Call of Duty" },
  { id: 252490, name: "Rust" },
  { id: 1085660, name: "Destiny 2" },
  { id: 1245620, name: "Elden Ring" },
  { id: 2357570, name: "Overwatch 2" },
  { id: 578080, name: "PUBG" },
  { id: 359550, name: "Rainbow Six" },
  { id: 440, name: "Team Fortress 2" },
  { id: 271590, name: "GTA V" },
] as const;

function GameCapsule({ appId, name }: { appId: number; name: string }) {
  const src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`;

  return (
    <div className="hero-game-capsule group shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} loading="lazy" className="hero-game-capsule-img" />
      <span className="hero-game-capsule-label">{name}</span>
    </div>
  );
}

export function HeroGameMarquee() {
  const track = [...MARQUEE_GAMES, ...MARQUEE_GAMES];

  return (
    <div className="hero-game-marquee mt-10 md:mt-14" aria-hidden="true">
      <div className="hero-game-marquee-edge hero-game-marquee-edge--left" />
      <div className="hero-game-marquee-edge hero-game-marquee-edge--right" />
      <div className="marquee-viewport">
        <div className="marquee-track hero-game-marquee-track flex w-max gap-3 px-1">
          {track.map((game, i) => (
            <GameCapsule key={`${game.id}-${i}`} appId={game.id} name={game.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
