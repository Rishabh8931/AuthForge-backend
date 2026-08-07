import type { Response as ExpressResponse } from "express";

export class Response {
  static ok<T>(res: ExpressResponse, data: T) {
    return res.status(200).json({
      success: true,
      data,
    });
  }

  static created<T>(res: ExpressResponse, data: T) {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  static noContent(res: ExpressResponse) {
    return res.sendStatus(204);
  }
}
