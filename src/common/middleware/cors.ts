import cors from "cors";

import { env } from "@/common/config/env.js";

// CORS configuration
export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization", "Accept"],

  exposedHeaders: ["X-Request-Id"],
});
