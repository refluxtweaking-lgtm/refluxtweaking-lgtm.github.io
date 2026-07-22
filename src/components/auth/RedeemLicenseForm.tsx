"use client";

import { useState } from "react";
import { LICENSE_CLAIM_REASONS } from "@/lib/license-claim-reasons";
import { REFLUX_PRO_DOWNLOAD } from "@/data/downloads";

type RedeemOk = {
  ok: true;
  plan: string;
  status: string;
  activated: boolean;
  accessExpiresAt: string | null;
  isLifetime: boolean;
  validNow: boolean;
  downloadToken: string | null;
  message: string;
};

function formatExpiry(iso: string | null, isLifetime: boolean, activated: boolean) {
  if (isLifetime) return "Lifetime — no expiry";
  if (!activated || !iso) return "Starts when you first activate in the PRO app";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RedeemLicenseForm() {
  const [licenseKey, setLicenseKey] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RedeemOk | null>(null);
  const [downloading, setDownloading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/license/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey, reason, note }),
      });
      const data = (await res.json()) as RedeemOk | { ok: false; error: string };
      if (!data.ok) {
        setError(data.error || "Could not verify that key.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!result?.downloadToken) {
      setError("Download link unavailable. Contact support with your key.");
      return;
    }
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch(`${REFLUX_PRO_DOWNLOAD.href}?token=${encodeURIComponent(result.downloadToken)}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        let message = "Download failed.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = REFLUX_PRO_DOWNLOAD.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-8 shadow-[0_0_60px_rgba(241,91,80,0.08)]">
      <h1 className="mb-1 text-center text-2xl font-bold tracking-tight text-white">Redeem license key</h1>
      <p className="mb-6 text-center text-sm text-reflux-muted">
        No account needed. Paste a valid PRO key, tell us how you got it, then download.
      </p>

      {!result ? (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="licenseKey" className="text-xs font-medium uppercase tracking-wider text-reflux-muted">
              License key
            </label>
            <input
              id="licenseKey"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              required
              autoComplete="off"
              placeholder="Paste your REFLUX PRO key"
              className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white placeholder:text-reflux-muted/60 focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reason" className="text-xs font-medium uppercase tracking-wider text-reflux-muted">
              How did you get this key?
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
            >
              <option value="" disabled>
                Select one…
              </option>
              {LICENSE_CLAIM_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {reason === "other" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="note" className="text-xs font-medium uppercase tracking-wider text-reflux-muted">
                Short note (optional)
              </label>
              <input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={280}
                placeholder="Optional details"
                className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white placeholder:text-reflux-muted/60 focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-shimmer mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:border-reflux-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking key…" : "Verify key"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-reflux-green/30 bg-[rgba(93,222,134,0.1)] px-4 py-3 text-sm text-reflux-text">
            {result.message}
          </div>
          <div className="rounded-xl border border-reflux-border/50 bg-[rgba(8,10,14,0.65)] px-4 py-3 text-sm text-reflux-text">
            <div className="flex justify-between gap-3 py-1">
              <span className="text-reflux-muted">Plan</span>
              <span className="font-medium text-white">{result.plan}</span>
            </div>
            <div className="flex justify-between gap-3 py-1">
              <span className="text-reflux-muted">Access ends</span>
              <span className="font-medium text-white">
                {formatExpiry(result.accessExpiresAt, result.isLifetime, result.activated)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={download}
            disabled={downloading || !result.downloadToken}
            className="reflux-glow-interactive inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {downloading ? "Preparing download…" : `Download ${REFLUX_PRO_DOWNLOAD.label}`}
          </button>

          <p className="text-center text-xs leading-relaxed text-reflux-muted">
            Install PRO, then paste the same license key in the app. Time / expiry follows this key automatically.
          </p>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="text-center text-sm font-medium text-reflux-muted hover:text-white"
          >
            Check another key
          </button>
        </div>
      )}
    </div>
  );
}
