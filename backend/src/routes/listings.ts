import { Router } from "express";
import rateLimit from "express-rate-limit";

import { sendFail, sendOk, sendZodFail, paginationMeta } from "../lib/api-response";
import { debug } from "../lib/debug";
import { buildListingInsertRow } from "../lib/listing-payload";
import {
  clearResponseCacheByPrefix,
  getCachedResponse,
  setCachedResponse,
} from "../lib/response-cache";
import { syncProfile } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";
import { supabaseAdmin } from "../lib/supabase-admin";
import { deleteListing, patchListing } from "./listings.patch";
import { attachAgentsToListingRows } from "../lib/listing-agent-batch";
import {
  applyListingsListFilters,
  listingsListCacheKey,
  orderListingsListQuery,
} from "../lib/listings-list-query";
import {
  listListingsQuerySchema,
  mapListingsQuerySchema,
  serviceTypeSchema,
} from "./listings.schemas";

const listingsRouter = Router();
const SCOPE = "listings";
const LISTINGS_CACHE_TTL_MS = 12_000;

const recordViewLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: "Үзэлт бүртгэх хүсэлт хэт олон байна. Түр хүлээнэ үү.",
    });
  },
});

/**
 * `submitted_by.phone`, `contact_phone` багана, `profiles.phone`-ийг API хариунд
 * нэг мөр `submitted_by.phone` болгон нэгтгэнэ (засах форм уншина).
 */
async function listingRowWithMergedProfilePhone(
  row: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const pid = row.submitted_by_profile_id;
  const raw = row.submitted_by;
  const base =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw) &&
    raw !== null
      ? { ...(raw as Record<string, unknown>) }
      : {};

  const fromJson =
    typeof base.phone === "string" ? base.phone.trim() : "";
  const fromCol =
    typeof row.contact_phone === "string"
      ? String(row.contact_phone).trim()
      : "";

  let profPhone = "";
  if (pid != null && String(pid).trim() !== "") {
    const { data: prof, error } = await supabaseAdmin
      .from("profiles")
      .select("phone")
      .eq("id", String(pid))
      .maybeSingle();

    if (error) {
      debug.warn(SCOPE, "profile phone merge skipped", { cause: error.message });
    } else if (prof?.phone != null) {
      profPhone = String(prof.phone).trim();
    }
  }

  const mergedPhone = fromJson || fromCol || profPhone;
  if (!mergedPhone) {
    return row;
  }

  if (fromJson === mergedPhone) {
    return row;
  }

  return {
    ...row,
    submitted_by: { ...base, phone: mergedPhone },
  };
}

/** Нийтийн зарын дэлгэрэнгүй — үзэлт +1 (auth шаардлагагүй), DB atom increment. */
listingsRouter.post("/:id/record-view", recordViewLimiter, async (req, res) => {
  const id = String(req.params.id ?? "").trim();
  if (!id) {
    return sendFail(res, { scope: SCOPE, status: 400, error: "ID буруу байна." });
  }

  const { data: next, error: rpcErr } = await supabaseAdmin.rpc(
    "increment_listing_view",
    { p_id: id },
  );

  if (rpcErr) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: rpcErr.message,
    });
  }

  if (next == null) {
    return sendFail(res, {
      scope: SCOPE,
      status: 404,
      error: "Зар олдсонгүй.",
    });
  }

  return sendOk(res, { viewCount: Number(next) });
});

listingsRouter.get("/", async (req, res) => {
  const parsed = listListingsQuerySchema.safeParse({
    status: req.query.status,
    page: req.query.page,
    limit: req.query.limit,
    featured: req.query.featured,
    agentId: req.query.agentId ?? req.query.agent_id,
    sort: req.query.sort,
    q: req.query.q,
    priceMin: req.query.priceMin ?? req.query.price_min,
    priceMax: req.query.priceMax ?? req.query.price_max,
    sqmMin: req.query.sqmMin ?? req.query.sqm_min,
    sqmMax: req.query.sqmMax ?? req.query.sqm_max,
    district: req.query.district,
    category: req.query.category,
    rentType: req.query.rentType ?? req.query.rent_type,
    rooms: req.query.rooms,
    bathrooms: req.query.bathrooms,
    paymentMethod: req.query.paymentMethod ?? req.query.payment_method,
  });

  if (!parsed.success) {
    return sendZodFail(res, {
      scope: SCOPE,
      error: parsed.error,
      message: "Шүүлтийн параметр буруу байна.",
    });
  }

  const filters = parsed.data;
  const { status = "published", page, limit, featured, agentId, sort } =
    filters;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const cacheKey = listingsListCacheKey(filters);
  const cached = getCachedResponse<{
    data: Record<string, unknown>[];
    total: number;
  }>(cacheKey);
  if (cached) {
    return sendOk(res, cached.data, {
      meta: paginationMeta(page, limit, cached.total),
    });
  }

  let query = supabaseAdmin
    .from("listings")
    .select("*", { count: "exact" })
    .eq("workflow_status", status);

  if (featured !== undefined) query = query.eq("featured", featured);
  if (agentId) query = query.eq("agent_id", agentId);

  query = applyListingsListFilters(query, filters);
  query = orderListingsListQuery(query, sort);
  query = query.range(from, to);

  debug.log(SCOPE, "list", {
    status,
    page,
    limit,
    featured,
    agentId,
    sort,
    hasQ: Boolean(filters.q),
    category: filters.category,
  });

  const { data, error, count } = await query;
  if (error) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: error.message,
    });
  }

  const rows = data ?? [];
  const enrichedResult = await attachAgentsToListingRows(rows);
  if (!enrichedResult.ok) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: enrichedResult.error,
    });
  }
  setCachedResponse(
    cacheKey,
    {
      data: enrichedResult.data as Record<string, unknown>[],
      total: count ?? 0,
    },
    LISTINGS_CACHE_TTL_MS,
  );

  return sendOk(res, enrichedResult.data, {
    meta: paginationMeta(page, limit, count ?? 0),
  });
});

