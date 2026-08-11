import { db } from "@/common/db/index.js";

import { SessionRepository } from "./session.repository.js";
import { SessionService } from "./session.service.js";

/**
 * Session module composition root.
 *
 * This is the place where concrete dependencies are created
 * and injected into the session application layer.
 */

// Persistence layer
const sessionRepository = new SessionRepository(db);

// Application layer
export const sessionService = new SessionService(
  sessionRepository,
);