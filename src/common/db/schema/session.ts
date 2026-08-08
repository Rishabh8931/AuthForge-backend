import {
  index,
  pgTable,
  timestamp,
  uuid,
  text
} from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { users } from "./user.js";

export const sessions = pgTable(
  "sessions",
  {
    ...primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    sessionTokenHash: text("session_token_hash").notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
    }),

    ...timestamps,
  },
  (table) => [
    index("idx_sessions_user_id").on(table.userId),
    index("idx_sessions_expires_at").on(table.expiresAt),
  ],
);