/** Газрын зураг: bbox доторх нийтлэгдсэн зарууд (cluster + viewport fetch). */
listingsRouter.get("/map", async (req, res) => {
  const parsed = mapListingsQuerySchema.safeParse({
    minLat: req.query.minLat ?? req.query.min_lat,
    maxLat: req.query.maxLat ?? req.query.max_lat,
    minLng: req.query.minLng ?? req.query.min_lng,
    maxLng: req.query.maxLng ?? req.query.max_lng,
    limit: req.query.limit,
  });

  if (!parsed.success) {
    return sendZodFail(res, {
      scope: SCOPE,
      error: parsed.error,
      message: "Газрын хүрээний параметр буруу байна.",
    });
  }

  const { minLat, maxLat, minLng, maxLng, limit } = parsed.data;
  const cacheKey = `listings:map:${minLat}:${maxLat}:${minLng}:${maxLng}:${limit}`;
  const cached = getCachedResponse<Record<string, unknown>[]>(cacheKey);
  if (cached) {
    return sendOk(res, cached);
  }

  debug.log(SCOPE, "map bbox", { minLat, maxLat, minLng, maxLng, limit });

  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("workflow_status", "published")
    .gte("latitude", minLat)
    .lte("latitude", maxLat)
    .gte("longitude", minLng)
    .lte("longitude", maxLng)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: error.message,
    });
  }

  const rows = data ?? [];
  const enrichedResult = await attachAgentsToListingRows(rows);
  if (!enrichedResult.ok) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: enrichedResult.error,
    });
  }
  setCachedResponse(
    cacheKey,
    enrichedResult.data as Record<string, unknown>[],
    LISTINGS_CACHE_TTL_MS,
  );

  return sendOk(res, enrichedResult.data);
});

listingsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const withAgent = await supabaseAdmin
    .from("listings")
    .select(
      `
      *,
      listing_agent:agents!listings_agent_id_fkey (
        id, name, phone, email, avatar, company,
        rating, review_count, listings_count, verified, bio
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (withAgent.error) {
    const { data: row, error: plainErr } = await supabaseAdmin
      .from("listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (plainErr || !row) {
      return sendFail(res, {
        scope: SCOPE,
        status: 404,
        error: "Listing олдсонгүй.",
        cause: plainErr?.message,
      });
    }

    let listing_agent: Record<string, unknown> | null = null;
    if (row.agent_id) {
      const { data: ag } = await supabaseAdmin
        .from("agents")
        .select(
          "id, name, phone, email, avatar, company, rating, review_count, listings_count, verified, bio",
        )
        .eq("id", row.agent_id)
        .maybeSingle();
      listing_agent = ag ?? null;
    }

    const merged = await listingRowWithMergedProfilePhone(
      row as Record<string, unknown>,
    );
    return sendOk(res, { ...merged, listing_agent });
  }

  if (!withAgent.data) {
    return sendFail(res, {
      scope: SCOPE,
      status: 404,
      error: "Listing олдсонгүй.",
    });
  }

  const merged = await listingRowWithMergedProfilePhone(
    withAgent.data as Record<string, unknown>,
  );
  return sendOk(res, merged);
});

listingsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const auth = res.locals.auth;
    const parsed = serviceTypeSchema.safeParse({
      serviceType: payload.serviceType ?? "self",
    });
    if (!parsed.success) {
      return sendZodFail(res, {
        scope: SCOPE,
        error: parsed.error,
        message: "sale type буруу байна.",
      });
    }

    const submittedBy = payload.submittedBy as Record<string, unknown> | undefined;
    const formPhone =
      typeof submittedBy?.phone === "string" ? submittedBy.phone.trim() : "";
    const profile = await syncProfile({
      clerkUserId: auth.clerkUserId,
      email: auth.email ?? null,
      fullName: auth.fullName ?? null,
      phone: formPhone.length >= 6 ? formPhone : undefined,
    });
    const isAgentSale = parsed.data.serviceType === "agent";
    const row = buildListingInsertRow(payload, {
      profileId: profile.id,
      isAgentSale,
    });

    const { data, error } = await supabaseAdmin
      .from("listings")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      return sendFail(res, {
        scope: SCOPE,
        status: 500,
        error: error.message,
      });
    }

    if (isAgentSale) {
      const { error: searchingError } = await supabaseAdmin
        .from("searching_agent")
        .insert({ property_id: data.id, user_id: profile.id });

      if (searchingError) {
        return sendFail(res, {
          scope: SCOPE,
          status: 500,
          error: searchingError.message,
        });
      }
    }
    clearResponseCacheByPrefix("listings:list:");
    clearResponseCacheByPrefix("listings:map:");

    debug.log(SCOPE, "create ok", { id: data.id, isAgentSale });
    return sendOk(res, data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Зар үүсгэхэд алдаа гарлаа.";
    debug.warn(SCOPE, "POST / create exception", { message });
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: message,
    });
  }
});

/** PATCH / DELETE handler-ууд `./listings.patch.ts`-д задалсан. */
listingsRouter.patch("/:id", requireAuth, patchListing);
listingsRouter.delete("/:id", requireAuth, deleteListing);

export { listingsRouter };
