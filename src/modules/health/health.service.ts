import type { HealthResponse } from "./health.types.js";

export class HealthService {
  static getHealth(): HealthResponse {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}