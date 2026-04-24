import type { Agent, Apartment } from "@/lib/data";
import type { BuyRequest } from "@/lib/buy-requests";
import type { MarketplaceListing } from "@/lib/marketplace";

const PREFIX = "mon1:agent-portal:v1:";
const TTL_MS = 3 * 60 * 1000;

export type AgentPortalSessionSnapshot = {
  connectedAgent: Agent | null;
  buyRequests: BuyRequest[];
  /** `useAgentPortalData({ mergeMyBuyRequests: true })` үед dashboard-ийн миний хүсэлтүүд. */
  myBuyRequests?: BuyRequest[];
  claimedSaleListings: MarketplaceListing[];
  agentCatalog: Apartment[];
  savedAt: number;
};

function key(userId: string) {
  return `${PREFIX}${userId}`;
}

export function readAgentPortalSessionCache(
  userId: string,
): Omit<AgentPortalSessionSnapshot, "savedAt"> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AgentPortalSessionSnapshot;
    if (!parsed?.savedAt) return null;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      sessionStorage.removeItem(key(userId));
      return null;
    }
    return {
      connectedAgent: parsed.connectedAgent ?? null,
      buyRequests: Array.isArray(parsed.buyRequests) ? parsed.buyRequests : [],
      myBuyRequests: Array.isArray(parsed.myBuyRequests)
        ? parsed.myBuyRequests
        : [],
      claimedSaleListings: Array.isArray(parsed.claimedSaleListings)
        ? parsed.claimedSaleListings
        : [],
      agentCatalog: Array.isArray(parsed.agentCatalog) ? parsed.agentCatalog : [],
    };
  } catch {
    return null;
  }
}

export function writeAgentPortalSessionCache(
  userId: string,
  snapshot: Omit<AgentPortalSessionSnapshot, "savedAt">,
) {
  if (typeof window === "undefined") return;
  try {
    const payload: AgentPortalSessionSnapshot = {
      ...snapshot,
      savedAt: Date.now(),
    };
    sessionStorage.setItem(key(userId), JSON.stringify(payload));
    legacyRemoveOldAgentKey();
  } catch {
    /* quota / private mode */
  }
}

/** Өмнөх зөвхөн-agent түлхүүр — нэгтгэсэн snapshot-тай давхцуулахгүй. */
function legacyRemoveOldAgentKey() {
  try {
    sessionStorage.removeItem("portal-connected-agent-v1");
  } catch {
    /* ignore */
  }
}

export function clearAgentPortalSessionCache(userId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key(userId));
  } catch {
    /* ignore */
  }
}
