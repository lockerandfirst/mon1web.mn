import type { Agent } from "@/lib/data";
import { AVATAR_IMAGE_FALLBACK } from "@/lib/image-fallbacks";
import type { MarketplaceListing } from "@/lib/marketplace";

type SupabaseListingRow = Record<string, unknown>;

/** Картад «агент» биш — зар оруулагчийн нэр + placeholder аватар. */
export function listerDisplayAgentFromProfile(
  name: string,
  email: string,
  phone?: string | null,
  avatarUrl?: string | null,
): Agent {
  const safeName = name.trim() || "Хэрэглэгч";
  const trimmedAvatar = avatarUrl?.trim();
  const avatar =
    trimmedAvatar && trimmedAvatar.length > 0
      ? trimmedAvatar
      : AVATAR_IMAGE_FALLBACK;
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
  const colPhone =
    typeof listing.contact_phone === "string"
      ? listing.contact_phone.trim()
      : "";
  const raw = listing.submitted_by;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const jsonPhone =
      typeof o.phone === "string" ? o.phone.trim() : "";
    const mergedPhone = jsonPhone || colPhone;
    return {
      name: String(o.name ?? "Хэрэглэгч"),
      email: String(o.email ?? "user@mon1.local"),
      ...(mergedPhone ? { phone: mergedPhone } : {}),
    };
  }
  if (colPhone) {
    return {
      name: "Хэрэглэгч",
      email: "user@mon1.local",
      phone: colPhone,
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
    takingAgentId: null,
    submittedBy: readSubmittedBy(listing, submittedByOverride),
  };
}
