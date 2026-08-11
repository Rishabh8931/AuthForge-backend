import { db } from "@/common/db/index.js";

import { DeveloperRepository } from "./developer.repository.js";
import { DeveloperService } from "./developer.service.js";

/**
 * Developer module composition root.
 *
 * Responsible for constructing the dependency graph
 * of the Developer module.
 */

// Persistence layer
const developerRepository = new DeveloperRepository(db);

// Application layer
export const developerService = new DeveloperService(developerRepository);
