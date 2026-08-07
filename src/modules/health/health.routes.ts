import { Router } from "express";

import { HealthController } from "./health.controller.js";

export const healthRouter: Router = Router();

healthRouter.get("/", HealthController.getHealth);
