export type BuyRequestStatus = "open" | "claimed" | "closed";

export interface BuyRequestAgentRecommendation {
  listingId: string;
  listingTitle: string;
  agentId: string | null;
  /** `buy_request_recommendations` → `agents` nested select */
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentAvatar?: string;
  recommendedAt: string;
}

/**
 * Supabase-ийн `buy_requests` хүснэгтээс татсан «Авна» хүсэлт — frontend UI-д
 * хэрэглэгдэх хэлбэр.
 */
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
  image?: string;
  agentRecommendations?: BuyRequestAgentRecommendation[];
}
