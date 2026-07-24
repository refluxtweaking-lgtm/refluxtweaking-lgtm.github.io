/** Mask emails / keys for Discord — never post full secrets. */
export function maskEmail(email?: string | null): string {
  const raw = String(email || "").trim().toLowerCase();
  if (!raw || !raw.includes("@")) return "unknown";
  const [local, domain] = raw.split("@");
  const localMasked =
    local.length <= 2 ? `${local[0] || "*"}*` : `${local.slice(0, 2)}${"*".repeat(Math.min(8, local.length - 2))}`;
  const [host, ...rest] = domain.split(".");
  const hostMasked =
    host.length <= 2 ? `${host[0] || "*"}*` : `${host.slice(0, 2)}${"*".repeat(Math.min(4, host.length - 2))}`;
  return `${localMasked}@${hostMasked}${rest.length ? `.${rest.join(".")}` : ""}`;
}

export function maskLicenseKey(key?: string | null): string {
  const raw = String(key || "").trim();
  if (!raw) return "—";
  if (raw.length <= 8) return `${raw.slice(0, 2)}****`;
  return `${raw.slice(0, 4)}…${raw.slice(-4)}`;
}

export function shortHwid(hwid?: string | null): string {
  const raw = String(hwid || "").trim();
  if (!raw) return "—";
  if (raw.length <= 10) return raw;
  return `${raw.slice(0, 6)}…${raw.slice(-4)}`;
}

export function formatWhen(value?: number | string | null): string {
  if (value == null || value === "") return "—";
  const ms = typeof value === "number" ? value : Date.parse(String(value));
  if (!Number.isFinite(ms)) return String(value);
  return new Date(ms).toUTCString();
}
