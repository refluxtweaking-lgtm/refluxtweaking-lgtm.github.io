export const LICENSE_CLAIM_REASONS = [
  { id: "aim_trainer", label: "I won the Aim Trainer prize" },
  { id: "owners_friend", label: "I'm a friend of the owner" },
  { id: "gift", label: "Someone gifted me this key" },
  { id: "purchase", label: "I bought REFLUX PRO" },
  { id: "other", label: "Other" },
] as const;

export type LicenseClaimReason = (typeof LICENSE_CLAIM_REASONS)[number]["id"];

export function isClaimReason(value: string): value is LicenseClaimReason {
  return LICENSE_CLAIM_REASONS.some((r) => r.id === value);
}
