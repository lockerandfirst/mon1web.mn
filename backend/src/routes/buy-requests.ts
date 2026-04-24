import { Router } from "express";
import { z } from "zod";

import { resolveAgentIdForAuth } from "../lib/resolve-agent-for-clerk";
import { syncProfile } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";
import { requireAgentRole } from "../middleware/require-agent-role";
import { supabaseAdmin } from "../lib/supabase-admin";

const buyRequestsRouter = Router();

/** Нээлттэй жагсаалт болон `/mine` хоёуланд ижил nested select. */
const BUY_REQUESTS_SELECT_WITH_RECS = `
  *,
  buy_request_recommendations (
    id,
    listing_id,
    agent_id,
    recommended_at,
    listings ( title ),
    agents ( id, name, phone, email, avatar )
  )
`;

const recommendationSingleSchema = z.object({
  listingId: z.string().min(1),
});

const recommendationBulkSchema = z.object({
  listingIds: z.array(z.string().min(1)).min(1).max(40),
});

function parseRecommendationListingIds(
  body: unknown,
): { ok: true; ids: string[] } | { ok: false; error: string } {
  const raw = (body ?? {}) as Record<string, unknown>;
  if (Array.isArray(raw.listingIds) && raw.listingIds.length > 0) {
    const parsed = recommendationBulkSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: "listingIds буруу байна (1–40)." };
    }
    return { ok: true, ids: [...new Set(parsed.data.listingIds)] };
  }
  const parsed = recommendationSingleSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "listingId эсвэл listingIds заавал." };
  }
  return { ok: true, ids: [parsed.data.listingId] };
}

/** Нэвтэрсэн хэрэглэгчийн оруулсан «авна» хүсэлтүүд (агентын санал багтсан nested). */
buyRequestsRouter.get("/mine", requireAuth, async (req, res) => {
  const auth = res.locals.auth;

  const profile = await syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });

  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 30)));

  const { data, error } = await supabaseAdmin
    .from("buy_requests")
    .select(BUY_REQUESTS_SELECT_WITH_RECS)
    .eq("submitted_by_profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({
    success: true,
    data: data ?? [],
    meta: { limit, count: data?.length ?? 0 },
  });
});

buyRequestsRouter.get("/", async (req, res) => {
  const status = String(req.query.status ?? "open");
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("buy_requests")
    .select(BUY_REQUESTS_SELECT_WITH_RECS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status === "open") {
    query = query
      .in("workflow_status", ["open", "in_progress"])
      .is("assigned_agent_id", null);
  } else {
    query = query.eq("workflow_status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    },
  });
});

buyRequestsRouter.post("/", requireAuth, async (req, res) => {
  const payload = req.body ?? {};
  const auth = res.locals.auth;

  const profile = await syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });

  const { data, error } = await supabaseAdmin
    .from("buy_requests")
    .insert({
      id: payload.id ?? `buy-${Date.now()}`,
      title: payload.title,
      property_type: payload.propertyType,
      district: payload.district,
      location: payload.location,
      budget: payload.budget,
      rooms: payload.rooms,
      sqm: payload.sqm,
      notes: payload.notes,
      contact_phone: payload.contactPhone,
      workflow_status: payload.workflowStatus ?? "open",
      submitted_by: payload.submittedBy ?? null,
      submitted_by_profile_id: profile.id,
      assigned_agent_id: payload.assignedAgentId ?? null,
      barter_offer: payload.barterOffer ?? null,
      barter_target: payload.barterTarget ?? null,
      cash_difference: payload.cashDifference ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(201).json({ success: true, data });
});

buyRequestsRouter.post(
  "/:id/recommendations",
  requireAuth,
  requireAgentRole,
  async (req, res) => {
    const buyRequestId = String(req.params.id ?? "").trim();
    if (!buyRequestId) {
      return res.status(400).json({ success: false, error: "ID буруу байна." });
    }

    const parsedIds = parseRecommendationListingIds(req.body);
    if (!parsedIds.ok) {
      return res.status(400).json({
        success: false,
        error: parsedIds.error,
      });
    }

    const auth = res.locals.auth;
    const agentId = await resolveAgentIdForAuth(auth);
    if (!agentId) {
      return res.status(403).json({
        success: false,
        error: "Агентын бүртгэл олдсонгүй.",
      });
    }

    const { data: br, error: brErr } = await supabaseAdmin
      .from("buy_requests")
      .select("id, workflow_status")
      .eq("id", buyRequestId)
      .maybeSingle();

    if (brErr || !br) {
      return res.status(404).json({ success: false, error: "Хүсэлт олдсонгүй." });
    }

    if (br.workflow_status === "closed") {
      return res.status(400).json({
        success: false,
        error: "Хаагдсан хүсэлтэд санал илгээх боломжгүй.",
      });
    }

    let inserted = 0;
    for (const listing_id of parsedIds.ids) {
      const { error: insErr } = await supabaseAdmin
        .from("buy_request_recommendations")
        .insert({
          buy_request_id: buyRequestId,
          listing_id,
          agent_id: agentId,
        });

      if (insErr) {
        if (insErr.code === "23505") {
          continue;
        }
        return res.status(500).json({ success: false, error: insErr.message });
      }
      inserted += 1;
    }

    return res.status(201).json({
      success: true,
      data: { inserted, requested: parsedIds.ids.length },
    });
  },
);

export { buyRequestsRouter };
