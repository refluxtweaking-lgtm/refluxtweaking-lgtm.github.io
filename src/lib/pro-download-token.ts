import { createHmac, timingSafeEqual } from "crypto";

type TokenPayload = {
  email: string;
  exp: number;
};

function signingSecret(): string | null {
  return process.env.LICENSE_DOWNLOAD_SECRET?.trim() || null;
}

function encodePayload(payload: TokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded: string): TokenPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as TokenPayload;
    if (!parsed?.email || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Signed link for purchase emails — only valid for the buyer's email. */
export function createProDownloadToken(email: string, ttlMs = 90 * 24 * 60 * 60 * 1000): string | null {
  const secret = signingSecret();
  if (!secret) return null;

  const payload = encodePayload({
    email: email.trim().toLowerCase(),
    exp: Date.now() + ttlMs,
  });
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyProDownloadToken(token: string): { email: string } | null {
  const secret = signingSecret();
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
