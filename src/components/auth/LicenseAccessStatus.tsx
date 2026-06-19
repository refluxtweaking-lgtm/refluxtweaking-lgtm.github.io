"use client";

import { useEffect, useMemo, useState } from "react";

interface LicenseAccessStatusProps {
  plan: string;
  activatedAt: string | null;
  accessExpiresAt: string | null;
}

function formatCountdown(ms: number) {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

export function LicenseAccessStatus({ plan, activatedAt, accessExpiresAt }: LicenseAccessStatusProps) {
  const planValue = plan.trim().toLowerCase();
  const isLifetime = planValue === "lifetime";
  const expiresMs = accessExpiresAt ? new Date(accessExpiresAt).getTime() : null;
  const activatedMs = activatedAt ? new Date(activatedAt).getTime() : null;

  const [now, setNow] = useState(() => Date.now());

  const needsTick = !isLifetime && !!expiresMs && expiresMs > Date.now();

  useEffect(() => {
    if (!needsTick) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [needsTick]);

  const remaining = useMemo(() => {
    if (isLifetime) return null;
    if (!expiresMs) return null;
    return Math.max(0, expiresMs - now);
  }, [expiresMs, isLifetime, now]);

  if (isLifetime) {
    return (
      <div className="reflux-glow-readable mt-3 rounded-xl px-3 py-2.5 text-xs text-reflux-text-soft">
        <span className="font-bold text-reflux-green">Lifetime access</span> — no countdown required.
      </div>
    );
  }

  if (!activatedMs || !expiresMs) {
    return (
      <div className="reflux-warning mt-3 rounded-xl px-3 py-2.5 text-xs">
        <p className="font-bold text-amber-400">Not activated yet</p>
        <p className="mt-1 text-amber-100/90">
          Sign in to REFLUX PRO with this account and paste your key once. Your countdown starts on activation day and stays synced with the website.
        </p>
      </div>
    );
  }

  if (remaining === null || remaining === 0) {
    return (
      <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
        Access expired. Renew your plan to keep using REFLUX PRO.
      </div>
    );
  }

  const isLastDay = remaining <= 86400 * 1000;

  return (
    <div
      className={`mt-3 rounded-xl px-3 py-2.5 text-xs ${
        isLastDay ? "reflux-warning" : "reflux-glow-readable"
      }`}
    >
      <p className={`font-bold ${isLastDay ? "text-amber-400" : "text-reflux-accent"}`}>
        {isLastDay ? "Last day of access" : "Access countdown"}
      </p>
      <p className={`reflux-metric mt-1 text-lg font-extrabold ${isLastDay ? "text-amber-200" : "text-white"}`}>
        {formatCountdown(remaining)}
      </p>
      <p className="mt-1 text-reflux-text-soft">
        Activated {new Date(activatedMs).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}
