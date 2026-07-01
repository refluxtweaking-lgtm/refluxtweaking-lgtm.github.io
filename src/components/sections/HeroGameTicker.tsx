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
      }, 300);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <span className="hero-game-pill" aria-live="polite">
      <span className="hero-game-pill-glow" aria-hidden="true" />
      <span className="hero-game-pill-icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
          <path d="M4 3.5v9l8-4.5-8-4.5z" />
        </svg>
      </span>
      <span className={`hero-game-ticker ${flip ? "hero-game-ticker--flip" : ""}`}>{GAMES[index]}</span>
    </span>
  );
}
