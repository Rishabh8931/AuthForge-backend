import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clients } from "./client.js";

export const clientScopes = pgTable(
  "client_scopes",
  {
    ...primaryKey(),

    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    scope: text("scope").notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("uq_client_scopes_client_scope").on(table.clientId, table.scope),

    index("idx_client_scopes_client_id").on(table.clientId),
  ],
);
