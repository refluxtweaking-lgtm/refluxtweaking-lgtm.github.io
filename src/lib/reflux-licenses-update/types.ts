export type LicenseAlertEvent =
  | "issued"
  | "activated"
  | "session"
  | "expired"
  | "transferred"
  | "test"
  | "deployed";

export type VersionChange = {
  from?: string | null;
  to: string;
  label?: string | null;
  downloadUrl?: string | null;
};

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
  /** Deployment / installer share fields */
  product?: string | null;
  version?: string | null;
  label?: string | null;
  downloadUrl?: string | null;
  recipients?: number | null;
  /** Prefer these for red release webhook cards */
  pro?: VersionChange | null;
  free?: VersionChange | null;
};
