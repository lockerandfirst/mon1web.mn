import type { ListListingsQuery } from "../routes/listings.schemas";

/** PostgREST `ilike` wildcard-оос зугтах. */
export function escapeIlikeFragment(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

/**
 * GET /api/listings — Supabase query дээр шүүлтүүр нэмнэ.
 * `listing_agent` join байхгүй тул түлхүүр үг зөвхөн зарын багануудыг шүүнэ.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase chain
export function applyListingsListFilters(query: any, f: ListListingsQuery) {
  let q = query;

  if (f.priceMin != null) {
    q = q.gte("price", f.priceMin);
  }
  if (f.priceMax != null) {
    q = q.lte("price", f.priceMax);
  }
  if (f.sqmMin != null) {
    q = q.gte("sqm", f.sqmMin);
  }
  if (f.sqmMax != null) {
    q = q.lte("sqm", f.sqmMax);
  }

  if (f.district) {
    q = q.eq("district", f.district);
  }

  if (f.category) {
    q = q.eq("property_type", f.category);
  }

  if (f.category === "rent" && f.rentType && f.rentType !== "apartment-rent") {
    const rt = f.rentType;
    if (rt === "room-rent") {
      q = q.or(
        "title.ilike.%өрөө%,description.ilike.%өрөө%,title.ilike.%room%,description.ilike.%room%",
      );
    } else if (rt === "house-rent") {
      q = q.or(
        "title.ilike.%хаус%,description.ilike.%хаус%,title.ilike.%house%,description.ilike.%house%",
      );
    } else if (rt === "office-rent") {
      q = q.or(
        "title.ilike.%оффис%,description.ilike.%оффис%,title.ilike.%office%,description.ilike.%office%",
      );
    } else if (rt === "work-rent") {
      q = q.or(
        "title.ilike.%ажлын байр%,description.ilike.%ажлын байр%",
      );
    }
  }

  if (f.rooms) {
    if (f.rooms.endsWith("+")) {
      const n = Number.parseInt(f.rooms, 10);
      if (Number.isFinite(n)) {
        q = q.gte("rooms", n);
      }
    } else {
      const n = Number.parseInt(f.rooms, 10);
      if (Number.isFinite(n)) {
        q = q.eq("rooms", n);
      }
    }
  }

  if (f.bathrooms) {
    if (f.bathrooms.endsWith("+")) {
      const n = Number.parseInt(f.bathrooms, 10);
      if (Number.isFinite(n)) {
        q = q.gte("bathrooms", n);
      }
    } else {
      const n = Number.parseInt(f.bathrooms, 10);
      if (Number.isFinite(n)) {
        q = q.eq("bathrooms", n);
      }
    }
  }

  if (f.category !== "rent" && f.paymentMethod && f.paymentMethod !== "any") {
    q = q.eq("payment_method", f.paymentMethod);
  }

  if (f.q) {
    const raw = f.q.trim().toLowerCase().replace(/\s+/g, " ");
    const parts = raw.split(" ").filter(Boolean).slice(0, 10);
    for (const part of parts) {
      const p = `%${escapeIlikeFragment(part)}%`;
      q = q.or(
        `title.ilike.${p},description.ilike.${p},location.ilike.${p},district.ilike.${p},address.ilike.${p},property_type.ilike.${p}`,
      );
    }
  }

  return q;
}

export function orderListingsListQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase chain
  query: any,
  sort: ListListingsQuery["sort"],
) {
  let q = query
    .order("featured", { ascending: false, nullsFirst: false })
    .order("verified", { ascending: false, nullsFirst: false });

  if (sort === "price-low") {
    q = q.order("price", { ascending: true, nullsFirst: false });
  } else if (sort === "price-high") {
    q = q.order("price", { ascending: false, nullsFirst: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  return q;
}

export function listingsListCacheKey(f: ListListingsQuery): string {
  const status = f.status ?? "published";
  const {
    page,
    limit,
    sort,
    q,
    priceMin,
    priceMax,
    sqmMin,
    sqmMax,
    district,
    category,
    rentType,
    rooms,
    bathrooms,
    paymentMethod,
    featured,
    agentId,
  } = f;
  return `listings:list:v2:${status}:${page}:${limit}:${String(featured ?? "")}:${agentId ?? ""}:${sort}:${q ?? ""}:${priceMin ?? ""}:${priceMax ?? ""}:${sqmMin ?? ""}:${sqmMax ?? ""}:${district ?? ""}:${category ?? ""}:${rentType ?? ""}:${rooms ?? ""}:${bathrooms ?? ""}:${paymentMethod ?? ""}`;
}
