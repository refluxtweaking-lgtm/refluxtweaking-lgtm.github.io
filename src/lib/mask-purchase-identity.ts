/** Mask buyer email/name for public purchase popups (e.g. re****@gm***.com). */
export function maskPurchaseIdentity(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Anonymous";

  const at = trimmed.indexOf("@");
  if (at > 0 && at < trimmed.length - 1) {
    return maskEmail(trimmed);
  }

  if (trimmed.length <= 1) return `${trimmed}*`;
  const visible = trimmed.slice(0, 2);
  const hidden = Math.max(3, trimmed.length - 2);
  return visible + "*".repeat(hidden);
}

function maskEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  const [local, domain] = normalized.split("@");
  if (!local || !domain) return maskPurchaseIdentity(normalized.replace("@", ""));

  const localVisible = Math.min(2, local.length);
  const localMasked =
    local.slice(0, localVisible) + "*".repeat(Math.max(3, local.length - localVisible));

  const lastDot = domain.lastIndexOf(".");
  const domainName = lastDot > 0 ? domain.slice(0, lastDot) : domain;
  const tld = lastDot > 0 ? domain.slice(lastDot) : "";

  const domainVisible = Math.min(2, domainName.length);
  const domainMasked =
    domainName.slice(0, domainVisible) +
    "*".repeat(Math.max(2, domainName.length - domainVisible)) +
    tld;

  return `${localMasked}@${domainMasked}`;
}

/** Safe for display — skips values that are already masked. */
export function maskPurchaseIdentityIfNeeded(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Anonymous";
  if (trimmed.includes("*")) return trimmed;
  return maskPurchaseIdentity(trimmed);
}
