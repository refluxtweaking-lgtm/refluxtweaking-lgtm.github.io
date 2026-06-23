"use client";

import { useMemo, useState } from "react";
import { FlowIn } from "@/components/ui/FlowIn";
import { Icon } from "@/components/ui/Icon";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { REVIEWS_PAGE_SIZE, reviews, type Review } from "@/data/reviews";

type ReviewsPagerProps = {
  items?: Review[];
  pageSize?: number;
};

export function ReviewsPager({ items = reviews, pageSize = REVIEWS_PAGE_SIZE }: ReviewsPagerProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  const visible = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goPrev = () => setPage((current) => Math.max(0, current - 1));
  const goNext = () => setPage((current) => Math.min(pageCount - 1, current + 1));

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((review, index) => (
          <FlowIn key={review.id} delay={index * 60}>
            <ReviewCard review={review} />
          </FlowIn>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            aria-label="Show previous reviews"
            className="reflux-glow-interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-reflux-accent/35 bg-reflux-accent/10 text-reflux-accent transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Icon name="arrowLeft" size={20} strokeWidth={2.2} glow={false} />
          </button>

          <span className="min-w-[8rem] text-center text-sm font-semibold text-reflux-muted">
            Page {page + 1} of {pageCount}
          </span>

          <button
            type="button"
            onClick={goNext}
            disabled={page >= pageCount - 1}
            aria-label="Show more reviews"
            className="reflux-glow-interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-reflux-accent/35 bg-reflux-accent/10 text-reflux-accent transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Icon name="arrowRight" size={20} strokeWidth={2.2} glow={false} />
          </button>
        </div>
      )}
    </div>
  );
}
