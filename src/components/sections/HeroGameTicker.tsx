"use client";

import { useEffect, useState } from "react";

const GAMES = ["Fortnite", "Valorant", "Apex Legends", "CS2", "Warzone", "Rocket League"];

export function HeroGameTicker() {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setFlip(true);
      timeout = setTimeout(() => {
        setIndex((current) => (current + 1) % GAMES.length);
        setFlip(false);
      }, 280);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <span className="hero-game-ticker-wrap" aria-live="polite">
      <span className={`hero-game-ticker ${flip ? "hero-game-ticker--flip" : ""}`}>{GAMES[index]}</span>
    </span>
  );
}
