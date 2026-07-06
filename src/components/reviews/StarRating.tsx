const STAR_PATH =
  "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.8 6.7 19.4l1.2-6L3.4 9.3l6-.7z";

function Star({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

type StarRatingProps = {
  rating: number;
  size?: number;
  showValue?: boolean;
  valueClassName?: string;
};

export function StarRating({
  rating,
  size = 16,
  showValue = true,
  valueClassName = "text-xs font-bold text-reflux-accent",
}: StarRatingProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span
              key={i}
              className="relative inline-block"
              style={{ width: size, height: size }}
            >
              <Star size={size} className="absolute inset-0 text-reflux-accent/20" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={size} className="text-reflux-accent" />
              </span>
            </span>
          );
        })}
      </span>
      {showValue ? (
        <span className={valueClassName}>{rating.toFixed(1)}</span>
      ) : null}
    </span>
  );
}
