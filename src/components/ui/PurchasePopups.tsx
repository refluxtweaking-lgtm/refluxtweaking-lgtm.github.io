"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const purchases = [
  { user: "NovaFPS", plan: "Lifetime", location: "Texas, US", ago: "2m ago" },
  { user: "xKryptic", plan: "Monthly", location: "London, UK", ago: "4m ago" },
  { user: "LagSlayer99", plan: "Yearly", location: "Toronto, CA", ago: "6m ago" },
  { user: "ProGamer_J", plan: "Lifetime", location: "Sydney, AU", ago: "8m ago" },
  { user: "TweakGod", plan: "Monthly", location: "Berlin, DE", ago: "11m ago" },
  { user: "ZeroPing", plan: "Lifetime", location: "Florida, US", ago: "14m ago" },
];

interface PurchasePopupsProps {
  isActive: boolean;
}

export function PurchasePopups({ isActive }: PurchasePopupsProps) {
  const [visible, setVisible] = useState<typeof purchases[0] | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShow(false);
      return;
    }

    let index = 0;
    const showNext = () => {
      setVisible(purchases[index % purchases.length]);
      setShow(false);
      requestAnimationFrame(() => setShow(true));
      index++;
    };

    showNext();
    const interval = setInterval(showNext, 4500);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive || !visible) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-200 max-w-[280px] transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-[rgba(241,91,80,0.4)] bg-[#0c0e12]/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(241,91,80,0.15)] backdrop-blur-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-reflux-accent/30 bg-reflux-accent/15">
          <Icon name="gamepad" size={20} />
        </div>
        <div>
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
    </div>
  );
}
