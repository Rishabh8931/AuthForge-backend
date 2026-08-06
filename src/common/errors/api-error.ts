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
}
