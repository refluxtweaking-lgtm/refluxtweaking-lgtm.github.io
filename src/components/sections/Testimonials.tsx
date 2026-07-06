import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FlowIn } from "@/components/ui/FlowIn";
import { Icon } from "@/components/ui/Icon";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewRatingBadge } from "@/components/reviews/ReviewRatingBadge";
import { reviews } from "@/data/reviews";

const HOME_REVIEW_COUNT = 6;

export function Testimonials() {
  const featured = reviews.slice(0, HOME_REVIEW_COUNT);

  return (
    <section className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <div className="mb-8 flex justify-center">
        <ReviewRatingBadge className="review-rating-badge--home" />
      </div>
      <SectionHeader
        eyebrow="Social Proof"
        title={
          <>
            Gamers <span className="gradient-text">feel the difference</span>
          </>
        }
        subtitle="Honest feedback from players — some names hidden with ***."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((review, index) => (
          <FlowIn key={review.id} delay={index * 80}>
            <ReviewCard review={review} />
          </FlowIn>
        ))}
      </div>
      <p className="mt-10 text-center">
        <Link
          href="/reviews"
          className="reflux-glow-interactive inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-reflux-accent hover:text-white"
        >
          See all reviews
          <Icon name="arrowRight" size={16} strokeWidth={2.2} glow={false} />
        </Link>
      </p>
    </section>
  );
}
