import { createHash } from "node:crypto";

/**
 * Creates a SHA-256 hash of the supplied value.
 *
 * This is useful when a protocol or persistence design
 * requires a deterministic hash of a value.
 */
export function sha256(value: string): string {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}