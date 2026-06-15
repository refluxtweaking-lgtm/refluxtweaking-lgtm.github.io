import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

/**
 * Claims a checkout session before license delivery.
 * Returns false when this session was already processed (webhook replay).
 */
export async function claimCheckoutSession(
  sessionId: string,
  email: string,
  plan: string,
): Promise<boolean> {
  const id = sessionId.trim();
  if (!id) return true;

  const admin = createAdminClient();
  if (!admin) return true;

  const { error } = await admin.from("processed_checkouts").insert({
    session_id: id,
    email: normalizeBuyerEmail(email),
    plan,
  });

  if (error?.code === "23505") return false;

  if (error) {
    console.error("[checkout-idempotency] Insert failed:", error.message);
    return true;
  }

  return true;
}
