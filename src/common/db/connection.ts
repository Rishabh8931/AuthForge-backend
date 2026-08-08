import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { env } from "@/common/config/env.js";

const sql = neon(env.DATABASE_URL);

export const db = drizzle({ client: sql });

// Test database connection
async function checkDatabaseConnection() {
  try {
    await sql`SELECT 1`;

    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed!");

    console.error(error);
  }
}

checkDatabaseConnection();
