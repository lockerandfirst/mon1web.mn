import { Router } from "express";
import { z } from "zod";

import { syncProfile } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";
import { supabaseAdmin } from "../lib/supabase-admin";

const savedListingsRouter = Router();
const payloadSchema = z.object({
  listingId: z.string().min(1),
});

savedListingsRouter.get("/", requireAuth, async (_req, res) => {
  const auth = res.locals.auth;
  const profile = await syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });

  const { data, error } = await supabaseAdmin
    .from("saved_listings")
    .select("listing_id")
    .eq("user_profile_id", profile.id);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({
    success: true,
    data: (data ?? []).map((item) => item.listing_id),
  });
});

savedListingsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "listingId буруу байна." });
  }

  const auth = res.locals.auth;
  const profile = await syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });

  const { error } = await supabaseAdmin.from("saved_listings").upsert(
    {
      user_profile_id: profile.id,
      listing_id: parsed.data.listingId,
    },
    { onConflict: "user_profile_id,listing_id" },
  );

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(201).json({ success: true });
});

savedListingsRouter.delete("/", requireAuth, async (req, res) => {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "listingId буруу байна." });
  }

  const auth = res.locals.auth;
  const profile = await syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });

  const { error } = await supabaseAdmin
    .from("saved_listings")
    .delete()
    .eq("user_profile_id", profile.id)
    .eq("listing_id", parsed.data.listingId);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({ success: true });
});

export { savedListingsRouter };
