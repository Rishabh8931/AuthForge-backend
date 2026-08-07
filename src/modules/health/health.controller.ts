import type { RequestHandler } from "express";

import { HealthService } from "./health.service.js";

export class HealthController {
  static getHealth: RequestHandler = (_req, res) => {
    const health = HealthService.getHealth();

    res.status(200).json({
      success: true,
      data: health,
    });
  };
}