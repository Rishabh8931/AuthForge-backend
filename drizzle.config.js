import { defineConfig } from "drizzle-kit";

import { env } from "./src/common/config/index.js";

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/common/db/schema/*.ts",

  out: "./drizzle/migrations",

  dbCredentials: {
    url: env.DATABASE_URL,
  },

  strict: true,

  verbose: true,
});