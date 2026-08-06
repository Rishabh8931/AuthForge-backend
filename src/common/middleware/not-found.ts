import type { RequestHandler } from "express";

import { ApiError, ErrorCode } from "@/common/errors/index.js";

// Handles unmatched routes
export const notFound: RequestHandler = (_req, _res, next) => {
  next(
    new ApiError({
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
      message: "The requested resource was not found.",
    }),
  );
};
