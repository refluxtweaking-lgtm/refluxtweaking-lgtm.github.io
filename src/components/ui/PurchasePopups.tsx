"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { maskPurchaseIdentityIfNeeded } from "@/lib/mask-purchase-identity";
import type { PlanName } from "@/lib/purchase-store";

type Purchase = {
  user: string;
  plan: PlanName;
  location: string;
  ago: string;
};

const POLL_MS = 10_000;
const REAL_DISPLAY_MS = 12_000;
const SEEN_REAL_KEY = "reflux-seen-real-purchases";

function formatAgo(at: number): string {
  const diff = Math.max(0, Date.now() - at);
  const secs = Math.floor(diff / 1000);
  if (secs < 45) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

function readSeenRealIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(SEEN_REAL_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSeenRealIds(ids: Set<string>) {
  sessionStorage.setItem(SEEN_REAL_KEY, JSON.stringify([...ids]));
}

export function PurchasePopups() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState<Purchase | null>(null);
  const [show, setShow] = useState(false);

  const seenRealRef = useRef<Set<string>>(readSeenRealIds());
  const pollSinceRef = useRef(Date.now() - 24 * 60 * 60 * 1000);
  const realTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback((purchase: Purchase) => {
    setShow(false);
    window.setTimeout(() => {
      setVisible(purchase);
      requestAnimationFrame(() => setShow(true));
    }, 280);
  }, []);

  const showRealPurchase = useCallback(
    (purchase: { id: string; user: string; plan: PlanName; location: string; at: number }) => {
      if (realTimerRef.current) clearTimeout(realTimerRef.current);

      seenRealRef.current.add(purchase.id);
      writeSeenRealIds(seenRealRef.current);
      pollSinceRef.current = Math.max(pollSinceRef.current, purchase.at);

      reveal({
        user: maskPurchaseIdentityIfNeeded(purchase.user || ""),
        plan: purchase.plan,
        location: purchase.location || "Unknown",
        ago: formatAgo(purchase.at),
      });

      realTimerRef.current = setTimeout(() => {
        setShow(false);
        window.setTimeout(() => setVisible(null), 300);
      }, REAL_DISPLAY_MS);
    },
    [reveal],
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      if (realTimerRef.current) clearTimeout(realTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const poll = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(`/api/purchases/recent?since=${pollSinceRef.current}`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as {
          purchases?: Array<{
            id: string;
            user: string;
            plan: PlanName;
            location: string;
            at: number;
          }>;
        };

        const fresh = (data.purchases ?? [])
          .filter((purchase) => !seenRealRef.current.has(purchase.id))
          .sort((a, b) => a.at - b.at);

        if (fresh.length === 0) return;
        showRealPurchase(fresh[fresh.length - 1]);
      } catch {
        // No popup when purchase feed is unavailable.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [showRealPurchase]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={`fixed bottom-5 left-4 z-[250] max-w-[min(300px,calc(100vw-2rem))] transition-all duration-500 sm:bottom-6 sm:left-6 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="reflux-glow-box reflux-glow-box-verified flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-reflux-accent/35 bg-reflux-accent/15 shadow-[0_0_16px_rgba(255,77,61,0.4)]">
          <Icon name="gamepad" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            <span className="text-reflux-accent">{visible.user}</span> bought REFLUX PRO{" "}
            <span className="text-reflux-green">{visible.plan}</span>
          </p>
          <p className="mt-0.5 text-xs text-reflux-text-soft">
            {visible.location} · <span className="reflux-metric">{visible.ago}</span>
          </p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-reflux-accent/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reflux-accent shadow-[0_0_12px_rgba(255,77,61,0.45)]">
          Verified
        </span>
      </div>
    </div>,
    document.body,
  );
}
