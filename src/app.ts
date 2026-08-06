import express from "express";
import type {Application} from "express";
import { errorHandler } from "@/common/errors/index.js";
import { requestId } from "@/common/middleware/request-id.js";

const app  : Application = express();

/** Request ID middleware */
app.use(requestId);







app.use(errorHandler);

export default app;