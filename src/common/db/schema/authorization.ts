import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clients } from "./client.js";
import { users } from "./user.js";
import { sessions } from "./session.js";

export const authorizations = pgTable(
  "authorizations",
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

    codeHash: text("code_hash").notNull(),

    redirectUri: text("redirect_uri").notNull(),

    scope: text("scope").notNull(),

    codeChallenge: text("code_challenge").notNull(),

    codeChallengeMethod: text("code_challenge_method").notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    consumedAt: timestamp("consumed_at", {
      withTimezone: true,
    }),

    ...timestamps,
  },
  (table) => [
    index("idx_authorizations_client_id").on(table.clientId),

    index("idx_authorizations_user_id").on(table.userId),

    index("idx_authorizations_session_id").on(table.sessionId),

    index("idx_authorizations_expires_at").on(table.expiresAt),

    index("idx_authorizations_code_hash").on(table.codeHash),
  ],
);