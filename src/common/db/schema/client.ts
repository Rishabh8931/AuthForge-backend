import { boolean, index, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";
import { clientTypeEnum } from "./enums.js";

export const clients = pgTable(
  "clients",
  {
    ...primaryKey(),

    developerId: text("developer_id").notNull(),

    clientId: text("client_id").notNull(),

    clientName: text("client_name").notNull(),

    clientType: clientTypeEnum("client_type").notNull(),

    clientSecretHash: text("client_secret_hash"),

    isActive: boolean("is_active").notNull().default(true),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("uq_clients_client_id").on(table.clientId),
    index("idx_clients_developer_id").on(table.developerId),
  ],
);
