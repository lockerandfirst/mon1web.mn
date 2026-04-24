import type { BuyRequest, BuyRequestAgentRecommendation } from "@/lib/buy-requests";

type AgentEmbed = {
  id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  avatar?: string | null;
};

type RecRow = {
  listing_id?: string;
  agent_id?: string | null;
  recommended_at?: string;
  listings?: { title?: string | null } | null | Array<{ title?: string | null }>;
  agents?: AgentEmbed | AgentEmbed[] | null;
};

function parseNestedAgent(raw: unknown): AgentEmbed | null {
  if (raw == null) return null;
  if (Array.isArray(raw)) {
    const first = raw[0];
    return first && typeof first === "object" ? (first as AgentEmbed) : null;
  }
  if (typeof raw === "object") {
    return raw as AgentEmbed;
  }
  return null;
}

function normalizeWorkflow(
  workflowStatus: string | undefined,
  assignedAgentId: string | null | undefined,
): BuyRequest["workflowStatus"] {
  if (workflowStatus === "closed") {
    return "closed";
  }
  if (assignedAgentId) {
    return "claimed";
  }
  if (workflowStatus === "open" || workflowStatus === "in_progress") {
    return "open";
  }
  return "open";
}

export function buyRequestFromSupabaseRow(
  row: Record<string, unknown>,
): BuyRequest {
  const submitted = row.submitted_by as Record<string, unknown> | null;
  const rawRecs = row.buy_request_recommendations;
  const recList: RecRow[] = Array.isArray(rawRecs) ? (rawRecs as RecRow[]) : [];

  const agentRecommendations: BuyRequestAgentRecommendation[] = recList.map(
    (r) => {
      const embedded = r.listings;
      const listingTitle =
        Array.isArray(embedded) && embedded[0] && "title" in embedded[0]
          ? String((embedded[0] as { title?: string }).title ?? "Зар")
          : embedded &&
              typeof embedded === "object" &&
              embedded !== null &&
              "title" in embedded
            ? String((embedded as { title?: string }).title ?? "Зар")
            : "Зар";
      const ag = parseNestedAgent(r.agents);
      return {
        listingId: String(r.listing_id ?? ""),
        listingTitle,
        agentId: r.agent_id == null ? null : String(r.agent_id),
        agentName: ag?.name != null ? String(ag.name) : undefined,
        agentPhone: ag?.phone != null ? String(ag.phone) : undefined,
        agentEmail: ag?.email != null ? String(ag.email) : undefined,
        agentAvatar: ag?.avatar != null ? String(ag.avatar) : undefined,
        recommendedAt: String(r.recommended_at ?? ""),
      };
    },
  );

  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    propertyType: String(row.property_type ?? "apartment"),
    district: String(row.district ?? ""),
    location: String(row.location ?? ""),
    budget: Number(row.budget ?? 0),
    rooms: Number(row.rooms ?? 0),
    sqm: Number(row.sqm ?? 0),
    notes: String(row.notes ?? ""),
    contactPhone: String(row.contact_phone ?? ""),
    createdAt: String(row.created_at ?? ""),
    workflowStatus: normalizeWorkflow(
      row.workflow_status as string | undefined,
      row.assigned_agent_id == null
        ? null
        : String(row.assigned_agent_id),
    ),
    submittedBy: {
      name: String(submitted?.name ?? "Хэрэглэгч"),
      email: String(submitted?.email ?? ""),
    },
    assignedAgentId:
      row.assigned_agent_id == null ? null : String(row.assigned_agent_id),
    agentRecommendations,
  };
}
