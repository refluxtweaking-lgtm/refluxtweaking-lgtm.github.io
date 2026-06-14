"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const cleanupItems = [
  { label: "Temporary files", size: "4.2 GB", checked: true },
  { label: "DirectX Shader Cache", size: "2.8 GB", checked: true },
  { label: "Delivery Optimization Files", size: "1.1 GB", checked: true },
  { label: "Recycle Bin", size: "890 MB", checked: true },
  { label: "Windows Update Cleanup", size: "3.4 GB", checked: true },
  { label: "Thumbnail Cache", size: "245 MB", checked: false },
];

interface DiskCleanupMockProps {
  isActive: boolean;
}

export function DiskCleanupMock({ isActive }: DiskCleanupMockProps) {
  const [progress, setProgress] = useState(0);
  const [cleaning, setCleaning] = useState(false);
  const [freed, setFreed] = useState<string | null>(null);

  const totalSize = "12.4 GB";

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setCleaning(false);
      setFreed(null);
    }
  }, [isActive]);

  const handleClean = () => {
    if (cleaning) return;
    setCleaning(true);
    setFreed(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setCleaning(false);
          setFreed(totalSize);
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#3a3f4b] bg-[#1e1e1e] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 border-b border-[#3a3f4b] bg-[#2d2d30] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-sm font-medium text-[#cccccc]">Disk Cleanup — REFLUX</span>
      </div>

      <div className="p-4">
        <p className="mb-3 text-xs text-[#9aa4b2]">
          Drive <span className="font-semibold text-white">C:</span> ·{" "}
          <span className="text-reflux-accent">{totalSize}</span> recoverable
        </p>

        <div className="max-h-[120px] space-y-1 overflow-y-auto sm:max-h-[160px]">
          {cleanupItems.map((item) => (
            <label
              key={item.label}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-white/5"
            >
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="accent-reflux-accent"
                readOnly
              />
              <span className="flex-1 text-[#e8edf2]">{item.label}</span>
              <span className="text-xs text-reflux-muted">{item.size}</span>
            </label>
          ))}
        </div>

        {cleaning && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-reflux-muted">
              <span>Cleaning...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#2a2f38]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-reflux-accent to-reflux-green transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {freed && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-reflux-green/30 bg-reflux-green/10 px-3 py-2 text-center text-sm font-semibold text-reflux-green">
            <Icon name="check" size={16} strokeWidth={2.6} className="text-reflux-green" glow={false} />
            Freed {freed} — your PC is breathing again
          </div>
        )}

        <button
          type="button"
          onClick={handleClean}
          disabled={cleaning}
          className="mt-4 w-full rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#106ebe] disabled:opacity-60"
        >
          {cleaning ? "Running Cleanup..." : "OK — Clean with REFLUX"}
        </button>
      </div>
    </div>
  );
}
