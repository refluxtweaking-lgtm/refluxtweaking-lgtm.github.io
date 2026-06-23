import { GlowCard } from "@/components/ui/GlowCard";
import type { Review } from "@/data/reviews";
import { reviewAuthorInitial } from "@/data/reviews";

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

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-1">
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
      <span className="text-xs font-bold text-reflux-accent">{rating.toFixed(1)}</span>
    </span>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <GlowCard className="relative h-full overflow-hidden text-left">
      <span
        className="testimonial-quote-mark pointer-events-none absolute -top-2 left-4 select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <div className="relative mb-4 flex items-center justify-between pt-6">
        <StarRating rating={review.rating} />
        <span className="badge-pill badge-accent text-[10px]">{review.game}</span>
      </div>
      <p
        className={`relative mb-6 text-[#c8d0dc] ${
          review.tone === "professional" ? "leading-relaxed" : "text-sm font-medium"
        }`}
      >
        {review.quote}
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-reflux-border/50 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-reflux-accent to-[#c43d35] text-xs font-bold text-white">
          {reviewAuthorInitial(review.author)}
        </div>
        <span className="text-sm font-semibold text-reflux-muted">{review.author}</span>
      </div>
    </GlowCard>
  );
}
