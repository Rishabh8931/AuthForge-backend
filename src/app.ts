import express from "express";
import type {Application} from "express";

// Common middleware
import { requestId } from "@/common/middleware/request-id.js";
import { security } from "@/common/middleware/security.js";
import { errorHandler } from "@/common/errors/index.js";

const app  : Application = express();

/** Request ID middleware */
app.use(requestId);

/** Security middleware */
app.use(security);



app.use(errorHandler);

export default app;