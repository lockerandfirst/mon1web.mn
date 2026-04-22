import type { Agent } from "@/lib/data";
import type { MarketplaceListing } from "@/lib/marketplace";

type SupabaseListingRow = Record<string, unknown>;

/** Картад «агент» биш — зар оруулагчийн нэр + placeholder аватар. */
export function listerDisplayAgentFromProfile(
  name: string,
  email: string,
  phone?: string | null,
): Agent {
  const safeName = name.trim() || "Хэрэглэгч";
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName.slice(0, 24))}&size=128&background=eef2ff&color=312e81`;
  return {
    id: "lister",
    name: safeName,
    avatar,
    phone: (phone ?? "").trim(),
    email: email.trim() || "user@mon1.local",
    company: "Зар оруулагч",
    rating: 0,
    reviewCount: 0,
    listingsCount: 0,
    verified: false,
  };
}

function readSubmittedBy(
  listing: SupabaseListingRow,
  fallback?: MarketplaceListing["submittedBy"],
): MarketplaceListing["submittedBy"] {
  const raw = listing.submitted_by;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    return {
      name: String(o.name ?? "Хэрэглэгч"),
      email: String(o.email ?? "user@mon1.local"),
      phone: typeof o.phone === "string" ? o.phone : undefined,
    };
  }
  return (
    fallback ?? {
      name: "Хэрэглэгч",
      email: "user@mon1.local",
    }
  );
}

export function marketplaceListingFromSupabaseListing(
  listing: SupabaseListingRow | null | undefined,
  opts: {
    connectedAgent: Agent;
    /** Картад агентын оронд зар оруулагчийг харуулах (ж: searching_agent feed) */
    listerDisplayAgent?: Agent;
    createdAtFallback?: string;
    submittedByOverride?: MarketplaceListing["submittedBy"];
  },
): MarketplaceListing | null {
  if (!listing || listing.id == null) {
    return null;
  }

  const {
    connectedAgent,
    listerDisplayAgent,
    createdAtFallback,
    submittedByOverride,
  } = opts;
  const st = listing.service_type;
  const serviceType =
    st === "agent" || st === "self" ? st : ("agent" as const);

  return {
    id: String(listing.id),
    title: String(listing.title ?? ""),
    propertyType: String(listing.property_type ?? "apartment"),
    price: Number(listing.price ?? 0),
    paymentMethod:
      (listing.payment_method as MarketplaceListing["paymentMethod"]) ?? "cash",
    pricePerSqm: Number(listing.price_per_sqm ?? 0),
    sqm: Number(listing.sqm ?? 0),
    rooms: Number(listing.rooms ?? 0),
    bathrooms: Number(listing.bathrooms ?? 0),
    floor: Number(listing.floor ?? 0),
    totalFloors: Number(listing.total_floors ?? 0),
    commissionYear: Number(
      listing.commission_year ?? new Date().getFullYear(),
    ),
    location: String(listing.location ?? ""),
    district: String(listing.district ?? ""),
    address: String(listing.address ?? ""),
    description: String(listing.description ?? ""),
    features: Array.isArray(listing.features)
      ? (listing.features as string[])
      : [],
    images: Array.isArray(listing.images) ? (listing.images as string[]) : [],
    verified: Boolean(listing.verified ?? false),
    featured: Boolean(listing.featured ?? false),
    agent: listerDisplayAgent ?? connectedAgent,
    nearbyServices: Array.isArray(listing.nearby_services)
      ? (listing.nearby_services as MarketplaceListing["nearbyServices"])
      : [],
    coordinates: {
      lat: Number(listing.latitude ?? 47.9184),
      lng: Number(listing.longitude ?? 106.9177),
    },
    createdAt: String(listing.created_at ?? createdAtFallback ?? ""),
    ...(listing.view_count != null
      ? { viewCount: Number(listing.view_count) }
      : {}),
    workflowStatus:
      listing.workflow_status === "published" ? "published" : "pending",
    selectedAgentId:
      listing.selected_agent_id == null
        ? null
        : String(listing.selected_agent_id),
    serviceType,
    takingAgentId:
      listing.taking_agent_id == null
        ? null
        : String(listing.taking_agent_id),
    submittedBy: readSubmittedBy(listing, submittedByOverride),
  };
}
