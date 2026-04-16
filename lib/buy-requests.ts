import { agents, formatPrice, type Agent } from "@/lib/data";
import type { CreateBuyRequestPayload } from "@/lib/backend-contract";
import {
  getPlaceholderImage,
  getPropertyTypeLabel,
} from "@/lib/property-types";

const BUY_REQUESTS_KEY = "mon1-buy-requests";

export type BuyRequestStatus = "open" | "claimed";

export interface BuyRequestAgentRecommendation {
  listingId: string;
  listingTitle: string;
  agentId: string | null;
  recommendedAt: string;
}

export interface BuyRequest {
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
  workflowStatus: BuyRequestStatus;
  submittedBy: {
    name: string;
    email: string;
  };
  assignedAgentId: string | null;
  image: string;
  agentRecommendations?: BuyRequestAgentRecommendation[];
}

interface CreateBuyRequestInput {
  propertyType: string;
  district: string;
  location: string;
  budget: string;
  rooms: string;
  sqm: string;
  notes: string;
  contactPhone: string;
  barterOffer?: string;
  barterTarget?: string;
  cashDifference?: string;
  submittedBy: {
    name: string;
    email: string;
  };
}

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function readBuyRequests(): BuyRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(BUY_REQUESTS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeBuyRequests(requests: BuyRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BUY_REQUESTS_KEY, JSON.stringify(requests));
}

export function createBuyRequest(input: CreateBuyRequestInput): BuyRequest {
  const propertyTypeLabel = getPropertyTypeLabel(input.propertyType);
  const budget = toNumber(input.budget, 0);
  const rooms = toNumber(input.rooms, 1);
  const sqm = toNumber(input.sqm, 30);
  const barterDetails =
    input.propertyType === "barter"
      ? [
          input.barterOffer?.trim()
            ? `Санал болгож буй зүйл: ${input.barterOffer.trim()}`
            : null,
          input.barterTarget?.trim()
            ? `Сонирхож буй зүйл: ${input.barterTarget.trim()}`
            : null,
          input.cashDifference?.trim()
            ? `Зөрүү мөнгө: ${input.cashDifference.trim()}`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
  const notes = [barterDetails, input.notes.trim()].filter(Boolean).join("\n\n");
  const title =
    input.propertyType === "barter"
      ? `${input.district || input.location || "Тодорхойгүй байршил"} орчимд бартер сонирхоно`
      : `${input.district} дэх ${rooms} өрөө ${propertyTypeLabel} авна`;

  return {
    id: `buy-${Date.now()}`,
    title,
    propertyType: input.propertyType || "apartment",
    district: input.district,
    location: input.location,
    budget,
    rooms,
    sqm,
    notes,
    contactPhone: input.contactPhone.trim(),
    createdAt: new Date().toISOString(),
    workflowStatus: "open",
    submittedBy: input.submittedBy,
    assignedAgentId: null,
    image: getPlaceholderImage(input.propertyType),
    agentRecommendations: [],
  };
}

export function createBuyRequestFromPayload(
  input: CreateBuyRequestPayload,
): BuyRequest {
  const propertyTypeLabel = getPropertyTypeLabel(input.propertyType);
  const barterDetails =
    input.propertyType === "barter"
      ? [
          input.barterOffer
            ? `Санал болгож буй зүйл: ${input.barterOffer}`
            : null,
          input.barterTarget ? `Сонирхож буй зүйл: ${input.barterTarget}` : null,
          input.cashDifference
            ? `Зөрүү мөнгө: ${input.cashDifference}`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
  const notes = [barterDetails, input.notes].filter(Boolean).join("\n\n");
  const title =
    input.propertyType === "barter"
      ? `${input.district || input.location || "Тодорхойгүй байршил"} орчимд бартер сонирхоно`
      : `${input.district} дэх ${input.rooms} өрөө ${propertyTypeLabel} авна`;

  return {
    id: `buy-${Date.now()}`,
    title,
    propertyType: input.propertyType || "apartment",
    district: input.district,
    location: input.location,
    budget: input.budget,
    rooms: input.rooms,
    sqm: input.sqm,
    notes,
    contactPhone: input.contactPhone,
    createdAt: new Date().toISOString(),
    workflowStatus: "open",
    submittedBy: input.submittedBy,
    assignedAgentId: null,
    image: getPlaceholderImage(input.propertyType),
    agentRecommendations: [],
  };
}

export function appendBuyRequestRecommendation(
  requestId: string,
  rec: {
    listingId: string;
    listingTitle: string;
    agentId: string | null;
  },
  requests: BuyRequest[],
) {
  const entry: BuyRequestAgentRecommendation = {
    ...rec,
    recommendedAt: new Date().toISOString(),
  };
  return requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          agentRecommendations: [
            ...(request.agentRecommendations ?? []),
            entry,
          ],
        }
      : request,
  );
}

/** Клиент дээр шууд localStorage-д бичнэ. */
export function persistBuyRequestRecommendation(
  requestId: string,
  rec: {
    listingId: string;
    listingTitle: string;
    agentId: string | null;
  },
) {
  if (typeof window === "undefined") {
    return;
  }
  writeBuyRequests(
    appendBuyRequestRecommendation(requestId, rec, readBuyRequests()),
  );
}

export function claimBuyRequest(
  requestId: string,
  agent: Agent,
  requests: BuyRequest[],
) {
  return requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          workflowStatus: "claimed" as const,
          assignedAgentId: agent.id,
        }
      : request,
  );
}

export function getBuyRequestBudgetLabel(request: BuyRequest) {
  if (request.propertyType === "barter" && request.budget <= 0) {
    return "Бартер";
  }

  return formatPrice(request.budget);
}

export function getDefaultBuyRequestAgent() {
  return agents.find((agent) => agent.verified) ?? agents[0];
}
