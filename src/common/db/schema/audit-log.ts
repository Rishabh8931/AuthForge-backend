import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { primaryKey } from "./helper.js";

export const auditLogs = pgTable(
  "audit_logs",
  {
    ...primaryKey(),

    actorType: text("actor_type").notNull(),

    actorId: uuid("actor_id"),

    action: text("action").notNull(),

    resourceType: text("resource_type"),

    resourceId: uuid("resource_id"),

    metadata: jsonb("metadata"),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_audit_logs_actor").on(table.actorType, table.actorId),

    index("idx_audit_logs_action").on(table.action),

    index("idx_audit_logs_resource").on(table.resourceType, table.resourceId),

    index("idx_audit_logs_created_at").on(table.createdAt),
  ],
);
