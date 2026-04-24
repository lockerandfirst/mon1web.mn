import type { RequestHandler } from "express";

import { debug } from "../lib/debug";

/**
 * Хүсэлт бүрт method, path, status, duration-ыг нэг мөрөөр хэвлэнэ.
 */
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const line = `${req.method} ${req.originalUrl} -> ${res.statusCode} ${ms}ms`;
    if (res.statusCode >= 500) {
      debug.error("http", line);
    } else if (res.statusCode >= 400) {
      debug.warn("http", line);
    } else {
      debug.log("http", line);
    }
  });
  next();
};
