import type { Agent, Apartment, NearbyService } from "@/lib/data";
import { ensureListingImageUrls } from "@/lib/image-fallbacks";

type SupabaseListingRow = Record<string, unknown>;

export type OwnerContact = {
  name: string;
  email: string;
  phone: string;
};

function readContactPhoneColumn(listing: SupabaseListingRow): string {
  const v = listing.contact_phone;
  return typeof v === "string" ? v.trim() : "";
}

/**
 * `submitted_by` + `contact_phone` баганаас зар оруулагчийн холбоо.
 * (Агенттай зар дээр `ownerContact` null байж болох тул засах форм эндээс уншина.)
 */
export function listingSubmittedByFromApiRow(
  listing: SupabaseListingRow,
): OwnerContact {
  const colPhone = readContactPhoneColumn(listing);
  const raw = listing.submitted_by;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const jsonPhone =
      typeof o.phone === "string" ? o.phone.trim() : "";
    const phone = jsonPhone || colPhone;
    return {
      name: String(o.name ?? "Хэрэглэгч"),
      email: String(o.email ?? ""),
      phone,
    };
  }
  if (colPhone) {
    return { name: "Хэрэглэгч", email: "", phone: colPhone };
  }
  return { name: "Хэрэглэгч", email: "", phone: "" };
}

export function agentFromListingAgentRow(row: Record<string, unknown>): Agent {
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

function ownerPlaceholderAgent(submitted: {
  name: string;
  email: string;
  phone: string;
}): Agent {
  return {
    id: "owner-contact",
    name: submitted.name,
    avatar: "",
    phone: submitted.phone,
    email: submitted.email,
    company: "",
    rating: 0,
    reviewCount: 0,
    listingsCount: 0,
    verified: false,
  };
}

/**
 * GET /api/listings/:id хариу (listings + optional listing_agent) → Apartment.
 */
function readSubmittedBy(listing: SupabaseListingRow): OwnerContact {
  return listingSubmittedByFromApiRow(listing);
}

export function apartmentFromApiListing(row: SupabaseListingRow): {
  apartment: Apartment;
  contactUsesAgent: boolean;
  /** Зар оруулагчийн холбоо — зөвхөн `contactUsesAgent === false` үед */
  ownerContact: OwnerContact | null;
} {
  const submitted = readSubmittedBy(row);
  const embedded = row.listing_agent as Record<string, unknown> | null;
  const hasAgent =
    row.agent_id != null &&
    String(row.agent_id).length > 0 &&
    embedded != null &&
    typeof embedded === "object" &&
    embedded.id != null;

  const agent = hasAgent
    ? agentFromListingAgentRow(embedded)
    : ownerPlaceholderAgent(submitted);

  const nearby = Array.isArray(row.nearby_services)
    ? (row.nearby_services as NearbyService[])
    : [];

  const apartment: Apartment = {
    id: String(row.id),
    title: String(row.title ?? ""),
    propertyType: String(row.property_type ?? "apartment"),
    price: Number(row.price ?? 0),
    paymentMethod:
      (row.payment_method as Apartment["paymentMethod"]) ?? "cash",
    pricePerSqm: Number(row.price_per_sqm ?? 0),
    sqm: Number(row.sqm ?? 0),
    rooms: Number(row.rooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    floor: Number(row.floor ?? 0),
    totalFloors: Number(row.total_floors ?? 0),
    commissionYear:
      row.commission_year == null || row.commission_year === ""
        ? 0
        : Number(row.commission_year),
    location: String(row.location ?? ""),
    district: String(row.district ?? ""),
    address: String(row.address ?? ""),
    description: String(row.description ?? ""),
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    images: ensureListingImageUrls(row.images),
    verified: Boolean(row.verified ?? false),
    featured: Boolean(row.featured ?? false),
    agent,
    nearbyServices: nearby,
    coordinates: {
      lat: Number(row.latitude ?? 47.9184),
      lng: Number(row.longitude ?? 106.9177),
    },
    createdAt: String(row.created_at ?? ""),
    viewCount: Number(row.view_count ?? 0),
    contactPhone: submitted.phone.trim() ? submitted.phone.trim() : undefined,
  };

  return {
    apartment,
    contactUsesAgent: hasAgent,
    ownerContact: hasAgent ? null : submitted,
  };
}
