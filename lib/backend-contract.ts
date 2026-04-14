export interface ApiListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: ApiListMeta;
}

export interface ApiItemResponse<T> {
  data: T;
}

export type BackendServiceType = "self" | "agent";
export type BackendPaymentMethod = "cash" | "mortgage" | "installment";
export type BackendListingWorkflowStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";
export type BackendBuyRequestWorkflowStatus = "open" | "claimed" | "closed";

export interface BackendSubmittedBy {
  name: string;
  email: string;
}

export interface BackendAgent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  company: string;
  rating: number;
  reviewCount: number;
  listingsCount: number;
  verified: boolean;
}

export interface BackendNearbyService {
  type: "school" | "supermarket" | "bus" | "hospital";
  name: string;
  distance: string;
  walkTime: string;
}

export interface BackendCoordinates {
  lat: number;
  lng: number;
}

export interface BackendListing {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  paymentMethod: BackendPaymentMethod;
  pricePerSqm: number;
  sqm: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  commissionYear: number;
  location: string;
  district: string;
  address: string;
  description: string;
  features: string[];
  images: string[];
  verified: boolean;
  featured: boolean;
  agent: BackendAgent;
  nearbyServices: BackendNearbyService[];
  coordinates: BackendCoordinates;
  createdAt: string;
  workflowStatus: BackendListingWorkflowStatus;
  selectedAgentId: string | null;
  submittedBy: BackendSubmittedBy | null;
}

export interface BackendAgentProfile extends BackendAgent {
  bio?: string;
  listings: BackendListing[];
}

export interface CreateListingRequestPayload {
  propertyType: string;
  district: string;
  location: string;
  address: string;
  price: number;
  sqm: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  description: string;
  nearbyServiceIds: string[];
  serviceType: BackendServiceType;
  selectedAgentId: string | null;
  submittedBy: BackendSubmittedBy;
}

export interface CreateListingPayloadInput {
  propertyType: string;
  district: string;
  location: string;
  price: string | number;
  sqm: string | number;
  rooms: string | number;
  bathrooms: string | number;
  floor: string | number;
  totalFloors: string | number;
  description: string;
  surroundings?: string[];
  serviceType: BackendServiceType;
  selectedAgentId: string | null;
  submittedBy: BackendSubmittedBy;
}

export interface BackendBuyRequest {
  id: string;
  title: string;
  propertyType: string;
  district: string;
  location: string;
  budget: number;
  rooms: number;
  sqm: number;
  notes: string;
  contactPhone: string;
  createdAt: string;
  workflowStatus: BackendBuyRequestWorkflowStatus;
  submittedBy: BackendSubmittedBy;
  assignedAgentId: string | null;
  image: string;
}

export interface CreateBuyRequestPayload {
  propertyType: string;
  district: string;
  location: string;
  budget: number;
  rooms: number;
  sqm: number;
  contactPhone: string;
  notes: string;
  barterOffer: string | null;
  barterTarget: string | null;
  cashDifference: number | null;
  submittedBy: BackendSubmittedBy;
}

export interface CreateBuyRequestPayloadInput {
  propertyType: string;
  district: string;
  location: string;
  budget: string | number;
  rooms: string | number;
  sqm: string | number;
  contactPhone: string;
  notes: string;
  barterOffer?: string;
  barterTarget?: string;
  cashDifference?: string | number;
  submittedBy: BackendSubmittedBy;
}

export const RECOMMENDED_BACKEND_ENDPOINTS = {
  listListings: "/api/listings",
  getListing: "/api/listings/:id",
  createListing: "/api/listings",
  listAgents: "/api/agents",
  getAgent: "/api/agents/:id",
  listBuyRequests: "/api/buy-requests",
  createBuyRequest: "/api/buy-requests",
} as const;

function toPositiveNumber(value: string | number, fallback: number) {
  const normalized =
    typeof value === "number" ? value : Number.parseFloat(value.trim());

  return Number.isFinite(normalized) && normalized > 0 ? normalized : fallback;
}

function toRoomCount(value: string | number, fallback: number) {
  if (value === "5+") {
    return 5;
  }

  return toPositiveNumber(value, fallback);
}

function toNullableText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function buildCreateListingPayload(
  input: CreateListingPayloadInput,
): CreateListingRequestPayload {
  return {
    propertyType: input.propertyType || "apartment",
    district: input.district.trim(),
    location: input.location.trim(),
    address: input.location.trim(),
    price: toPositiveNumber(input.price, 0),
    sqm: toPositiveNumber(input.sqm, 1),
    rooms: toRoomCount(input.rooms, 1),
    bathrooms: toPositiveNumber(input.bathrooms, 1),
    floor: toPositiveNumber(input.floor, 1),
    totalFloors: toPositiveNumber(input.totalFloors, 1),
    description: input.description.trim(),
    nearbyServiceIds: input.surroundings ?? [],
    serviceType: input.serviceType,
    selectedAgentId:
      input.serviceType === "agent" ? input.selectedAgentId ?? null : null,
    submittedBy: input.submittedBy,
  };
}

export function buildCreateBuyRequestPayload(
  input: CreateBuyRequestPayloadInput,
): CreateBuyRequestPayload {
  const isBarter = input.propertyType === "barter";

  return {
    propertyType: input.propertyType || "apartment",
    district: input.district.trim(),
    location: input.location.trim(),
    budget: toPositiveNumber(input.budget, 0),
    rooms: toRoomCount(input.rooms, 1),
    sqm: toPositiveNumber(input.sqm, 30),
    contactPhone: input.contactPhone.trim(),
    notes: input.notes.trim(),
    barterOffer: isBarter ? toNullableText(input.barterOffer) : null,
    barterTarget: isBarter ? toNullableText(input.barterTarget) : null,
    cashDifference: isBarter
      ? toPositiveNumber(input.cashDifference ?? "", 0) || null
      : null,
    submittedBy: input.submittedBy,
  };
}
