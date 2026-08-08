import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clients } from "./client.js";
import { users } from "./user.js";
import { sessions } from "./session.js";

export const tokenTypeEnum = pgEnum("token_type", [
  "access",
  "refresh",
]);

export const tokens = pgTable(
  "tokens",
  {
    ...primaryKey(),

    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    tokenHash: text("token_hash").notNull(),

    tokenType: tokenTypeEnum("token_type").notNull(),

    scope: text("scope").notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
    }),

    rotatedFromId: uuid("rotated_from_id"),

    ...timestamps,
  },
  (table) => [
    index("idx_tokens_client_id").on(table.clientId),

    index("idx_tokens_user_id").on(table.userId),

    index("idx_tokens_session_id").on(table.sessionId),

    index("idx_tokens_token_hash").on(table.tokenHash),

    index("idx_tokens_expires_at").on(table.expiresAt),

    index("idx_tokens_rotated_from_id").on(table.rotatedFromId),
  ],
);