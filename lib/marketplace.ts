import type { Agent, Apartment } from "@/lib/data";

const MARKETPLACE_LISTINGS_KEY = "mon1-marketplace-listings";

export type MarketplaceListingStatus = "pending" | "published";

export interface MarketplaceListing extends Apartment {
  workflowStatus: MarketplaceListingStatus;
  selectedAgentId: string | null;
  submittedBy: {
    name: string;
    email: string;
  };
}

interface CreateMarketplaceListingInput {
  district: string;
  location: string;
  price: string;
  sqm: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  description: string;
  propertyType: string;
  selectedAgentId: string | null;
  submittedBy: {
    name: string;
    email: string;
  };
}

function getPlaceholderImage(propertyType: string) {
  switch (propertyType) {
    case "house":
      return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    case "office":
      return "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    case "land":
      return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    default:
      return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  }
}

function getPropertyTypeLabel(propertyType: string) {
  switch (propertyType) {
    case "house":
      return "хашаа байшин";
    case "office":
      return "оффис";
    case "land":
      return "газар";
    default:
      return "орон сууц";
  }
}

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function readMarketplaceListings(): MarketplaceListing[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MARKETPLACE_LISTINGS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeMarketplaceListings(listings: MarketplaceListing[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    MARKETPLACE_LISTINGS_KEY,
    JSON.stringify(listings),
  );
}

export function createMarketplaceListing(
  input: CreateMarketplaceListingInput,
  fallbackAgent: Agent,
): MarketplaceListing {
  const sqm = toNumber(input.sqm, 1);
  const price = toNumber(input.price, 0);
  const rooms = input.rooms === "5+" ? 5 : toNumber(input.rooms, 1);
  const propertyTypeLabel = getPropertyTypeLabel(input.propertyType);
  const roomLabel = input.rooms ? `${input.rooms} өрөө` : propertyTypeLabel;

  return {
    id: `user-${Date.now()}`,
    title: `${input.district} дэх ${roomLabel} ${propertyTypeLabel}`,
    price,
    pricePerSqm: Math.round(price / sqm),
    sqm,
    rooms,
    bathrooms: 1,
    floor: toNumber(input.floor, 1),
    totalFloors: toNumber(input.totalFloors, 1),
    location: input.location,
    district: input.district,
    address: input.location,
    description:
      input.description ||
      `${input.location} байршилд байрлах ${propertyTypeLabel}. Дэлгэрэнгүй мэдээллийг агенттай холбогдож авна уу.`,
    features: [],
    images: [getPlaceholderImage(input.propertyType)],
    verified: false,
    featured: false,
    agent: fallbackAgent,
    nearbyServices: [],
    coordinates: { lat: 47.9184, lng: 106.9177 },
    createdAt: new Date().toISOString(),
    workflowStatus: "pending",
    selectedAgentId: input.selectedAgentId,
    submittedBy: input.submittedBy,
  };
}

export function publishMarketplaceListing(
  listingId: string,
  agent: Agent,
  listings: MarketplaceListing[],
) {
  return listings.map((listing) =>
    listing.id === listingId
      ? {
          ...listing,
          agent,
          verified: true,
          workflowStatus: "published" as const,
        }
      : listing,
  );
}
