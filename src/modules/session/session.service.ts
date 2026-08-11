import { generateRandomBase64Url, sha256 } from "@/common/crypto/index.js";
import type { SessionRepository } from "./session.repository.js";

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Creates a new authenticated session for a user.
   *
   * The raw session token is generated here and returned to the caller.
   * Only the SHA-256 hash of the token is persisted in the database.
   */
  async createSession(userId: string, expiresAt: Date) {
    // Generate the secret token that will be given to the client.
    const sessionToken = generateRandomBase64Url(32);

    // Never store the raw session token in the database.
    const sessionTokenHash = sha256(sessionToken);

    const session = await this.sessionRepository.create({
      userId,
      sessionTokenHash,
      expiresAt,
    });

    return {
      session,
      sessionToken,
    };
  }

  /**
   * Retrieves an active session using the raw session token.
   *
   * The raw token is hashed before querying the database.
   */
  async getSessionByToken(sessionToken: string) {
    const sessionTokenHash = sha256(sessionToken);

    return this.sessionRepository.findActiveByTokenHash(sessionTokenHash);
  }

  /**
   * Revokes a single session.
   */
  async revokeSession(sessionId: string) {
    return this.sessionRepository.revokeById(sessionId);
  }

  /**
   * Revokes all active sessions belonging to a user.
   *
   * Useful for "sign out from all devices" functionality
   * and security-sensitive account operations.
   */
  async revokeAllUserSessions(userId: string) {
    return this.sessionRepository.revokeAllByUserId(userId);
  }
}
