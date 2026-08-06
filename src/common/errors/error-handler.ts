import type { ErrorRequestHandler } from "express";

import { env } from "@/common/config/env.js";
import { logger } from "@/common/logger/logger.js";

import { ApiError } from "./api-error.js";
import { ErrorCode } from "./error-codes.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof ApiError) {
    logger.warn(
      {
        code: error.code,
        statusCode: error.statusCode,
        cause: error.cause,
      },
      error.message,
    );

    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(env.NODE_ENV === "development" && {
          stack: error.stack,
        }),
      },
    });

    return;
  }

  logger.error(error);

  res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      ...(env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
  });
};