import { GlowCard } from "@/components/ui/GlowCard";
import type { Review } from "@/data/reviews";
import { reviewAuthorInitial } from "@/data/reviews";
import { StarRating } from "@/components/reviews/StarRating";

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
