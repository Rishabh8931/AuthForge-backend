import { Router } from "express";

import { DeveloperController } from "./developer.controller.js";

const router: Router = Router();

/**
 * Developer Routes
 *
 * Routes are responsible only for mapping HTTP endpoints
 * to controller methods.
 */

// Register a new developer
router.post("/", DeveloperController.register);

// Get a developer by ID
router.get("/:id", DeveloperController.getById);

export default router;
