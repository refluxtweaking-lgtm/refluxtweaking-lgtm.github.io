"use client";

import { useState } from "react";

interface GameImageProps {
  sources: string[];
  alt: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  fallbackGradient: string;
}

export function GameImage({
  sources,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  fallbackGradient,
}: GameImageProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(sources.length === 0);

  if (failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${fallbackGradient}`}
      >
        <div className="text-2xl font-black tracking-widest text-white/90">{fallbackTitle}</div>
        <div className="mt-1 text-xs font-semibold text-reflux-accent">{fallbackSubtitle}</div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[srcIndex]}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      onError={() => {
        if (srcIndex < sources.length - 1) {
          setSrcIndex((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
