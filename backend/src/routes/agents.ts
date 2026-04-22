import { Router } from "express";

import { supabaseAdmin } from "../lib/supabase-admin";
import { requireAuth } from "../middleware/require-auth";
import { requireAgentRole } from "../middleware/require-agent-role";

const agentsRouter = Router();

function mapAgentRowToClient(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    avatar: String(row.avatar ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    listingsCount: Number(row.listings_count ?? 0),
    verified: Boolean(row.verified ?? false),
  };
}

agentsRouter.get("/me", requireAuth, requireAgentRole, async (_req, res) => {
  const auth = res.locals.auth as { clerkUserId: string };
  const { data, error } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("clerk_user_id", auth.clerkUserId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  if (!data) {
    return res.status(404).json({
      success: false,
      error: "Агентын мөр олдсонгүй.",
    });
  }

  return res.json({
    success: true,
    data: mapAgentRowToClient(data as Record<string, unknown>),
  });
});

agentsRouter.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("agents")
    .select("*", { count: "exact" })
    .order("rating", { ascending: false })
    .range(from, to);

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

agentsRouter.get("/:id", async (req, res) => {
  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !agent) {
    return res.status(404).json({
      success: false,
      error: "Agent олдсонгүй.",
    });
  }

  const { data: listings } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("agent_id", req.params.id)
    .order("created_at", { ascending: false });

  return res.json({
    success: true,
    data: {
      ...agent,
      listings: listings ?? [],
    },
  });
});

export { agentsRouter };
