/** Normalize buyer/account emails for storage, RLS, and download checks. */
export function normalizeBuyerEmail(email: string): string {
  return email.trim().toLowerCase();
}
