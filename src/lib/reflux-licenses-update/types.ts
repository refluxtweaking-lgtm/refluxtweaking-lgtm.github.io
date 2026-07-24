export type LicenseAlertEvent =
  | "issued"
  | "activated"
  | "session"
  | "expired"
  | "transferred";

export type LicenseAlertPayload = {
  event: LicenseAlertEvent;
  licenseKey?: string | null;
  email?: string | null;
  plan?: string | null;
  hwid?: string | null;
  accessExpiresAt?: number | string | null;
  activatedAt?: number | string | null;
  note?: string | null;
  source?: string | null;
};
