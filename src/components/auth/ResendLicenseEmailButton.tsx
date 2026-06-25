"use client";

import { useState } from "react";

export function ResendLicenseEmailButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      const response = await fetch("/api/account/resend-license", { method: "POST" });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !data.success) {
        setError(true);
        setMessage(data.message || "Could not send email. Try again in a minute.");
        return;
      }
      setMessage(data.message || "License email sent.");
    } catch {
      setError(true);
      setMessage("Could not send email. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="reflux-glow-interactive inline-flex items-center justify-center rounded-xl border border-reflux-border/60 px-4 py-2.5 text-sm font-semibold text-reflux-text hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending…" : "Email my license key again"}
      </button>
      {message ? (
        <p className={`mt-2 text-xs ${error ? "text-red-300" : "text-reflux-green"}`}>{message}</p>
      ) : null}
    </div>
  );
}
