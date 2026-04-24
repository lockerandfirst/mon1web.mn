import { supabaseAdmin } from "./supabase-admin";

type RowWithAgentId = { agent_id?: string | null };

/**
 * `listings` мөрүүнд `listing_agent` embed холбох (GET list / GET map хоёуланд).
 */
export async function attachAgentsToListingRows<T extends RowWithAgentId>(
  rows: T[],
): Promise<
  | { ok: true; data: (T & { listing_agent: Record<string, unknown> | null })[] }
  | { ok: false; error: string }
> {
  const agentIds = Array.from(
    new Set(
      rows.map((row) => (row.agent_id ? String(row.agent_id) : "")).filter(Boolean),
    ),
  );

  let agentsById = new Map<string, Record<string, unknown>>();
  if (agentIds.length > 0) {
    const { data: agents, error: agentsErr } = await supabaseAdmin
      .from("agents")
      .select(
        "id, name, phone, email, avatar, company, rating, review_count, listings_count, verified, bio",
      )
      .in("id", agentIds);

    if (agentsErr) {
      return { ok: false, error: agentsErr.message };
    }

    agentsById = new Map(
      (agents ?? []).map((agent) => [
        String(agent.id),
        agent as Record<string, unknown>,
      ]),
    );
  }

  const data = rows.map((row) => ({
    ...row,
    listing_agent: row.agent_id
      ? (agentsById.get(String(row.agent_id)) ?? null)
      : null,
  }));

  return { ok: true, data };
}
