"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";

type Purchase = {
  user: string;
  plan: "Lifetime" | "Yearly" | "Monthly";
  location: string;
};

const PURCHASE_POOL: Purchase[] = [
  { user: "NovaFPS", plan: "Lifetime", location: "Texas, US" },
  { user: "xKryptic", plan: "Monthly", location: "London, UK" },
  { user: "LagSlayer99", plan: "Yearly", location: "Toronto, CA" },
  { user: "ProGamer_J", plan: "Lifetime", location: "Sydney, AU" },
  { user: "TweakGod", plan: "Monthly", location: "Berlin, DE" },
  { user: "ZeroPing", plan: "Lifetime", location: "Florida, US" },
  { user: "ClutchVibe", plan: "Yearly", location: "Chicago, US" },
  { user: "AimbotZero", plan: "Monthly", location: "Paris, FR" },
  { user: "FrameChaser", plan: "Lifetime", location: "Seoul, KR" },
  { user: "PingWizard", plan: "Yearly", location: "Dallas, US" },
  { user: "TurboRyze", plan: "Monthly", location: "Miami, US" },
  { user: "GhostLatency", plan: "Lifetime", location: "Denver, US" },
  { user: "HexFPS", plan: "Yearly", location: "Stockholm, SE" },
  { user: "VoltCore", plan: "Monthly", location: "Phoenix, US" },
  { user: "NightOwlFPS", plan: "Lifetime", location: "Atlanta, US" },
  { user: "RawInput", plan: "Yearly", location: "Vancouver, CA" },
  { user: "ScopeKing", plan: "Monthly", location: "Amsterdam, NL" },
  { user: "DashFlick", plan: "Lifetime", location: "Portland, US" },
];

const AGO_OPTIONS = ["1m ago", "2m ago", "3m ago", "4m ago", "5m ago", "6m ago", "8m ago", "11m ago", "14m ago"];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface PurchasePopupsProps {
  isActive: boolean;
}

export function PurchasePopups({ isActive }: PurchasePopupsProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState<(Purchase & { ago: string }) | null>(null);
  const [show, setShow] = useState(false);

  const queueRef = useRef<Purchase[]>([]);
  const usedNamesRef = useRef<Set<string>>(new Set());

  const pickNext = useCallback((): Purchase & { ago: string } => {
    if (queueRef.current.length === 0) {
      const remaining = PURCHASE_POOL.filter((p) => !usedNamesRef.current.has(p.user));
      if (remaining.length === 0) {
        usedNamesRef.current.clear();
        queueRef.current = shuffle(PURCHASE_POOL);
      } else {
        queueRef.current = shuffle(remaining);
      }
    }

    const next = queueRef.current.shift()!;
    usedNamesRef.current.add(next.user);
    const ago = AGO_OPTIONS[Math.floor(Math.random() * AGO_OPTIONS.length)];

    return { ...next, ago };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setShow(false);
      return;
    }

    queueRef.current = shuffle(
      PURCHASE_POOL.filter((p) => !usedNamesRef.current.has(p.user)),
    );

    const showNext = () => {
      setShow(false);
      setTimeout(() => {
        setVisible(pickNext());
        requestAnimationFrame(() => setShow(true));
      }, 300);
    };

    showNext();
    const interval = setInterval(showNext, 4500);
    return () => clearInterval(interval);
  }, [isActive, pickNext]);

  if (!mounted || !isActive || !visible) return null;

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
            <span className="text-reflux-accent">{visible.user}</span> just bought{" "}
            <span className="text-reflux-green">{visible.plan}</span>
          </p>
          <p className="mt-0.5 text-xs text-reflux-muted">
            {visible.location} · {visible.ago}
          </p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-reflux-green/20 px-2 py-0.5 text-[10px] font-bold text-reflux-green">
          LIVE
        </span>
      </div>
    </div>,
    document.body,
  );
}
