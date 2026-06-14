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
  { id: "anon-11", user: "Anonymous", plan: "Monthly", location: "Miami, US" },
  { id: "anon-12", user: "Anonymous", plan: "Yearly", location: "Denver, US" },
  { id: "anon-13", user: "Anonymous", plan: "Lifetime", location: "Stockholm, SE" },
  { id: "anon-14", user: "Anonymous", plan: "Monthly", location: "Phoenix, US" },
  { id: "user-1", user: "NovaFPS", plan: "Lifetime", location: "Atlanta, US" },
  { id: "user-2", user: "xKryptic", plan: "Monthly", location: "Vancouver, CA" },
  { id: "user-3", user: "LagSlayer99", plan: "Yearly", location: "Amsterdam, NL" },
  { id: "user-4", user: "ProGamer_J", plan: "Lifetime", location: "Portland, US" },
  { id: "user-5", user: "TweakGod", plan: "Monthly", location: "Boston, US" },
  { id: "user-6", user: "ZeroPing", plan: "Yearly", location: "Seattle, US" },
];

const POLL_MS = 12_000;
const ROTATE_MS = 4500;
const SEEN_REAL_KEY = "reflux-seen-real-purchases";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomAgo(): string {
  const roll = Math.random();

  if (roll < 0.18) {
    const mins = 18 + Math.floor(Math.random() * 43);
    return `${mins} min${mins === 1 ? "" : "s"} ago`;
  }
  if (roll < 0.34) {
    const hours = 1 + Math.floor(Math.random() * 10);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (roll < 0.58) {
    if (Math.random() < 0.35) return "a day ago";
    const days = 2 + Math.floor(Math.random() * 2);
    return `${days} days ago`;
  }
  if (roll < 0.82) {
    const days = 4 + Math.floor(Math.random() * 3);
    return `${days} days ago`;
  }

  return Math.random() < 0.5 ? "6 days ago" : "1 week ago";
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
  const pollSinceRef = useRef(Date.now() - 60_000);
  const rotateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    }, 300);
  }, []);

  const startRotation = useCallback(() => {
    if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
    rotateTimerRef.current = setInterval(() => reveal(pickNextFake()), ROTATE_MS);
  }, [pickNextFake, reveal]);

  useEffect(() => {
    setMounted(true);
    queueRef.current = shuffle(PURCHASE_POOL);
    reveal(pickNextFake());
    startRotation();

    return () => {
      if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
    };
  }, [pickNextFake, reveal, startRotation]);

  useEffect(() => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/purchases/recent?since=${pollSinceRef.current}`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as {
          purchases?: Array<{ id: string; user: string; plan: PlanName; location: string; at: number }>;
        };

        const fresh = (data.purchases ?? [])
          .filter((purchase) => !seenRealRef.current.has(purchase.id))
          .sort((a, b) => a.at - b.at);

        if (fresh.length === 0) return;

        const latest = fresh[fresh.length - 1];
        seenRealRef.current.add(latest.id);
        writeSeenRealIds(seenRealRef.current);
        pollSinceRef.current = Math.max(pollSinceRef.current, latest.at);

        if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
        reveal({
          user: "Anonymous",
          plan: latest.plan,
          location: latest.location,
          ago: randomAgo(),
          isReal: true,
        });
        startRotation();
      } catch {
        // Ignore polling errors — fake popups still run.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [reveal, startRotation]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={`fixed bottom-5 left-4 z-[250] max-w-[min(280px,calc(100vw-2rem))] transition-all duration-500 sm:bottom-6 sm:left-6 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-[rgba(241,91,80,0.4)] bg-[#0c0e12]/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(241,91,80,0.15)] backdrop-blur-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-reflux-accent/30 bg-reflux-accent/15">
          <Icon name="gamepad" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            <span className={visible.user === "Anonymous" ? "text-reflux-muted" : "text-reflux-accent"}>
              {visible.user}
            </span>{" "}
            just bought <span className="text-reflux-green">{visible.plan}</span>
          </p>
          <p className="mt-0.5 text-xs text-reflux-muted">
            {visible.location} · {visible.ago}
          </p>
        </div>
        <span
          className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            visible.isReal
              ? "bg-reflux-accent/25 text-reflux-accent"
              : "bg-reflux-green/20 text-reflux-green"
          }`}
        >
          {visible.isReal ? "NEW" : "LIVE"}
        </span>
      </div>
    </div>,
    document.body,
  );
}
