import { Router } from "express";
import { z } from "zod";

import { resolveAgentIdForAuth } from "../lib/resolve-agent-for-clerk";
import { requireAuth } from "../middleware/require-auth";
import { requireAgentRole } from "../middleware/require-agent-role";
import { supabaseAdmin } from "../lib/supabase-admin";

const agentSalingRouter = Router();

const postBodySchema = z.object({
  listingId: z.string().min(1),
});

agentSalingRouter.get("/", requireAuth, requireAgentRole, async (_req, res) => {
  const auth = res.locals.auth;
  const agentId = await resolveAgentIdForAuth(auth);
  if (!agentId) {
    return res.status(403).json({
      success: false,
      error: "Агентын бүртгэл олдсонгүй.",
    });
  }

  const { data: claims, error } = await supabaseAdmin
    .from("agent_saling")
    .select("id, created_at, listing_id")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  const rows = claims ?? [];
  const listingIds = [...new Set(rows.map((r) => r.listing_id).filter(Boolean))];

  if (listingIds.length === 0) {
    return res.json({ success: true, data: [] });
  }

  const { data: listings, error: listingsError } = await supabaseAdmin
    .from("listings")
    .select("*")
    .in("id", listingIds);

  if (listingsError) {
    return res.status(500).json({ success: false, error: listingsError.message });
  }

  const byId = new Map((listings ?? []).map((l) => [l.id as string, l]));

  const data = rows.map((claim) => ({
    id: claim.id,
    created_at: claim.created_at,
    listings: byId.get(claim.listing_id) ?? null,
  }));

  return res.json({ success: true, data });
});

agentSalingRouter.post("/", requireAuth, requireAgentRole, async (req, res) => {
  const parsed = postBodySchema.safeParse(req.body);
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

  const { data: listing, error: listingError } = await supabaseAdmin
    .from("listings")
    .select("id")
    .eq("id", parsed.data.listingId)
    .maybeSingle();

  if (listingError || !listing) {
    return res.status(404).json({
      success: false,
      error: "Зар олдсонгүй.",
    });
  }

  const { error: insertError } = await supabaseAdmin.from("agent_saling").insert({
    agent_id: agentId,
    listing_id: parsed.data.listingId,
    agent_posted: true,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Энэ зарыг аль хэдийн хариуцсан байна.",
      });
    }
    return res.status(500).json({ success: false, error: insertError.message });
  }

  const { error: deleteSearchError } = await supabaseAdmin
    .from("searching_agent")
    .delete()
    .eq("property_id", parsed.data.listingId);

  if (deleteSearchError) {
    console.log("[agent-saling] searching_agent delete failed", deleteSearchError.message);
    return res.status(500).json({
      success: false,
      error: "Зарыг нийтийн жагсаалтад шилжүүлэхэд алдаа гарлаа.",
    });
  }

  const { error: publishError } = await supabaseAdmin
    .from("listings")
    .update({
      workflow_status: "published",
      agent_id: agentId,
      selected_agent_id: null,
    })
    .eq("id", parsed.data.listingId);

  if (publishError) {
    console.log("[agent-saling] listing publish failed", publishError.message);
    return res.status(500).json({
      success: false,
      error: "Зарыг нийтэд нээхэд алдаа гарлаа.",
    });
  }

  return res.status(201).json({ success: true });
});

export { agentSalingRouter };
