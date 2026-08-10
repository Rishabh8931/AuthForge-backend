import { Router } from "express";

import { HealthController } from "./health.controller.js";

const healthRouter: Router = Router();

healthRouter.get("/", HealthController.getHealth);

export { healthRouter };
