import { createHmac, timingSafeEqual } from "crypto";
import { getLicenseSigningSecret } from "@/lib/license-signing-secret";

type AppTokenPayload = {
  typ: "app";
  email: string;
  exp: number;
};

function encodePayload(payload: AppTokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded: string): AppTokenPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AppTokenPayload;
    if (parsed?.typ !== "app" || !parsed?.email || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Short-lived token for REFLUX PRO desktop app ↔ website sync. */
export function createAppSyncToken(email: string, ttlMs = 7 * 24 * 60 * 60 * 1000): string | null {
  const secret = getLicenseSigningSecret();
  if (!secret) return null;

  const payload = encodePayload({
    typ: "app",
    email: email.trim().toLowerCase(),
    exp: Date.now() + ttlMs,
  });
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAppSyncToken(token: string): { email: string } | null {
  const secret = getLicenseSigningSecret();
  if (!secret) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const decoded = decodePayload(payload);
  if (!decoded || decoded.exp < Date.now()) return null;

  return { email: decoded.email };
}
