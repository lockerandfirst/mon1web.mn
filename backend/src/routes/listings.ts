import { Router } from "express";
import { z } from "zod";

import { syncProfile } from "../lib/profile-sync";
import { requireAuth } from "../middleware/require-auth";
import { supabaseAdmin } from "../lib/supabase-admin";

const listingsRouter = Router();
const serviceTypeSchema = z.object({
  serviceType: z.enum(["self", "agent"]),
});

/** Нийтийн зарын дэлгэрэнгүй — үзэлт +1 (auth шаардлагагүй). */
listingsRouter.post("/:id/record-view", async (req, res) => {
  const id = String(req.params.id ?? "").trim();
  if (!id) {
    return res.status(400).json({ success: false, error: "ID буруу байна." });
  }

  const { data: row, error: readErr } = await supabaseAdmin
    .from("listings")
    .select("id, view_count")
    .eq("id", id)
    .maybeSingle();

  if (readErr || !row) {
    return res.status(404).json({ success: false, error: "Зар олдсонгүй." });
  }

  const next = Number(row.view_count ?? 0) + 1;
  const { error: upErr } = await supabaseAdmin
    .from("listings")
    .update({ view_count: next, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (upErr) {
    return res.status(500).json({ success: false, error: upErr.message });
  }

  return res.json({ success: true, data: { viewCount: next } });
});

listingsRouter.get("/", async (req, res) => {
  const status = String(req.query.status ?? "published");
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("listings")
    .select("*", { count: "exact" })
    .eq("workflow_status", status)
    .order("created_at", { ascending: false })
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

listingsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const withAgent = await supabaseAdmin
    .from("listings")
    .select(
      `
      *,
      listing_agent:agents!listings_agent_id_fkey (
        id,
        name,
        phone,
        email,
        avatar,
        company,
        rating,
        review_count,
        listings_count,
        verified,
        bio
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
      return res.status(404).json({
        success: false,
        error: "Listing олдсонгүй.",
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

    return res.json({
      success: true,
      data: { ...row, listing_agent },
    });
  }

  if (!withAgent.data) {
    return res.status(404).json({
      success: false,
      error: "Listing олдсонгүй.",
    });
  }

  return res.json({ success: true, data: withAgent.data });
});

listingsRouter.post("/", requireAuth, async (req, res) => {
  const payload = req.body ?? {};
  const auth = res.locals.auth;
  const parsed = serviceTypeSchema.safeParse({
    serviceType: payload.serviceType ?? "self",
  });

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "sale type буруу байна.",
    });
  }

  const profile = await syncProfile({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });

  const isAgentSale = parsed.data.serviceType === "agent";
  /** Өөрөө зарна → шууд нийтийн зарууд (listings). Агентаар → pending + searching_agent. */
  const workflowStatus = isAgentSale
    ? "pending"
    : (payload.workflowStatus === "draft" ? "draft" : "published");
  const listingAgentId = isAgentSale
    ? null
    : (payload.agentId ?? payload.selectedAgentId ?? null);

  const { data, error } = await supabaseAdmin
    .from("listings")
    .insert({
      id: payload.id ?? `listing-${Date.now()}`,
      title: payload.title,
      property_type: payload.propertyType,
      price: payload.price,
      payment_method: payload.paymentMethod ?? "cash",
      price_per_sqm: payload.pricePerSqm ?? null,
      sqm: payload.sqm ?? null,
      rooms: payload.rooms ?? null,
      bathrooms: payload.bathrooms ?? null,
      floor: payload.floor ?? null,
      total_floors: payload.totalFloors ?? null,
      commission_year: payload.commissionYear ?? null,
      location: payload.location ?? null,
      district: payload.district ?? null,
      address: payload.address ?? null,
      description: payload.description ?? null,
      features: payload.features ?? [],
      images: payload.images ?? payload.imageUrls ?? [],
      verified: false,
      featured: false,
      agent_id: listingAgentId,
      nearby_services: payload.nearbyServices ?? [],
      latitude: payload.coordinates?.lat ?? null,
      longitude: payload.coordinates?.lng ?? null,
      workflow_status: workflowStatus,
      selected_agent_id: isAgentSale ? null : (payload.selectedAgentId ?? null),
      service_type: payload.serviceType ?? "self",
      submitted_by: payload.submittedBy ?? null,
      submitted_by_profile_id: profile.id,
    })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  // «Агентаар заруулах»: зар pending хэвээр үлдэж, агентын самбарт searching_agent харагдана.
  if (parsed.data.serviceType === "agent") {
    const { error: searchingError } = await supabaseAdmin
      .from("searching_agent")
      .insert({
        property_id: data.id,
        user_id: profile.id,
      });

    if (searchingError) {
      return res.status(500).json({
        success: false,
        error: searchingError.message,
      });
    }
  }

  return res.status(201).json({ success: true, data });
});

export { listingsRouter };
