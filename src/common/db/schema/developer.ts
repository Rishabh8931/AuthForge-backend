import { boolean, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { primaryKey, timestamps } from "./helper.js";

export const developers = pgTable(
  "developers",
  {
    ...primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),

    email: text("email").notNull(),

    passwordHash: text("password_hash").notNull(),

    isActive: boolean("is_active").notNull().default(true),

    emailVerifiedAt: timestamp("email_verified_at", {
      withTimezone: true,
    }),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("uq_developers_email").on(table.email),
    index("idx_developers_is_active").on(table.isActive),
  ],
);
