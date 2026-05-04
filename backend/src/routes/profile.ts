import { Router } from "express";
import { createClerkClient } from "@clerk/backend";

import { env } from "../config/env";
import {
  getClerkPublicRoleString,
  isAgentClerkRole,
} from "../lib/clerk-user-sync-helpers";
import { upsertProfileFromClerkUser } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";

const profileRouter = Router();
const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

profileRouter.post("/sync", requireAuth, async (_req, res) => {
  const auth = res.locals.auth;
  if (!auth?.clerkUserId) {
    return res.status(401).json({
      success: false,
      error: "Нэвтрэлт шаардлагатай.",
    });
  }

  try {
    const user = await clerkClient.users.getUser(auth.clerkUserId);
    const row = await upsertProfileFromClerkUser(auth.clerkUserId, user, {
      auth,
    });
    const clerkPublicRole = getClerkPublicRoleString(user.publicMetadata);
    return res.json({
      success: true,
      data: row,
      meta: {
        skippedProfileSync: row == null && isAgentClerkRole(clerkPublicRole),
      },
    });
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
