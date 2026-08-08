import { boolean, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";

export const users = pgTable(
  "users",
  {
    ...primaryKey(),

    email: text("email").notNull(),

    passwordHash: text("password_hash").notNull(),

    isActive: boolean("is_active").notNull().default(true),

    emailVerifiedAt: timestamp("email_verified_at", {
      withTimezone: true,
    }),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("uq_users_email").on(table.email),

    index("idx_users_is_active").on(table.isActive),
  ],
);
