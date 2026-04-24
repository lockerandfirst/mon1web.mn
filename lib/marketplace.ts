import type { Apartment } from "@/lib/data";
import type { BackendServiceType } from "@/lib/backend-contract";

export type MarketplaceListingStatus = "pending" | "published";

/**
 * Supabase-аас татсан зар — `Apartment` (нийтлэгдсэн зар) + нэмэлт workflow метадатууд.
 *
 * Энэ type нь frontend-ийн UI-гаар агент эсвэл оруулагчийн талаас зар ажиллуулах
 * (pending → published, claim, recommend) бүх төлөвийг илэрхийлэхэд хэрэглэгдэнэ.
 */
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
