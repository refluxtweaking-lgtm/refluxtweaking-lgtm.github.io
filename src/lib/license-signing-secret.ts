/** Shared HMAC secret for signed app/download tokens (server-only). */
export function getLicenseSigningSecret(): string | null {
  return (
    process.env.LICENSE_DOWNLOAD_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    null
  );
}
