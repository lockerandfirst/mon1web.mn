import { Router } from "express";
import { z } from "zod";

import { sendFail, sendOk, sendZodFail } from "../lib/api-response";
import { debug } from "../lib/debug";
import { syncProfile } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";
import { supabaseAdmin } from "../lib/supabase-admin";

const savedListingsRouter = Router();
const SCOPE = "saved-listings";

const singleSchema = z.object({
  listingId: z.string().trim().min(1),
});

const bulkSchema = z.object({
  listingIds: z.array(z.string().trim().min(1)).min(1).max(200),
  action: z.enum(["add", "remove", "toggle"]),
});

const listQuerySchema = z.object({
  idsOnly: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "true"),
});

async function resolveProfile(auth: {
  clerkUserId: string;
  email?: string | null;
  fullName?: string | null;
}) {
  return syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email ?? null,
    fullName: auth.fullName ?? null,
  });
}

/**
 * GET /api/saved-listings
 *  - default: `[{ listingId, listing }]` — хадгалсан зарын дэлгэрэнгүйтэй.
 *  - `?idsOnly=true`: зөвхөн string[] listing id-ууд (favorite heart state-д хэрэглэнэ).
 */
savedListingsRouter.get("/", requireAuth, async (req, res) => {
  const parsed = listQuerySchema.safeParse({ idsOnly: req.query.idsOnly });
  if (!parsed.success) {
    return sendZodFail(res, { scope: SCOPE, error: parsed.error });
  }
  const { idsOnly } = parsed.data;

  const profile = await resolveProfile(res.locals.auth);

  if (idsOnly) {
    const { data, error } = await supabaseAdmin
      .from("saved_listings")
      .select("listing_id")
      .eq("user_profile_id", profile.id);
    if (error) {
      return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
    }
    const ids = (data ?? [])
      .map((row) => String(row.listing_id ?? ""))
      .filter((id) => id.length > 0);
    return sendOk(res, ids);
  }

  const { data, error } = await supabaseAdmin
    .from("saved_listings")
    .select("listing_id, listings(*)")
    .eq("user_profile_id", profile.id);
  if (error) {
    return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
  }

  const rows = (data ?? []).map((row) => {
    const r = row as unknown as {
      listing_id: string;
      listings?: Record<string, unknown> | null;
    };
    return { listingId: r.listing_id, listings: r.listings ?? null };
  });
  debug.log(SCOPE, "list ok", { count: rows.length });
  return sendOk(res, rows);
});

savedListingsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = singleSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendZodFail(res, { scope: SCOPE, error: parsed.error });
  }

  const profile = await resolveProfile(res.locals.auth);
  const { error } = await supabaseAdmin.from("saved_listings").upsert(
    { user_profile_id: profile.id, listing_id: parsed.data.listingId },
    { onConflict: "user_profile_id,listing_id" },
  );

  if (error) {
    return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
  }
  debug.log(SCOPE, "add ok", { listingId: parsed.data.listingId });
  return sendOk(res, { listingId: parsed.data.listingId }, { status: 201 });
});

savedListingsRouter.delete("/", requireAuth, async (req, res) => {
  const parsed = singleSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendZodFail(res, { scope: SCOPE, error: parsed.error });
  }

  const profile = await resolveProfile(res.locals.auth);
  const { error } = await supabaseAdmin
    .from("saved_listings")
    .delete()
    .eq("user_profile_id", profile.id)
    .eq("listing_id", parsed.data.listingId);

  if (error) {
    return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
  }
  debug.log(SCOPE, "remove ok", { listingId: parsed.data.listingId });
  return sendOk(res, { listingId: parsed.data.listingId });
});

/**
 * POST /api/saved-listings/bulk
 * `action` сонголтоор олон зарыг нэг дор хадгалах/хасах/toggle.
 * Хариу — шинэчилсний дараах бүх саяын listingIds-ыг буцаана.
 */
savedListingsRouter.post("/bulk", requireAuth, async (req, res) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendZodFail(res, { scope: SCOPE, error: parsed.error });
  }
  const { listingIds, action } = parsed.data;
  const uniqueIds = Array.from(new Set(listingIds));
  const profile = await resolveProfile(res.locals.auth);

  if (action === "add") {
    const rows = uniqueIds.map((id) => ({
      user_profile_id: profile.id,
      listing_id: id,
    }));
    const { error } = await supabaseAdmin
      .from("saved_listings")
      .upsert(rows, { onConflict: "user_profile_id,listing_id" });
    if (error) {
      return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
    }
  } else if (action === "remove") {
    const { error } = await supabaseAdmin
      .from("saved_listings")
      .delete()
      .eq("user_profile_id", profile.id)
      .in("listing_id", uniqueIds);
    if (error) {
      return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
    }
  } else {
    // toggle — байгаа бол хасна, байхгүй бол нэмнэ.
    const { data: existing, error: readErr } = await supabaseAdmin
      .from("saved_listings")
      .select("listing_id")
      .eq("user_profile_id", profile.id)
      .in("listing_id", uniqueIds);
    if (readErr) {
      return sendFail(res, { scope: SCOPE, status: 500, error: readErr.message });
    }
    const existingSet = new Set(
      (existing ?? []).map((row) => String(row.listing_id)),
    );
    const toAdd = uniqueIds.filter((id) => !existingSet.has(id));
    const toRemove = uniqueIds.filter((id) => existingSet.has(id));

    if (toAdd.length > 0) {
      const { error } = await supabaseAdmin.from("saved_listings").upsert(
        toAdd.map((id) => ({ user_profile_id: profile.id, listing_id: id })),
        { onConflict: "user_profile_id,listing_id" },
      );
      if (error) {
        return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
      }
    }
    if (toRemove.length > 0) {
      const { error } = await supabaseAdmin
        .from("saved_listings")
        .delete()
        .eq("user_profile_id", profile.id)
        .in("listing_id", toRemove);
      if (error) {
        return sendFail(res, { scope: SCOPE, status: 500, error: error.message });
      }
    }
  }

  const { data: fresh, error: freshErr } = await supabaseAdmin
    .from("saved_listings")
    .select("listing_id")
    .eq("user_profile_id", profile.id);
  if (freshErr) {
    return sendFail(res, { scope: SCOPE, status: 500, error: freshErr.message });
  }

  const ids = (fresh ?? [])
    .map((row) => String(row.listing_id))
    .filter((id) => id.length > 0);

  debug.log(SCOPE, "bulk ok", {
    action,
    requested: uniqueIds.length,
    total: ids.length,
  });
  return sendOk(res, { action, listingIds: ids });
});

export { savedListingsRouter };
