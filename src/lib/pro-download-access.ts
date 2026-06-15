import { createAdminClient } from "@/lib/supabase/admin";

export async function emailHasActiveProLicense(email: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const normalized = email.trim().toLowerCase();
  const { data, error } = await admin
    .from("licenses")
    .select("id")
    .eq("email", normalized)
    .eq("status", "active")
    .limit(1);

  if (error) {
    console.error("[pro-download] License lookup failed:", error.message);
    return false;
  }

  return (data?.length ?? 0) > 0;
}
