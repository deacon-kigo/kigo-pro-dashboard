import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const COOKIE_NAME = "tmt_verified_code";

function getSecret(): Buffer {
  const secret = process.env.CODE_ENCRYPTION_SECRET;
  if (!secret)
    throw new Error("CODE_ENCRYPTION_SECRET environment variable is not set");
  if (secret.length !== 64)
    throw new Error(
      "CODE_ENCRYPTION_SECRET must be a 64-character hex string (32 bytes)"
    );
  return Buffer.from(secret, "hex");
}

export function encryptCode(code: string, affiliateSlug: string): string {
  const secret = getSecret();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, secret, iv);
  const payload = JSON.stringify({
    code,
    affiliateSlug,
    timestamp: Date.now(),
  });
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("hex");
}

export function decryptCode(
  encryptedHex: string
): { code: string; affiliateSlug: string } | null {
  try {
    const secret = getSecret();
    const data = Buffer.from(encryptedHex, "hex");
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, secret, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    const payload = JSON.parse(decrypted.toString("utf8"));
    if (!payload.code || !payload.affiliateSlug) return null;
    return { code: payload.code, affiliateSlug: payload.affiliateSlug };
  } catch {
    return null;
  }
}

export function verifyCodeFromCookie(
  cookieValue: string | undefined,
  requestCode: string,
  requestSlug: string
): boolean {
  if (!cookieValue) return false;
  const decrypted = decryptCode(cookieValue);
  if (!decrypted) return false;
  return (
    decrypted.code === requestCode && decrypted.affiliateSlug === requestSlug
  );
}

export { COOKIE_NAME };
