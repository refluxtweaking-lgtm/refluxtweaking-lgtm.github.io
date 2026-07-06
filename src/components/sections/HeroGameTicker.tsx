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
      }, 220);
    }, 2000);

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <span className={`hero-game-ticker ${flip ? "hero-game-ticker--flip" : ""}`} aria-live="polite">
      {GAMES[index]}
    </span>
  );
}
