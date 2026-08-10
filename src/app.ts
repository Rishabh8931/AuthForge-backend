import express from "express";
import type { Application } from "express";
import "@/common/db/connection.js";

// Common middleware
import { errorHandler } from "@/common/errors/error-handler.js";
import {
  corsMiddleware,
  requestId,
  security,
  globalRateLimiter,
  requestLogger,
  notFound,
} from "@/common/middleware/index.js";
import { healthRouter } from "@/modules/health/index.js";

const app: Application = express();

/** Request ID middleware */
app.use(requestId);

/** Security middleware */
app.use(security);

/** CORS middleware */
app.use(corsMiddleware);

/** Request logger middleware */
app.use(requestLogger);

/** rate limiter middleware */
app.use(globalRateLimiter);

// register health router
app.use("/health", healthRouter);

/** Not found middleware */
app.use(notFound);

/** global error handler */
app.use(errorHandler);
export default app;
