"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

import type { AgentPortalPickListing } from "@/components/portal/portal-types";
import { apiFetch } from "@/lib/backend-api";
import type { Agent } from "@/lib/data";
import { apartments } from "@/lib/data";
import type { BuyRequest } from "@/lib/buy-requests";
import { readBuyRequests } from "@/lib/buy-requests";
import type { MarketplaceListing } from "@/lib/marketplace";
import { readMarketplaceListings } from "@/lib/marketplace";
import { buyRequestFromSupabaseRow } from "@/lib/portal/map-supabase-buy-request";
import { marketplaceListingFromSupabaseListing } from "@/lib/portal/supabase-listing-to-marketplace";

function normalizeEmail(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}
const CONNECTED_AGENT_CACHE_KEY = "portal-connected-agent-v1";
const CONNECTED_AGENT_CACHE_TTL_MS = 5 * 60 * 1000;
const CLAIMED_LISTINGS_CACHE_KEY = "portal-claimed-listings-v1";
const CLAIMED_LISTINGS_CACHE_TTL_MS = 3 * 60 * 1000;

function readConnectedAgentCache(): Agent | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(CONNECTED_AGENT_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { ts?: number; data?: Agent };
    if (!parsed?.data || typeof parsed.ts !== "number") {
      return null;
    }
    if (Date.now() - parsed.ts > CONNECTED_AGENT_CACHE_TTL_MS) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeConnectedAgentCache(agent: Agent | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (!agent) {
    window.sessionStorage.removeItem(CONNECTED_AGENT_CACHE_KEY);
    return;
  }
  window.sessionStorage.setItem(
    CONNECTED_AGENT_CACHE_KEY,
    JSON.stringify({ ts: Date.now(), data: agent }),
  );
}

function readClaimedListingsCache() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(CLAIMED_LISTINGS_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as {
      ts?: number;
      data?: MarketplaceListing[];
    };
    if (
      typeof parsed.ts !== "number" ||
      !Array.isArray(parsed.data)
    ) {
      return null;
    }
    if (Date.now() - parsed.ts > CLAIMED_LISTINGS_CACHE_TTL_MS) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeClaimedListingsCache(data: MarketplaceListing[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(
    CLAIMED_LISTINGS_CACHE_KEY,
    JSON.stringify({ ts: Date.now(), data }),
  );
}

function reloadOpenBuyRequests(): BuyRequest[] {
  return readBuyRequests()
    .filter((r) => r.workflowStatus === "open" && r.assignedAgentId == null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function listingInSaleAgentFeed(
  listing: MarketplaceListing,
  connectedAgent: Agent | null,
) {
  const wantsAgent =
    listing.serviceType === "agent" ||
    (listing.serviceType == null &&
      Boolean(listing.selectedAgentId?.length));
  if (!wantsAgent || listing.workflowStatus !== "pending") {
    return false;
  }
  if (listing.takingAgentId) {
    return false;
  }
  if (listing.selectedAgentId) {
    if (!connectedAgent) {
      return false;
    }
    return listing.selectedAgentId === connectedAgent.id;
  }
  return true;
}

export function useAgentPortalData() {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const [marketplaceRaw, setMarketplaceRaw] = useState<MarketplaceListing[]>(
    [],
  );
  const [buyRequestsRaw, setBuyRequestsRaw] = useState<BuyRequest[]>([]);
  const [claimedSaleListings, setClaimedSaleListings] = useState<
    MarketplaceListing[]
  >([]);
  const [mounted, setMounted] = useState(typeof window !== "undefined");
  const [connectedAgent, setConnectedAgent] = useState<Agent | null>(
    readConnectedAgentCache(),
  );

  const loadConnectedAgent = useCallback(async (): Promise<Agent | null> => {
    if (!userLoaded || !user) {
      setConnectedAgent(null);
      return null;
    }
    try {
      const token = await getToken();
      if (!token) {
        setConnectedAgent(null);
        return null;
      }
      const res = await apiFetch<{ success: boolean; data: Agent }>(
        "/api/agents/me",
        { token },
      );
      const next = res.data ?? null;
      setConnectedAgent(next);
      writeConnectedAgentCache(next);
      return next;
    } catch {
      setConnectedAgent(null);
      writeConnectedAgentCache(null);
      return null;
    }
  }, [getToken, userLoaded, user]);

  const loadBuyRequestsFromApi = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setBuyRequestsRaw(reloadOpenBuyRequests());
        return;
      }

      const response = await apiFetch<{
        success: boolean;
        data: Record<string, unknown>[];
      }>("/api/buy-requests?status=open&limit=100", { token });

      const mapped = (response.data ?? []).map((row) =>
        buyRequestFromSupabaseRow(row),
      );
      const openPool = mapped
        .filter((r) => r.workflowStatus === "open" && r.assignedAgentId == null)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      setBuyRequestsRaw(openPool);
    } catch {
      setBuyRequestsRaw(reloadOpenBuyRequests());
    }
  }, [getToken]);

  const loadAgentSaling = useCallback(
    async () => {
      try {
        const token = await getToken();
        if (!token) {
          setClaimedSaleListings([]);
          return;
        }

        const response = await apiFetch<{
          success: boolean;
          data: Array<{ listings: Record<string, unknown> | null }>;
        }>("/api/agent-saling", { token });
        const fallbackAgent: Agent = {
          id: "agent-claim-fallback",
          name: "Agent",
          avatar: "",
          phone: "",
          email: "",
          company: "",
          rating: 0,
          reviewCount: 0,
          listingsCount: 0,
          verified: false,
        };
        const displayAgent = connectedAgent ?? fallbackAgent;

        const mapped = (response.data ?? [])
          .map((row) =>
            marketplaceListingFromSupabaseListing(row.listings, {
              connectedAgent: displayAgent,
            }),
          )
          .filter((item): item is MarketplaceListing => Boolean(item));

        setClaimedSaleListings(mapped);
        writeClaimedListingsCache(mapped);
      } catch {
        setClaimedSaleListings([]);
      }
    },
    [getToken, connectedAgent],
  );

  const refreshLocal = useCallback(() => {
    const liveListings = readMarketplaceListings();
    setMarketplaceRaw(liveListings);
  }, []);

  const refresh = useCallback(() => {
    refreshLocal();
    void (async () => {
      await Promise.all([
        loadConnectedAgent(),
        loadBuyRequestsFromApi(),
        loadAgentSaling(),
      ]);
    })();
  }, [
    refreshLocal,
    loadConnectedAgent,
    loadBuyRequestsFromApi,
    loadAgentSaling,
  ]);

  useEffect(() => {
    setMounted(true);
    refreshLocal();
  }, [refreshLocal]);

  useEffect(() => {
    void loadConnectedAgent();
  }, [loadConnectedAgent]);

  useEffect(() => {
    const cached = readClaimedListingsCache();
    if (cached && cached.length > 0) {
      setClaimedSaleListings(cached);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    void loadBuyRequestsFromApi();
    void loadAgentSaling();
  }, [mounted, connectedAgent, loadBuyRequestsFromApi, loadAgentSaling]);

  const email = normalizeEmail(user?.primaryEmailAddress?.emailAddress);

  const { marketplace, catalog } = useMemo(() => {
    if (!mounted) {
      return { marketplace: [] as MarketplaceListing[], catalog: [] };
    }
    const mp = marketplaceRaw.filter((listing) => {
      if (email && normalizeEmail(listing.submittedBy.email) === email) {
        return true;
      }
      if (connectedAgent && listing.selectedAgentId === connectedAgent.id) {
        return true;
      }
      return false;
    });
    const cat = connectedAgent
      ? apartments.filter((a) => a.agent.id === connectedAgent.id)
      : [];
    return { marketplace: mp, catalog: cat };
  }, [mounted, marketplaceRaw, email, connectedAgent]);

  const buyRequestsSeekingAgent = useMemo(
    () =>
      buyRequestsRaw.filter(
        (r) => r.workflowStatus === "open" && r.assignedAgentId == null,
      ),
    [buyRequestsRaw],
  );

  const saleFeedListings = useMemo(() => {
    if (!mounted) {
      return [] as MarketplaceListing[];
    }
    return marketplaceRaw.filter((l) =>
      listingInSaleAgentFeed(l, connectedAgent),
    );
  }, [mounted, marketplaceRaw, connectedAgent]);

  const agentPickListings = useMemo((): AgentPortalPickListing[] => {
    if (!mounted || !connectedAgent) {
      return [];
    }
    // «Худалдан авах хүсэлтүүд» дээр зөвхөн «Миний зарууд» (claimed) сонголт өгнө.
    const rows: AgentPortalPickListing[] = [];
    for (const l of claimedSaleListings) {
      rows.push({
        id: l.id,
        title: l.title,
        district: l.district,
        price: l.price,
        imageUrl: l.images?.[0] || undefined,
        source: "claimed",
      });
    }
    return rows;
  }, [mounted, connectedAgent, claimedSaleListings]);

  return {
    userLoaded,
    mounted,
    marketplace,
    catalog,
    claimedSaleListings,
    buyRequestsSeekingAgent,
    saleFeedListings,
    agentPickListings,
    connectedAgent,
    refresh,
  };
}
