import type { Agent, Apartment } from "@/lib/data";
import type {
  BackendServiceType,
  CreateListingRequestPayload,
} from "@/lib/backend-contract";
import {
  getPlaceholderImage,
  getPropertyTypeLabel,
} from "@/lib/property-types";

const MARKETPLACE_LISTINGS_KEY = "mon1-marketplace-listings";

export type MarketplaceListingStatus = "pending" | "published";

export interface MarketplaceListing extends Apartment {
  workflowStatus: MarketplaceListingStatus;
  selectedAgentId: string | null;
  serviceType?: BackendServiceType;
  takingAgentId?: string | null;
  submittedBy: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface CreateMarketplaceListingInput {
  title?: string;
  district: string;
  location: string;
  address?: string;
  price: string;
  paymentMethod?: "cash" | "mortgage" | "installment" | "any";
  sqm: string;
  rooms: string;
  bathrooms?: string;
  floor: string;
  totalFloors: string;
  commissionYear?: string;
  description: string;
  propertyType: string;
  features?: string[];
  nearbyServiceIds?: string[];
  imageUrls?: string[];
  serviceType?: BackendServiceType;
  selectedAgentId: string | null;
  submittedBy: {
    name: string;
    email: string;
    phone?: string;
  };
}

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildListingTitle(
  input: Pick<CreateMarketplaceListingInput, "title" | "district" | "rooms"> & {
    propertyType: string;
  },
) {
  const normalized = input.title?.trim();

  if (normalized) {
    return normalized;
  }

  const propertyTypeLabel = getPropertyTypeLabel(input.propertyType);
  const roomLabel = input.rooms ? `${input.rooms} өрөө` : propertyTypeLabel;
  return `${input.district} дэх ${roomLabel} ${propertyTypeLabel}`;
}

const nearbyServiceTemplates: Record<
  string,
  { type: "school" | "supermarket" | "bus" | "hospital"; name: string }
> = {
  school: { type: "school", name: "Ойролцоох сургууль" },
  shop: { type: "supermarket", name: "Ойролцоох супермаркет" },
  bus: { type: "bus", name: "Ойролцоох автобусны буудал" },
  hospital: { type: "hospital", name: "Ойролцоох эмнэлэг" },
};

function buildNearbyServices(ids?: string[]) {
  return (ids ?? [])
    .map((id, index) => {
      const template = nearbyServiceTemplates[id];

      if (!template) {
        return null;
      }

      const distanceMeters = 300 + index * 200;
      const walkTimeMinutes = 4 + index * 3;

      return {
        ...template,
        distance: `${distanceMeters}m`,
        walkTime: `${walkTimeMinutes} min`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function parseCoordinates(input: string) {
  if (!/^gps\b/i.test(input.trim())) {
    return null;
  }

  const match = input.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const lat = Number(match[1]);
  const lng = Number(match[2]);

  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return null;
  }

  return { lat, lng };
}

function toListingImages(propertyType: string, imageUrls?: string[]) {
  const cleaned = (imageUrls ?? [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return cleaned.length > 0 ? cleaned : [getPlaceholderImage(propertyType)];
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

  return {
    id: `user-${Date.now()}`,
    title: buildListingTitle(input),
    price,
    paymentMethod: input.paymentMethod ?? "cash",
    pricePerSqm: Math.round(price / sqm),
    sqm,
    rooms,
    bathrooms: toNumber(input.bathrooms ?? "1", 1),
    floor: toNumber(input.floor, 1),
    totalFloors: toNumber(input.totalFloors, 1),
    commissionYear: toNumber(
      input.commissionYear ?? `${new Date().getFullYear()}`,
      new Date().getFullYear(),
    ),
    location: input.location,
    district: input.district,
    address: input.address?.trim() || input.location,
    propertyType: input.propertyType,
    description:
      input.description ||
      `${input.location} байршилд байрлах ${getPropertyTypeLabel(input.propertyType)}. Дэлгэрэнгүй мэдээллийг агенттай холбогдож авна уу.`,
    features: input.features ?? [],
    images: toListingImages(input.propertyType, input.imageUrls),
    verified: false,
    featured: false,
    agent: fallbackAgent,
    nearbyServices:
      input.nearbyServices && input.nearbyServices.length > 0
        ? input.nearbyServices
        : buildNearbyServices(input.nearbyServiceIds),
    coordinates:
      parseCoordinates(input.location) || { lat: 47.9184, lng: 106.9177 },
    createdAt: new Date().toISOString(),
    workflowStatus: "pending",
    serviceType: input.serviceType ?? "self",
    selectedAgentId: input.selectedAgentId,
    takingAgentId: null,
    submittedBy: input.submittedBy,
  };
}

export function createMarketplaceListingFromPayload(
  input: CreateListingRequestPayload,
  fallbackAgent: Agent,
): MarketplaceListing {
  return {
    id: `user-${Date.now()}`,
    title: input.title,
    price: input.price,
    paymentMethod: input.paymentMethod,
    pricePerSqm: Math.round(input.price / Math.max(input.sqm, 1)),
    sqm: input.sqm,
    rooms: input.rooms,
    bathrooms: input.bathrooms,
    floor: input.floor,
    totalFloors: input.totalFloors,
    commissionYear: input.commissionYear,
    location: input.location,
    district: input.district,
    address: input.address,
    propertyType: input.propertyType,
    description:
      input.description ||
      `${input.location} байршилд байрлах ${getPropertyTypeLabel(input.propertyType)}. Дэлгэрэнгүй мэдээллийг агенттай холбогдож авна уу.`,
    features: input.features,
    images: toListingImages(input.propertyType, input.imageUrls),
    verified: false,
    featured: false,
    agent: fallbackAgent,
    nearbyServices:
      input.nearbyServices && input.nearbyServices.length > 0
        ? input.nearbyServices
        : buildNearbyServices(input.nearbyServiceIds),
    coordinates:
      parseCoordinates(input.location) || { lat: 47.9184, lng: 106.9177 },
    createdAt: new Date().toISOString(),
    workflowStatus: "pending",
    serviceType: input.serviceType,
    selectedAgentId: input.selectedAgentId,
    takingAgentId: null,
    submittedBy: input.submittedBy,
  };
}

export function claimSaleListingForAgent(
  listingId: string,
  agentId: string,
  listings: MarketplaceListing[],
) {
  return listings.map((listing) =>
    listing.id === listingId
      ? { ...listing, takingAgentId: agentId }
      : listing,
  );
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
