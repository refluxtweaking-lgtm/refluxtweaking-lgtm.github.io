import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReviewsPager } from "@/components/reviews/ReviewsPager";
import { ReviewRatingBadge } from "@/components/reviews/ReviewRatingBadge";
import { getReviewStats } from "@/data/reviews";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "Reviews – REFLUX TWEAKS",
  description: "What gamers say about REFLUX PRO — honest feedback from the community.",
};

export default function ReviewsPage() {
  const { averageRating, count } = getReviewStats();

  return (
    <SiteShell mainClassName="pt-8 pb-10">
      <div className="mb-8 flex justify-center">
        <ReviewRatingBadge className="review-rating-badge--page" />
      </div>

      <SectionHeader
        eyebrow="Community Reviews"
        title={
          <>
            Real players. <span className="gradient-text">Real results.</span>
          </>
        }
        subtitle={`${averageRating.toFixed(1)} average from ${count} reviews. Some names are hidden on purpose — use the arrows to read more.`}
      />

      <ReviewsPager />

      <p className="mt-12 text-center">
        <Link
          href="/"
          className="reflux-glow-interactive inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-reflux-accent hover:text-white"
        >
          <Icon name="arrowLeft" size={16} strokeWidth={2.2} glow={false} />
          Back to home
        </Link>
      </p>
    </SiteShell>
  );
}
