import { eq, and, isNull } from "drizzle-orm";

import type { db } from "@/common/db/connection.js";
import { sessions } from "@/common/db/schema/index.js";

export class SessionRepository {
  constructor(
    private readonly database: typeof db,
  ) {}

  /**
   * Creates a new user session.
   *
   * The raw session token must never be stored.
   * Only its cryptographic hash should be persisted.
   */
  async create(data: {
    userId: string;
    sessionTokenHash: string;
    expiresAt: Date;
  }) {
    const [session] = await this.database
      .insert(sessions)
      .values({
        userId: data.userId,
        sessionTokenHash: data.sessionTokenHash,
        expiresAt: data.expiresAt,
      })
      .returning();

    return session;
  }

  /**
   * Finds a session using its hashed token.
   *
   * Only active sessions are returned.
   */
  async findActiveByTokenHash(
    sessionTokenHash: string,
  ) {
    const [session] = await this.database
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.sessionTokenHash, sessionTokenHash),
          isNull(sessions.revokedAt),
        ),
      )
      .limit(1);

    return session;
  }

  /**
   * Revokes a session.
   */
  async revokeById(id: string) {
    const [session] = await this.database
      .update(sessions)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(sessions.id, id))
      .returning();

    return session;
  }

  /**
   * Revokes all sessions belonging to a user.
   */
  async revokeAllByUserId(userId: string) {
    return this.database
      .update(sessions)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(sessions.userId, userId),
          isNull(sessions.revokedAt),
        ),
      )
      .returning();
  }

  /**
   * Removes expired sessions.
   *
   * This is useful for scheduled cleanup jobs.
   */

 
  
}
