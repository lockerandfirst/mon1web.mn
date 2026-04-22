import { Router } from "express";
import { z } from "zod";

import { resolveAgentIdForAuth } from "../lib/resolve-agent-for-clerk";
import { syncProfile } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";
import { requireAgentRole } from "../middleware/require-agent-role";
import { supabaseAdmin } from "../lib/supabase-admin";

const buyRequestsRouter = Router();

const recommendationBodySchema = z.object({
  listingId: z.string().min(1),
});

buyRequestsRouter.get("/", async (req, res) => {
  const status = String(req.query.status ?? "open");
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const selectWithRecs = `
    *,
    buy_request_recommendations (
      id,
      listing_id,
      agent_id,
      recommended_at,
      listings ( title )
    )
  `;

  let query = supabaseAdmin
    .from("buy_requests")
    .select(selectWithRecs, { count: "exact" })
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

    const parsed = recommendationBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "listingId буруу байна.",
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

    const { error: insErr } = await supabaseAdmin
      .from("buy_request_recommendations")
      .insert({
        buy_request_id: buyRequestId,
        listing_id: parsed.data.listingId,
        agent_id: agentId,
      });

    if (insErr) {
      if (insErr.code === "23505") {
        return res.status(409).json({
          success: false,
          error: "Энэ зарыг аль хэдийн санал болгосон байна.",
        });
      }
      return res.status(500).json({ success: false, error: insErr.message });
    }

    return res.status(201).json({ success: true });
  },
);

export { buyRequestsRouter };
