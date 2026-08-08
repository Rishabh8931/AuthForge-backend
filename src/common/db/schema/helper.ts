import {
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Primary key
export function primaryKey() {
  return {
    id: uuid("id").primaryKey().defaultRandom(),
  };
}

// Audit timestamps
export const timestamps = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  deletedAt: timestamp("deleted_at", {
    withTimezone: true,
  }),
};