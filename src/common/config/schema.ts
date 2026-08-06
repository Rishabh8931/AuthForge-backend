import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),

  PORT: z.coerce.number().int().min(1).max(65535),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
