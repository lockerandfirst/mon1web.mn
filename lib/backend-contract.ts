import {
  appendPaymentMethodsToDescription,
  resolvePayloadPaymentMethod,
} from "./create-listing-payment";
import { stripGpsPrefixFromLocationText } from "./strip-gps-location-text";

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
export type BackendPaymentMethod =
  | "cash"
  | "mortgage"
  | "installment"
  | "any";
export type BackendListingWorkflowStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";
export type BackendBuyRequestWorkflowStatus = "open" | "claimed" | "closed";

export interface BackendSubmittedBy {
  name: string;
  email: string;
  phone?: string;
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
  title: string;
  propertyType: string;
  district: string;
  location: string;
  address: string;
  price: number;
  paymentMethod: BackendPaymentMethod;
  /** м² үнэ — backend `price_per_sqm` */
  pricePerSqm: number;
  sqm: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  commissionYear: number;
  description: string;
  features: string[];
  imageUrls: string[];
  nearbyServiceIds: string[];
  nearbyServices?: BackendNearbyService[];
  serviceType: BackendServiceType;
  selectedAgentId: string | null;
  submittedBy: BackendSubmittedBy;
  /** Backend `latitude` / `longitude` */
  coordinates: BackendCoordinates;
}

export interface CreateListingPayloadInput {
  title: string;
  propertyType: string;
  district: string;
  location: string;
  address: string;
  price: string | number;
  /** Legacy: зөвхөн paymentFlexible / paymentMethods байхгүй үед */
  paymentMethod?: BackendPaymentMethod;
  paymentFlexible?: boolean;
  paymentMethods?: BackendPaymentMethod[];
  sqm: string | number;
  rooms: string | number;
  bathrooms: string | number;
  floor: string | number;
  totalFloors: string | number;
  commissionYear: string | number;
  description: string;
  features?: string[];
  imageUrls?: string | string[];
  surroundings?: string[];
  nearbyServices?: BackendNearbyService[];
  serviceType: BackendServiceType;
  selectedAgentId: string | null;
  submittedBy: BackendSubmittedBy;
  /** Газрын зураг / GPS — байхгүй бол build үед default */
  coordinates?: BackendCoordinates;
  /** Боловсруулсан м² үнэ; байхгүй бол үнэ ÷ талбай */
  pricePerSqm?: string | number;
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
}

export interface CreateBuyRequestPayload {
  title: string;
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
  title?: string;
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
  listMyBuyRequests: "/api/buy-requests/mine",
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

function toListingTitle(
  title: string | undefined,
  district: string,
  rooms: string | number,
  propertyType: string,
) {
  const normalized = title?.trim();

  if (normalized) {
    return normalized;
  }

  const roomLabel = rooms ? `${rooms} өрөө` : propertyType || "Орон сууц";
  return `${district.trim()} дэх ${roomLabel} байр`;
}

function toImageUrls(value?: string | string[]) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function buildCreateListingPayload(
  input: CreateListingPayloadInput,
): CreateListingRequestPayload {
  const sqmNum = toPositiveNumber(input.sqm, 1);
  const priceNum = toPositiveNumber(input.price, 0);
  const computedPricePerSqm =
    sqmNum > 0 && priceNum > 0 ? Math.round(priceNum / sqmNum) : 0;
  const pricePerSqm =
    input.pricePerSqm !== undefined && input.pricePerSqm !== ""
      ? typeof input.pricePerSqm === "number"
        ? Math.round(input.pricePerSqm)
        : Math.round(toPositiveNumber(input.pricePerSqm, 0))
      : computedPricePerSqm;

  const coords = input.coordinates;
  const coordinates: BackendCoordinates =
    coords &&
    Number.isFinite(coords.lat) &&
    Number.isFinite(coords.lng) &&
    Math.abs(coords.lat) <= 90 &&
    Math.abs(coords.lng) <= 180
      ? { lat: coords.lat, lng: coords.lng }
      : { lat: 47.9184, lng: 106.9177 };

  return {
    title: toListingTitle(
      input.title,
      input.district,
      input.rooms,
      input.propertyType,
    ),
    propertyType: input.propertyType || "apartment",
    district: input.district.trim(),
    location: stripGpsPrefixFromLocationText(
      (input.location || input.address).trim(),
    ),
    address: stripGpsPrefixFromLocationText(
      (input.address.trim() || input.location.trim()),
    ),
    price: priceNum,
    paymentMethod: resolvePayloadPaymentMethod(
      input,
    ) as BackendPaymentMethod,
    pricePerSqm: pricePerSqm > 0 ? pricePerSqm : computedPricePerSqm,
    sqm: sqmNum,
    rooms: toRoomCount(input.rooms, 1),
    bathrooms: toPositiveNumber(input.bathrooms, 1),
    floor: toPositiveNumber(input.floor, 1),
    totalFloors: toPositiveNumber(input.totalFloors, 1),
    commissionYear: toPositiveNumber(
      input.commissionYear,
      new Date().getFullYear(),
    ),
    description: appendPaymentMethodsToDescription(
      input.description,
      input,
    ),
    features: (input.features ?? []).map((feature) => feature.trim()),
    imageUrls: toImageUrls(input.imageUrls),
    nearbyServiceIds: input.surroundings ?? [],
    nearbyServices: input.nearbyServices ?? [],
    serviceType: input.serviceType,
    /** Агент сонгохгүй — бүх зар backend дээр `selected_agent_id` null (агент «Би заръя»-аар авна). */
    selectedAgentId: null,
    submittedBy: input.submittedBy,
    coordinates,
  };
}

export function buildCreateBuyRequestPayload(
  input: CreateBuyRequestPayloadInput,
): CreateBuyRequestPayload {
  const isBarter = input.propertyType === "barter";
  const fallbackTitle =
    input.propertyType === "barter"
      ? `${input.district || input.location || "Тодорхойгүй байршил"} орчимд бартер сонирхоно`
      : `${input.district.trim()} дэх ${toRoomCount(input.rooms, 1)} өрөө ${input.propertyType} авна`;

  return {
    title: input.title?.trim() || fallbackTitle,
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

/**
 * Сервер талд хийх зүйлс (одоо ихэнх нь `lib/data`, `lib/marketplace` localStorage):
 * - Clerk-ийн session JWT-ээр API хамгаалах (`Authorization: Bearer …`).
 * - `backend-api.examples.json` дахь REST замууд + энэ файлах `Backend*` төрлүүдтэй нийцүүлэх.
 * - Зар, худалдан авах хүсэлт, агентын профайл, файл хадгалах (S3/CDN), workflow (draft → published).
 * - Хайлт/шүүлт, хуудаслалт (`ApiListMeta`), газрын зураг координат.
 */
