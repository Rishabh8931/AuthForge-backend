import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clientGrantTypeEnum } from "./enums.js";
import { clients } from "./client.js";

export const clientGrantTypes = pgTable(
  "client_grant_types",
  {
    ...primaryKey(),

    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    grantType: clientGrantTypeEnum("grant_type").notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("uq_client_grant_types_client_grant").on(table.clientId, table.grantType),

    index("idx_client_grant_types_client_id").on(table.clientId),
  ],
);
