import type { Request, Response } from "express";

import { sendFail, sendOk, sendZodFail } from "../lib/api-response";
import { debug } from "../lib/debug";
import { buildListingUpdateRow } from "../lib/listing-payload";
import { syncProfile } from "../lib/profile-sync";
import { clearResponseCacheByPrefix } from "../lib/response-cache";
import { supabaseAdmin } from "../lib/supabase-admin";
import { updateListingSchema } from "./listings.schemas";

const SCOPE = "listings";

function normalizeListingIdParam(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

type AuthLocals = {
  clerkUserId: string;
  email?: string | null;
  fullName?: string | null;
};

async function resolveProfile(auth: AuthLocals) {
  return syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email ?? null,
    fullName: auth.fullName ?? null,
  });
}

async function hasAgentOwnership(args: {
  clerkUserId?: string;
  agentId?: string | null;
}): Promise<boolean> {
  if (!args.clerkUserId) return false;
  if (!args.agentId) return false;
  const { data } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("clerk_user_id", args.clerkUserId)
    .maybeSingle();
  if (!data?.id) return false;
  return data.id === args.agentId;
}

async function loadOwnershipContext(listingId: string, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("id, submitted_by_profile_id, agent_id")
    .eq("id", listingId)
    .maybeSingle();

  if (error) {
    sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: error.message,
      cause: error.code,
    });
    return null;
  }
  if (!data) {
    debug.warn(SCOPE, "listing id not found in DB", { listingId });
    sendFail(res, {
      scope: SCOPE,
      status: 404,
      error: "Зар олдсонгүй.",
    });
    return null;
  }
  return data;
}

async function prunePropertyImagesNotInListing(args: {
  listingId: string;
  allowedUrls: string[];
}) {
  const { listingId, allowedUrls } = args;
  const allowed = new Set(allowedUrls);

  const { data: rows, error } = await supabaseAdmin
    .from("property_images")
    .select("id, image_url")
    .eq("property_id", listingId);

  if (error) {
    debug.warn(SCOPE, "property_images list for prune failed", {
      message: error.message,
    });
    return;
  }

  const idsToRemove = (rows ?? [])
    .filter((row) => !allowed.has(row.image_url as string))
    .map((row) => row.id as string)
    .filter(Boolean);

  if (idsToRemove.length === 0) {
    return;
  }

  const { error: delErr } = await supabaseAdmin
    .from("property_images")
    .delete()
    .in("id", idsToRemove);

  if (delErr) {
    debug.warn(SCOPE, "property_images batch delete failed", {
      message: delErr.message,
      ids: idsToRemove.length,
    });
  }
}

async function assertEditable(args: {
  listingId: string;
  auth: AuthLocals;
  action: "edit" | "delete";
  res: Response;
}): Promise<null | { profileId: string }> {
  const current = await loadOwnershipContext(args.listingId, args.res);
  if (!current) return null;
  const profile = await resolveProfile(args.auth);

  const isOwner = current.submitted_by_profile_id === profile.id;
  const isAgentOwner = !isOwner
    ? await hasAgentOwnership({
        clerkUserId: args.auth.clerkUserId,
        agentId: current.agent_id as string | null,
      })
    : false;

  if (!isOwner && !isAgentOwner) {
    sendFail(args.res, {
      scope: SCOPE,
      status: 403,
      error:
        args.action === "delete"
          ? "Энэ зарыг устгах эрхгүй байна."
          : "Энэ зарыг засах эрхгүй байна.",
    });
    return null;
  }
  return { profileId: profile.id };
}

/**
 * PATCH /api/listings/:id — зарын бүх талбарыг partial update-лэнэ.
 *
 * Эрх: 1) зар оруулагч (`submitted_by_profile_id === profile.id`), эсвэл
 *       2) зарыг «Би заръя»-аар авсан агент эсвэл холбогдсон агент.
 */
