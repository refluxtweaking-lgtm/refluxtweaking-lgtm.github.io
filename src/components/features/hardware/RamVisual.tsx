interface RamVisualProps {
  fillPercent: number;
  compact?: boolean;
}

export function RamVisual({ fillPercent, compact = false }: RamVisualProps) {
  const sticks = [
    { x: 30, chips: 8 },
    { x: 110, chips: 8 },
  ];

  return (
    <div className={`relative flex w-full items-center justify-center ${compact ? "mb-0 h-[72px]" : "mb-4 h-[130px]"}`}>
      <svg
        viewBox="0 0 200 120"
        className={`h-full drop-shadow-[0_0_14px_rgba(179,146,240,0.35)] ${compact ? "w-[120px]" : "w-[200px]"}`}
        aria-hidden="true"
      >
        {sticks.map((stick, stickIdx) => (
          <g key={stickIdx}>
            <rect
              x={stick.x}
              y="38"
              width="60"
              height="44"
              rx="4"
              fill="#1a1f28"
              stroke="#B392F0"
              strokeWidth="2"
            />
            {Array.from({ length: stick.chips }).map((_, chipIdx) => {
              const row = Math.floor(chipIdx / 4);
              const col = chipIdx % 4;
              const chipX = stick.x + 8 + col * 12;
              const chipY = 46 + row * 14;
              const globalIdx = stickIdx * stick.chips + chipIdx;
              const totalChips = sticks.length * stick.chips;
              const active = globalIdx < (fillPercent / 100) * totalChips;

              return (
                <rect
                  key={chipIdx}
                  x={chipX}
                  y={chipY}
                  width="9"
                  height="9"
                  rx="1"
                  fill={active ? "#B392F0" : "#1e2229"}
                  stroke="#B392F0"
                  strokeWidth="0.6"
                  opacity={active ? 0.85 : 0.4}
                  className={active ? "ram-chip-active" : ""}
                  style={{ animationDelay: `${chipIdx * 0.12}s` }}
                />
              );
            })}
            {[8, 20, 32, 44].map((offset) => (
              <line
                key={offset}
                x1={stick.x + offset}
                y1="82"
                x2={stick.x + offset}
                y2="96"
                stroke="#B392F0"
                strokeWidth="1.5"
              />
            ))}
          </g>
        ))}

        <rect x="88" y="52" width="24" height="16" rx="3" fill="#111318" stroke="#B392F0" strokeWidth="1" opacity="0.5" />
        <text x="100" y="63" textAnchor="middle" fill="#B392F0" fontSize="7" fontWeight="bold">
          DDR5
        </text>
      </svg>
      <span className="absolute top-0 right-2 rounded-full bg-reflux-purple/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-reflux-purple uppercase">
        Live
      </span>
    </div>
  );
}
