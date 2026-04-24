import { Router } from "express";
import { z } from "zod";

import { paginationMeta, sendFail, sendOk, sendZodFail } from "../lib/api-response";
import { debug } from "../lib/debug";
import { requireAuth } from "../middleware/require-auth";
import { supabaseAdmin } from "../lib/supabase-admin";

const searchingAgentRouter = Router();
const SCOPE = "searching-agent";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

searchingAgentRouter.get("/", requireAuth, async (req, res) => {
  const parsed = querySchema.safeParse({
    page: req.query.page,
    limit: req.query.limit,
  });
  if (!parsed.success) {
    return sendZodFail(res, { scope: SCOPE, error: parsed.error });
  }

  const { page, limit } = parsed.data;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("searching_agent")
    .select(
      "id, property_id, user_id, status, created_at, listings(*), profiles!searching_agent_user_id_fkey(id, full_name, email, phone, avatar_url)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return sendFail(res, {
      scope: SCOPE,
      status: 500,
      error: error.message,
    });
  }

  debug.log(SCOPE, "list ok", {
    page,
    limit,
    returned: (data ?? []).length,
    total: count ?? 0,
  });
  return sendOk(res, data ?? [], {
    meta: paginationMeta(page, limit, count ?? 0),
  });
});

export { searchingAgentRouter };
