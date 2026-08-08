import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clients } from "./client.js";
import { users } from "./user.js";

export const consents = pgTable(
  "consents",
  {
    ...primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    scope: text("scope").notNull(),

    grantedAt: timestamp("granted_at", {
      withTimezone: true,
    }).notNull(),

    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
    }),

    ...timestamps,
  },
  (table) => [
    unique("uq_consents_user_client").on(table.userId, table.clientId),

    index("idx_consents_user_id").on(table.userId),

    index("idx_consents_client_id").on(table.clientId),
  ],
);
