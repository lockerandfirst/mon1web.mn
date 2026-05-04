import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { env } from "./config/env";
import { debug } from "./lib/debug";
import { requestLogger } from "./middleware/request-logger";
import { agentsRouter } from "./routes/agents";
import { buyRequestsRouter } from "./routes/buy-requests";
import { healthRouter } from "./routes/health";
import { listingsRouter } from "./routes/listings";
import { propertyImagesRouter } from "./routes/property-images";
import { savedListingsRouter } from "./routes/saved-listings";
import { searchingAgentRouter } from "./routes/searching-agent";
import { agentSalingRouter } from "./routes/agent-saling";
import { profileRouter } from "./routes/profile";

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const corsOrigin =
  env.FRONTEND_ORIGIN ??
  (process.env.NODE_ENV === "production" ? false : true);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
/** «Зар нэмэх» зэрэгт `nearbyServices` + урт тайлбар 100kb-аас давж болно — default-оор HTML [object Object] алдаа гардаг. */
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ limit: "8mb", extended: true }));

const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: "Хэт олон хүсэлт. Хэдэн секундын дараа дахин оролдоно уу.",
    });
  },
});
app.use("/api", apiLimiter);

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      message: "Mon1 backend API ажиллаж байна.",
    },
  });
});

app.use("/api/health", healthRouter);
app.use("/api/profile", profileRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/properties", propertyImagesRouter);
app.use("/api/saved-listings", savedListingsRouter);
app.use("/api/searching-agent", searchingAgentRouter);
app.use("/api/agent-saling", agentSalingRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/buy-requests", buyRequestsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `${req.method} ${req.originalUrl} endpoint олдсонгүй.`,
  });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (res.headersSent) {
    return;
  }
  const statusFromErr =
    err &&
    typeof err === "object" &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : null;
  const status =
    statusFromErr != null && statusFromErr >= 400 && statusFromErr < 600
      ? statusFromErr
      : 500;
  const message =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : err &&
            typeof err === "object" &&
            "message" in err &&
            typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Серверийн алдаа.";
  debug.error("express", "unhandled error", {
    path: req.originalUrl,
    method: req.method,
    status,
    message,
  });
  res.status(status).json({
    success: false,
    error: message,
  });
});

app.listen(env.API_PORT, () => {
  debug.log("server", `Mon1 API started on http://localhost:${env.API_PORT}`);
});
