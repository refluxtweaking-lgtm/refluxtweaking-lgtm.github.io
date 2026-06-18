"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import type { PlanName } from "@/lib/purchase-store";

type Purchase = {
  user: string;
  plan: PlanName;
  location: string;
  ago: string;
  isReal?: boolean;
};

type PoolEntry = {
  id: string;
  user: string;
  plan: PlanName;
  location: string;
};

const PURCHASE_POOL: PoolEntry[] = [
  { id: "anon-1", user: "Anonymous", plan: "Lifetime", location: "Texas, US" },
  { id: "anon-2", user: "Anonymous", plan: "Monthly", location: "London, UK" },
  { id: "anon-3", user: "Anonymous", plan: "Yearly", location: "Toronto, CA" },
  { id: "anon-4", user: "Anonymous", plan: "Lifetime", location: "Sydney, AU" },
  { id: "anon-5", user: "Anonymous", plan: "Monthly", location: "Berlin, DE" },
  { id: "anon-6", user: "Anonymous", plan: "Yearly", location: "Florida, US" },
  { id: "anon-7", user: "Anonymous", plan: "Lifetime", location: "Chicago, US" },
  { id: "anon-8", user: "Anonymous", plan: "Monthly", location: "Paris, FR" },
  { id: "anon-9", user: "Anonymous", plan: "Yearly", location: "Seoul, KR" },
  { id: "anon-10", user: "Anonymous", plan: "Lifetime", location: "Dallas, US" },
];

const POLL_MS = 10_000;
const ROTATE_MS = 5000;
const REAL_DISPLAY_MS = 12_000;
const SEEN_REAL_KEY = "reflux-seen-real-purchases";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

function randomAgo(): string {
  const roll = Math.random();
  if (roll < 0.25) {
    const mins = 3 + Math.floor(Math.random() * 55);
    return `${mins} mins ago`;
  }
  if (roll < 0.5) {
    const hours = 1 + Math.floor(Math.random() * 8);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  const days = 1 + Math.floor(Math.random() * 5);
  return days === 1 ? "1 day ago" : `${days} days ago`;
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

  const queueRef = useRef<PoolEntry[]>([]);
  const usedIdsRef = useRef<Set<string>>(new Set());
  const seenRealRef = useRef<Set<string>>(readSeenRealIds());
  const pollSinceRef = useRef(Date.now() - 24 * 60 * 60 * 1000);
  const rotateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const realTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pickNextFake = useCallback((): Purchase => {
    if (queueRef.current.length === 0) {
      const remaining = PURCHASE_POOL.filter((p) => !usedIdsRef.current.has(p.id));
      if (remaining.length === 0) {
        usedIdsRef.current.clear();
        queueRef.current = shuffle(PURCHASE_POOL);
      } else {
        queueRef.current = shuffle(remaining);
      }
    }

    const next = queueRef.current.shift()!;
    usedIdsRef.current.add(next.id);

    return {
      user: next.user,
      plan: next.plan,
      location: next.location,
      ago: randomAgo(),
      isReal: false,
    };
  }, []);

  const reveal = useCallback((purchase: Purchase) => {
    setShow(false);
    window.setTimeout(() => {
      setVisible(purchase);
      requestAnimationFrame(() => setShow(true));
    }, 280);
  }, []);

  const startRotation = useCallback(
    (delayMs = ROTATE_MS) => {
      if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
      rotateTimerRef.current = setInterval(() => reveal(pickNextFake()), delayMs);
    },
    [pickNextFake, reveal],
  );

  const showRealPurchase = useCallback(
    (purchase: { id: string; user: string; plan: PlanName; location: string; at: number }) => {
      if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
      if (realTimerRef.current) clearTimeout(realTimerRef.current);

      seenRealRef.current.add(purchase.id);
      writeSeenRealIds(seenRealRef.current);
      pollSinceRef.current = Math.max(pollSinceRef.current, purchase.at);

      reveal({
        user: purchase.user?.trim() || "Anonymous",
        plan: purchase.plan,
        location: purchase.location || "Unknown",
        ago: formatAgo(purchase.at),
        isReal: true,
      });

      realTimerRef.current = setTimeout(() => startRotation(), REAL_DISPLAY_MS);
    },
    [reveal, startRotation],
  );

  useEffect(() => {
    setMounted(true);
    queueRef.current = shuffle(PURCHASE_POOL);
    reveal(pickNextFake());
    startRotation();

    return () => {
      if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
      if (realTimerRef.current) clearTimeout(realTimerRef.current);
    };
  }, [pickNextFake, reveal, startRotation]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
        rotateTimerRef.current = null;
      } else {
        startRotation();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [startRotation]);

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
        // Fake rotation continues if API unavailable.
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
      <div
        className={`reflux-glow-box flex items-start gap-3 p-4 ${
          visible.isReal ? "reflux-glow-box-verified" : ""
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-reflux-accent/35 bg-reflux-accent/15 shadow-[0_0_16px_rgba(255,77,61,0.4)]">
          <Icon name="gamepad" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            <span className={visible.user === "Anonymous" ? "text-reflux-muted" : "text-reflux-accent"}>
              {visible.user}
            </span>{" "}
            bought <span className="text-reflux-green">{visible.plan}</span>
          </p>
          <p className="mt-0.5 text-xs text-reflux-text-soft">
            {visible.location} · <span className="reflux-metric">{visible.ago}</span>
          </p>
        </div>
        <span
          className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            visible.isReal
              ? "bg-reflux-accent/25 text-reflux-accent shadow-[0_0_12px_rgba(255,77,61,0.45)]"
              : "bg-white/8 text-reflux-muted"
          }`}
        >
          {visible.isReal ? "Verified" : "Recent"}
        </span>
      </div>
    </div>,
    document.body,
  );
}
