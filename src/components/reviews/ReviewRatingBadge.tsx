import Link from "next/link";
import { getReviewStats } from "@/data/reviews";
import { StarRating } from "@/components/reviews/StarRating";

type ReviewRatingBadgeProps = {
  className?: string;
};

export function ReviewRatingBadge({ className = "" }: ReviewRatingBadgeProps) {
  const { averageRating, count } = getReviewStats();

  return (
    <Link
      href="/reviews"
      className={`review-rating-badge reflux-glow-interactive group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${averageRating.toFixed(1)} out of 5 stars from ${count} reviews — read reviews`}
    >
      <StarRating
        rating={averageRating}
        size={14}
        valueClassName="text-sm font-bold text-reflux-accent reflux-metric"
      />
      <span className="review-rating-badge-divider" aria-hidden="true" />
      <span className="text-[11px] font-semibold tracking-wide text-reflux-text-soft uppercase group-hover:text-white">
        {count} reviews
      </span>
    </Link>
  );
}
