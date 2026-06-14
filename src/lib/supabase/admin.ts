import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./config";

/**
 * Service-role Supabase client. Server-only — bypasses RLS.
 * Returns null when the required env vars are not configured so callers can
 * degrade gracefully (e.g. the webhook still returns 200).
 */
export function createAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
