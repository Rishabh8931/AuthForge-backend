import argon2 from "argon2";

/**
 * Hashes a plaintext password using Argon2id.
 *
 * The resulting hash contains the parameters and salt required
 * to verify the password later.
 */
export async function hashPassword(
  password: string,
): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

/**
 * Verifies a plaintext password against a previously generated
 * Argon2id password hash.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return argon2.verify(passwordHash, password);
}