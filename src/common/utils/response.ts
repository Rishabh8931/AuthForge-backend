import type { Response as ExpressResponse } from "express";

export class ApiResponse {
  /**
   * 200 OK
   *
   * Used when a request succeeds and returns a resource/result.
   */
  static ok<T>(res: ExpressResponse, data: T) {
    return res.status(200).json({
      success: true,
      data,
    });
  }

  /**
   * 201 Created
   *
   * Used when a new resource has been successfully created.
   */
  static created<T>(res: ExpressResponse, data: T) {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  /**
   * 202 Accepted
   *
   * Used when the request has been accepted for processing,
   * but processing has not necessarily completed yet.
   */
  static accepted<T>(res: ExpressResponse, data: T) {
    return res.status(202).json({
      success: true,
      data,
    });
  }

  /**
   * 204 No Content
   *
   * Used when the request succeeds but there is no response body.
   */
  static noContent(res: ExpressResponse) {
    return res.sendStatus(204);
  }

  /**
   * 200 OK with a message.
   *
   * Useful for operations where returning a resource is unnecessary
   * but a human-readable success message is useful.
   */
  static message(res: ExpressResponse, message: string) {
    return res.status(200).json({
      success: true,
      message,
    });
  }

  /**
   * 201 Created with a message.
   *
   * Useful when a resource has been created and an additional
   * success message is required.
   */
  static createdWithMessage<T>(res: ExpressResponse, data: T, message: string) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }
}
