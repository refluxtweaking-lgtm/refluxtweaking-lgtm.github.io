/**
 * Returns the Supabase project URL, normalized to its origin only.
 *
 * Supabase returns "Invalid path specified in request URL" if the configured
 * URL has a trailing slash or an accidental path (a very common copy/paste
 * mistake from the dashboard). Reducing to the origin makes auth resilient to
 * that. Returns "" when unset.
 */
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    // Not a valid absolute URL — strip trailing slashes as a best effort.
    return raw.replace(/\/+$/, "");
  }
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
