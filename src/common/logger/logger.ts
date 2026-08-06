import pino from "pino";

import { env } from "@/common/config/env.js";

const options: pino.LoggerOptions = {
  level: env.NODE_ENV === "development" ? "debug" : "info",
};

if (env.NODE_ENV === "development") {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  };
}

export const logger = pino(options);
