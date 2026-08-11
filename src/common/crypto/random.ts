import { randomBytes, randomUUID } from "node:crypto";

/**
 * Generates cryptographically secure random bytes
 * and returns them as a hexadecimal string.
 */
export function generateRandomHex(byteLength = 32): string {
  return randomBytes(byteLength).toString("hex");
}

/**
 * Generates a cryptographically secure random value
 * encoded as base64url.
 *
 * Base64url is convenient for values that may be placed
 * in URLs, headers, or protocol parameters.
 */
export function generateRandomBase64Url(
  byteLength = 32,
): string {
  return randomBytes(byteLength).toString("base64url");
}

/**
 * Generates a UUID v4.
 *
 * Suitable for identifiers where a UUID is the required format.
 */
export function generateUUID(): string {
  return randomUUID();
}