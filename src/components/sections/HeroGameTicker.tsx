"use client";

import { useEffect, useState } from "react";

const GAMES = ["Fortnite", "Valorant", "Apex Legends", "CS2", "Warzone", "Rocket League"];

export function HeroGameTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setVisible(false);
      timeout = setTimeout(() => {
        setIndex((current) => (current + 1) % GAMES.length);
        setVisible(true);
      }, 220);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <span
      className={`hero-game-ticker inline-block transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {GAMES[index]}
    </span>
  );
}
