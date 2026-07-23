"use client";

import { useEffect, useState } from "react";

export function DiscordUsernameCard() {
  const [discordUsername, setDiscordUsername] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMessage, setOkMessage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/discord/link", { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; discordUsername?: string | null };
        if (!alive) return;
        if (data.discordUsername) {
          setDiscordUsername(data.discordUsername);
          setSaved(data.discordUsername);
        }
      } catch {
        // ignore load errors
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOkMessage(null);
    try {
      const res = await fetch("/api/discord/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordUsername }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        discordUsername?: string;
        message?: string;
      };
      if (!data.ok) {
        setError(data.error || "Could not save.");
        return;
      }
      setSaved(data.discordUsername || discordUsername);
      setDiscordUsername(data.discordUsername || discordUsername);
      setOkMessage(data.message || "Saved.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="reflux-glow-box mb-6 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white">Discord (PRO role)</h3>
      <p className="mt-2 text-sm text-reflux-text-soft">
        Add your Discord username so we can auto-assign your <strong className="text-white">REFLUX PRO</strong> role
        when you join the server.
      </p>
      <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
        <strong>Important:</strong> Use your exact Discord username and <strong>do not change it</strong> after saving.
        If you rename your Discord account, the bot may not recognize you and your PRO role might not assign.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-reflux-muted">Loading…</p>
      ) : (
        <form onSubmit={save} className="mt-4 flex flex-col gap-3">
          <label htmlFor="discordUsername" className="text-xs font-medium uppercase tracking-wider text-reflux-muted">
            Discord username
          </label>
          <input
            id="discordUsername"
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.target.value)}
            placeholder="yourname"
            autoComplete="off"
            required
            className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white placeholder:text-reflux-muted/60 focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
          />
          {saved && (
            <p className="text-xs text-reflux-muted">
              Linked as <span className="font-semibold text-white">@{saved}</span>
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
          )}
          {okMessage && (
            <p className="rounded-lg border border-reflux-green/30 bg-[rgba(93,222,134,0.1)] px-3 py-2 text-xs text-reflux-text">
              {okMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="reflux-glow-interactive inline-flex w-fit items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : saved ? "Update Discord username" : "Save Discord username"}
          </button>
        </form>
      )}
    </div>
  );
}