export async function patchListing(req: Request, res: Response) {
  const listingId = normalizeListingIdParam(String(req.params.id ?? ""));
  if (!listingId) {
    return sendFail(res, { scope: SCOPE, status: 400, error: "ID буруу байна." });
  }

  const parsed = updateListingSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendZodFail(res, {
      scope: SCOPE,
      error: parsed.error,
      message: "Засах өгөгдөл буруу байна.",
    });
  }

  const auth = res.locals.auth as AuthLocals;
  const ok = await assertEditable({ listingId, auth, action: "edit", res });
  if (!ok) return;

  const { contactPhone, ...patchFields } = parsed.data;
  const updateRow = buildListingUpdateRow(patchFields);
  if (contactPhone !== undefined) {
    const { data: curRow, error: readSbErr } = await supabaseAdmin
      .from("listings")
      .select("submitted_by")
      .eq("id", listingId)
      .maybeSingle();
    if (readSbErr) {
      return sendFail(res, {
        scope: SCOPE,
        status: 500,
        error: readSbErr.message,
      });
    }
    const raw = curRow?.submitted_by;
    const base =
      raw &&
      typeof raw === "object" &&
      !Array.isArray(raw) &&
      raw !== null
        ? { ...(raw as Record<string, unknown>) }
        : {};
    const nextPhone = contactPhone.trim();
    updateRow.submitted_by = {
      ...base,
      ...(nextPhone.length > 0 ? { phone: nextPhone } : { phone: null }),
    };
    updateRow.contact_phone =
      nextPhone.length > 0 ? nextPhone : null;
  }

  if (Object.keys(updateRow).length === 0) {
    return sendFail(res, {
      scope: SCOPE,
      status: 400,
      error: "Засах талбар оруулаагүй байна.",
    });
  }
  updateRow.updated_at = new Date().toISOString();

  const { data: updated, error: upErr } = await supabaseAdmin
    .from("listings")
    .update(updateRow)
    .eq("id", listingId)
    .select("*")
    .single();

  if (upErr || !updated) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: upErr?.message ?? "Зар шинэчлэхэд алдаа гарлаа.",
    });
  }

  if (contactPhone !== undefined) {
    try {
      await syncProfile({
        clerkUserId: auth.clerkUserId,
        email: auth.email ?? null,
        fullName: auth.fullName ?? null,
        phone: contactPhone.trim().length > 0 ? contactPhone.trim() : null,
      });
    } catch (e) {
      debug.warn(SCOPE, "profile phone sync after patch failed", {
        message: e instanceof Error ? e.message : "unknown",
      });
    }
  }

  if (parsed.data.images !== undefined) {
    await prunePropertyImagesNotInListing({
      listingId,
      allowedUrls: parsed.data.images,
    });
  }
  clearResponseCacheByPrefix("listings:list:");
  clearResponseCacheByPrefix("listings:map:");

  debug.log(SCOPE, "patch ok", {
    id: listingId,
    fields: Object.keys(updateRow),
  });
  return sendOk(res, updated);
}

/**
 * DELETE /api/listings/:id — PATCH-тай ижил эзэмшлийн шалгалттай.
 * Холбогдох `searching_agent`, `agent_saling`, `saved_listings` мөрийг
 * cascade байдлаар арилгана.
 */
export async function deleteListing(req: Request, res: Response) {
  const listingId = normalizeListingIdParam(String(req.params.id ?? ""));
  if (!listingId) {
    return sendFail(res, { scope: SCOPE, status: 400, error: "ID буруу байна." });
  }

  const auth = res.locals.auth as AuthLocals;
  const ok = await assertEditable({ listingId, auth, action: "delete", res });
  if (!ok) return;

  const relatedTables: Array<{ table: string; column: string }> = [
    { table: "searching_agent", column: "property_id" },
    { table: "agent_saling", column: "listing_id" },
    { table: "saved_listings", column: "listing_id" },
  ];
  for (const { table, column } of relatedTables) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq(column, listingId);
    if (error) {
      return sendFail(res, {
        scope: SCOPE,
        status: 500,
        error: error.message,
      });
    }
  }

  const { error: delErr } = await supabaseAdmin
    .from("listings")
    .delete()
    .eq("id", listingId);

  if (delErr) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: delErr.message,
    });
  }
  clearResponseCacheByPrefix("listings:list:");
  clearResponseCacheByPrefix("listings:map:");

  debug.log(SCOPE, "delete ok", { id: listingId });
  return sendOk(res, { id: listingId });
}
