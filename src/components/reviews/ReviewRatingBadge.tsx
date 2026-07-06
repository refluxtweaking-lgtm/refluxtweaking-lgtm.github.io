import Link from "next/link";
import { getReviewStats } from "@/data/reviews";
import { StarRating } from "@/components/reviews/StarRating";
import { Icon } from "@/components/ui/Icon";

type ReviewRatingBadgeProps = {
  className?: string;
};

export function ReviewRatingBadge({ className = "" }: ReviewRatingBadgeProps) {
  const { averageRating, count } = getReviewStats();

  return (
    <Link
      href="/reviews"
      className={`review-rating-badge reflux-glow-interactive group inline-flex items-center gap-2 ${className}`}
      aria-label={`${averageRating.toFixed(1)} out of 5 stars from ${count} reviews — read reviews`}
    >
      <StarRating
        rating={averageRating}
        size={14}
        valueClassName="text-sm font-bold text-reflux-accent reflux-metric"
      />
      <Icon
        name="arrowRight"
        size={14}
        strokeWidth={2.4}
        glow={false}
        className="review-rating-badge-arrow text-reflux-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white"
      />
    </Link>
  );
}
