"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const linkClass =
  "reflux-glow-interactive inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-reflux-muted duration-300 hover:text-white";

interface HeaderAuthProps {
  className?: string;
  onNavigate?: () => void;
}

export function HeaderAuth({ className = "", onNavigate }: HeaderAuthProps) {
  const configured = isSupabaseConfigured();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!configured) return;

    let active = true;
    let unsubscribe: (() => void) | undefined;

    // Import lazily so the browser client is only created when configured.
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data }) => {
        if (active) setLoggedIn(Boolean(data.user));
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setLoggedIn(Boolean(session?.user));
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [configured]);

  if (!configured) return null;

  if (loggedIn === null) {
    return (
      <span className={`${linkClass} ${className} pointer-events-none opacity-60`} aria-hidden="true">
        Log In
      </span>
    );
  }

  return (
    <Link
      href={loggedIn ? "/account" : "/login"}
      className={`${linkClass} ${className}`}
      onClick={onNavigate}
    >
      {loggedIn ? "Account" : "Log In"}
    </Link>
  );
}
