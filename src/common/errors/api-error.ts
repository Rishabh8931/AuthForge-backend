import type { ErrorCode } from "./error-codes.js";

interface ApiErrorOptions {
  statusCode: number;
  code: ErrorCode;
  message: string;
  cause?: unknown;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public override readonly cause?: unknown;

  constructor({ statusCode, code, message, cause }: ApiErrorOptions) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.cause = cause;

    Error.captureStackTrace(this, ApiError);
  }

  // ─────────────────────────────────────────────
  // 400 - Bad Request
  // ─────────────────────────────────────────────

  static badRequest(message = "Bad request.", code: ErrorCode, cause?: unknown): ApiError {
    return new ApiError({
      statusCode: 400,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 401 - Unauthorized
  // ─────────────────────────────────────────────

  static unauthorized(
    message = "Authentication is required.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 401,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 403 - Forbidden
  // ─────────────────────────────────────────────

  static forbidden(
    message = "You do not have permission to perform this action.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 403,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 404 - Not Found
  // ─────────────────────────────────────────────

  static notFound(message = "Resource not found.", code: ErrorCode, cause?: unknown): ApiError {
    return new ApiError({
      statusCode: 404,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 409 - Conflict
  // ─────────────────────────────────────────────

  static conflict(
    message = "The request conflicts with the current state of the resource.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 409,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 422 - Unprocessable Entity
  // ─────────────────────────────────────────────

  static unprocessableEntity(
    message = "The request could not be processed.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 422,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 429 - Too Many Requests
  // ─────────────────────────────────────────────

  static tooManyRequests(
    message = "Too many requests.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 429,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 500 - Internal Server Error
  // ─────────────────────────────────────────────

  static internal(
    message = "An unexpected error occurred.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 500,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 502 - Bad Gateway
  // ─────────────────────────────────────────────

  static badGateway(
    message = "An upstream service returned an invalid response.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 502,
      code,
      message,
      cause,
    });
  }

  // ─────────────────────────────────────────────
  // 503 - Service Unavailable
  // ─────────────────────────────────────────────

  static serviceUnavailable(
    message = "The service is temporarily unavailable.",
    code: ErrorCode,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      statusCode: 503,
      code,
      message,
      cause,
    });
  }
}
