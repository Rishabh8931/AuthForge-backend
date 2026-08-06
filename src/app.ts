import express from "express";
import type {Application} from "express";
import { errorHandler } from "@/common/errors/index.js";

const app  : Application = express();







app.use(errorHandler);

export default app;