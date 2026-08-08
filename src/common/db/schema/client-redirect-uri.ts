import {
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clients } from "./client.js";

export const clientRedirectUris = pgTable(
  "client_redirect_uris",
  {
    ...primaryKey(),

    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    redirectUri: text("redirect_uri").notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("uq_client_redirect_uris_client_uri").on(
      table.clientId,
      table.redirectUri,
    ),

    index("idx_client_redirect_uris_client_id").on(table.clientId),
  ],
);