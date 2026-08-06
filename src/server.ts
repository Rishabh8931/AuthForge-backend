import "dotenv/config";
import http from "node:http";
import { env } from "@/common/config/index.js";
import { logger } from "@/common/logger/index.js";

import app from "./app.js";

const PORT = env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  logger.fatal(error, "Failed to start server");
  process.exit(1);
});
