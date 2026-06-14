"use client";

import Image from "next/image";
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
    <GlowCard centered className="w-full">
      <SlideHeading icon="gamepad" title="Game Scanner" />
      <p className="mb-6 max-w-lg text-center text-reflux-muted">
        Automatically detects installed games and applies per‑title performance profiles.
      </p>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.name}
            className="flex flex-col overflow-hidden rounded-2xl border border-reflux-border bg-[#0c0e12] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#1a1d24]">
              {game.sources ? (
                <GameImage
                  sources={game.sources}
                  alt={game.name}
                  fallbackTitle={game.fallbackTitle ?? game.name}
                  fallbackSubtitle={game.fallbackSubtitle ?? game.launcher}
                  fallbackGradient={game.fallbackGradient ?? "from-[#1a1d24] to-[#0c0e12]"}
                />
              ) : (
                <Image
                  src={game.image as string}
                  alt={game.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 280px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-transparent" />
              <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-reflux-accent backdrop-blur-sm">
                {game.launcher}
              </span>
              <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-reflux-green/20 px-2 py-0.5 text-[10px] font-bold text-reflux-green">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
                Detected
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-3 text-base font-semibold">{game.name}</div>
              <div className="mt-auto flex gap-2">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(241,91,80,0.4)] bg-[rgba(241,91,80,0.15)] px-3 py-2 text-xs font-semibold text-reflux-accent transition-all hover:bg-[rgba(241,91,80,0.35)] hover:text-white hover:shadow-[0_0_16px_rgba(241,91,80,0.5)]"
                >
                  <Icon name="bolt" size={14} /> Optimize
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#2A2F38] bg-[#1A1D24] px-3 py-2 text-xs font-semibold text-reflux-text transition-all hover:border-reflux-accent/40"
                >
                  <Icon name="globe" size={14} glow={false} className="text-reflux-muted" /> Network
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-reflux-muted">
        Works with all major launchers – Steam, Epic, Ubisoft, and more.
      </p>
    </GlowCard>
  );
}
