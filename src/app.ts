import express from "express";
import type { Application } from "express";

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

/** Not found middleware */
app.use(notFound);

/** global error handler */
app.use(errorHandler);

// register health router
app.use("/health", healthRouter);

export default app;
