import type { RequestHandler } from "express";

import { logger } from "@/common/logger/logger.js";

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = performance.now();

  res.on("finish", () => {
    logger.info({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${(performance.now() - start).toFixed(2)}ms`,
    });
  });

  next();
};
