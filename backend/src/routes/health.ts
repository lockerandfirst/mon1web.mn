import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      service: "mon1-api",
      ts: new Date().toISOString(),
    },
  });
});
