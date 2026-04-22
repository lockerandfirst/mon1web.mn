import { Router } from "express";
import { createClerkClient } from "@clerk/backend";

import { env } from "../config/env";
import { ensureAgentRowForAuth } from "../lib/agent-sync";
import { upsertProfileFromClerkUser } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";

const profileRouter = Router();

profileRouter.post("/sync", requireAuth, async (_req, res) => {
  const auth = res.locals.auth;
  if (!auth?.clerkUserId) {
    return res.status(401).json({
      success: false,
      error: "Нэвтрэлт шаардлагатай.",
    });
  }

  try {
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
    const user = await clerk.users.getUser(auth.clerkUserId);
    const row = await upsertProfileFromClerkUser(auth.clerkUserId, user);
    const role = (user.publicMetadata as Record<string, unknown> | null)?.role;
    if (role === "agent") {
      await ensureAgentRowForAuth(auth, user);
    }
    return res.json({ success: true, data: row });
  } catch (e) {
    console.log("[profile/sync] failed", {
      clerkUserId: auth.clerkUserId,
      error: e instanceof Error ? e.message : "unknown",
    });
    return res.status(500).json({
      success: false,
      error:
        e instanceof Error ? e.message : "Профайл шинэчлэхэд алдаа гарлаа.",
    });
  }
});

export { profileRouter };
