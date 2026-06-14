"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { GameImage } from "@/components/games/GameImage";
import { Icon } from "@/components/ui/Icon";
import { SlideHeading } from "./SlideHeading";
import type { SlideProps } from "./types";

type Game = {
  name: string;
  launcher: string;
  sources?: string[];
  image?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackGradient?: string;
};

const games: Game[] = [
  {
    name: "Counter-Strike 2",
    launcher: "Steam",
    sources: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg",
    ],
    fallbackTitle: "CS2",
    fallbackSubtitle: "Counter-Strike 2",
    fallbackGradient: "from-[#241803] via-[#4a3209] to-[#0f0a04]",
  },
  {
    name: "Cyberpunk 2077",
    launcher: "Steam",
    image: "/games/cyberpunk.jpg",
  },
  {
    name: "Apex Legends",
    launcher: "Steam",
    image: "/games/apex.jpg",
  },
];

export function GameScannerSlide(_props: SlideProps) {
  return (
    <GlowCard centered hover={false} className="slide-tight w-full !p-3 sm:!p-5">
      <SlideHeading icon="gamepad" title="Game Scanner" />
      <p className="mb-2 hidden max-w-lg text-center text-sm text-reflux-muted sm:mb-3 sm:block">
        Automatically detects installed games and applies per‑title performance profiles.
      </p>

      <div className="-mx-0.5 flex gap-2 overflow-x-auto px-0.5 pb-0.5 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0">
        {games.map((game) => (
          <div
            key={game.name}
            className="flex w-[72%] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-reflux-border bg-[#0c0e12] sm:w-full sm:rounded-2xl"
          >
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#1a1d24] sm:aspect-video">
              {game.sources ? (
                <GameImage
                  sources={game.sources}
                  alt={game.name}
                  fallbackTitle={game.fallbackTitle ?? game.name}
                  fallbackSubtitle={game.fallbackSubtitle ?? game.launcher}
                  fallbackGradient={game.fallbackGradient ?? "from-[#1a1d24] to-[#0c0e12]"}
                />
              ) : (
                <img
                  src={game.image}
                  alt={game.name}
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-reflux-accent sm:top-2 sm:left-2 sm:px-2 sm:text-[10px]">
                {game.launcher}
              </span>
              <span className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded bg-reflux-green/20 px-1.5 py-0.5 text-[9px] font-bold text-reflux-green sm:top-2 sm:right-2 sm:px-2 sm:text-[10px]">
                <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-reflux-green" />
                Detected
              </span>
            </div>

            <div className="flex flex-col gap-2 p-2 sm:p-3">
              <div className="text-xs font-semibold sm:text-sm">{game.name}</div>
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[rgba(241,91,80,0.4)] bg-[rgba(241,91,80,0.15)] px-2 py-1.5 text-[10px] font-semibold text-reflux-accent sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
                >
                  <Icon name="bolt" size={12} /> Optimize
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#2A2F38] bg-[#1A1D24] px-2 py-1.5 text-[10px] font-semibold text-reflux-text sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
                >
                  <Icon name="globe" size={12} glow={false} className="text-reflux-muted" /> Network
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}
