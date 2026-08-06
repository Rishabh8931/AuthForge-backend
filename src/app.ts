import express from "express";
import type { Application } from "express";

// Common middleware
import { requestId } from "@/common/middleware/request-id.js";
import { security } from "@/common/middleware/security.js";
import { errorHandler } from "@/common/errors/index.js";
import { corsMiddleware } from "@/common/middleware/cors.js";
import { requestLogger } from "@/common/middleware/request-logger.js";
import { globalRateLimiter } from "./common/middleware/rate-limit.js";
import { notFound } from "./common/middleware/not-found.js";

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

export default app;
