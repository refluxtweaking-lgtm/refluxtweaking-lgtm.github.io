"use client";

import { useEffect, useState } from "react";

interface LiveAppIndicatorProps {
  isActive: boolean;
}

export function LiveAppIndicator({ isActive }: LiveAppIndicatorProps) {
  const [users, setUsers] = useState(2847);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setUsers((u) => u + Math.floor(Math.random() * 5) - 1);
    }, 3000);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="mb-4 flex w-full max-w-lg flex-wrap items-center justify-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-reflux-green/30 bg-reflux-green/10 px-4 py-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-reflux-green opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-reflux-green" />
        </span>
        <span className="text-sm font-semibold text-reflux-green">App Online</span>
      </div>
      <div className="rounded-full border border-reflux-border bg-reflux-card px-4 py-2 text-sm text-reflux-muted">
        <span className="font-bold text-white tabular-nums">{users.toLocaleString()}</span>{" "}
        gamers optimizing right now
      </div>
    </div>
  );
}
