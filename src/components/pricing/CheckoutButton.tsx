"use client";

import { useState } from "react";
import type { ProPlanId } from "@/data/downloads";

interface CheckoutButtonProps {
  plan: ProPlanId;
}

export function CheckoutButton({ plan }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    window.location.href = `/api/checkout/${plan}`;
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-shimmer w-full rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-reflux-accent hover:from-[rgba(241,91,80,0.45)] hover:to-[rgba(241,91,80,0.25)] hover:shadow-[0_0_32px_rgba(241,91,80,0.5)] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-3">
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Redirecting to secure payment&hellip;
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          Complete Purchase
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </button>
  );
}
