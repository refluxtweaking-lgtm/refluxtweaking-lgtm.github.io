"use client";

import { useState } from "react";
import { REFLUX_PRO_DOWNLOAD } from "@/data/downloads";

export function ProDownloadButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const download = async () => {
    setLoading(true);
    setError(null);
    setDone(false);

    try {
      const response = await fetch(REFLUX_PRO_DOWNLOAD.href, { cache: "no-store" });
      if (!response.ok) {
        let message = "Download failed. Try again or use the link in your purchase email.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // Response may not be JSON.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = REFLUX_PRO_DOWNLOAD.filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={download}
        disabled={loading}
        className="reflux-glow-interactive mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-2.5 text-sm font-semibold text-white hover:text-white disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Preparing download…" : done ? "Download again" : `Download ${REFLUX_PRO_DOWNLOAD.label}`}
      </button>
      {error && (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}
      {done && !error && (
        <p className="mt-3 text-xs text-reflux-green">Download started. Run the installer, then paste your license key.</p>
      )}
    </div>
  );
}
