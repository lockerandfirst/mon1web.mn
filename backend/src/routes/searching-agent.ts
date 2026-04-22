import { Router } from "express";

import { requireAuth } from "../middleware/require-auth";
import { supabaseAdmin } from "../lib/supabase-admin";

const searchingAgentRouter = Router();

searchingAgentRouter.get("/", requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("searching_agent")
    .select(
      "id, property_id, user_id, status, created_at, listings(*), profiles!searching_agent_user_id_fkey(id, full_name, email, phone)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.log("[searching-agent] query failed", {
      page,
      limit,
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  console.log("[searching-agent] query success", {
    page,
    limit,
    returned: (data ?? []).length,
    total: count ?? 0,
  });
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

export { searchingAgentRouter };
