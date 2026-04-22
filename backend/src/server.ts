import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { agentsRouter } from "./routes/agents";
import { buyRequestsRouter } from "./routes/buy-requests";
import { healthRouter } from "./routes/health";
import { hhaRouter } from "./routes/hha";
import { listingsRouter } from "./routes/listings";
import { propertyImagesRouter } from "./routes/property-images";
import { savedListingsRouter } from "./routes/saved-listings";
import { searchingAgentRouter } from "./routes/searching-agent";
import { agentSalingRouter } from "./routes/agent-saling";
import { profileRouter } from "./routes/profile";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN ?? true,
    credentials: true,
  }),
);
app.use(express.json());

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
app.use("/api/hha", hhaRouter);
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

app.listen(env.API_PORT, () => {
  // Keep startup log short and explicit for local development.
  console.log(`Mon1 API started on http://localhost:${env.API_PORT}`);
});
