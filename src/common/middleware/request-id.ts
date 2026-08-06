import crypto from "node:crypto";

import type { RequestHandler } from "express";

export const requestId: RequestHandler = (req, res, next) => {
  const id = crypto.randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-Id", id);

  next();
};
