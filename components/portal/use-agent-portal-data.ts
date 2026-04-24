"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth, useUser } from "@clerk/nextjs";

import type { AgentPortalPickListing } from "@/components/portal/portal-types";
import {
  clearAgentPortalSessionCache,
  readAgentPortalSessionCache,
  writeAgentPortalSessionCache,
} from "@/lib/agent-portal-session-cache";
import { apiFetch } from "@/lib/backend-api";
import type { Agent, Apartment } from "@/lib/data";
import type { BuyRequest } from "@/lib/buy-requests";
import { debug } from "@/lib/debug";
import type { MarketplaceListing } from "@/lib/marketplace";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";
import { buyRequestFromSupabaseRow } from "@/lib/portal/map-supabase-buy-request";
import { marketplaceListingFromSupabaseListing } from "@/lib/portal/supabase-listing-to-marketplace";

const FALLBACK_AGENT: Agent = {
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

async function fetchConnectedAgent(
  token: string,
  signal?: AbortSignal,
): Promise<Agent | null> {
  try {
    const res = await apiFetch<{ success: boolean; data: Agent }>(
      "/api/agents/me",
      { token, signal },
    );
    return res.data ?? null;
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.warn("useAgentPortalData", "fetchConnectedAgent failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return null;
  }
}

async function fetchBuyRequests(
  token: string | null,
  signal?: AbortSignal,
): Promise<BuyRequest[]> {
  try {
    const response = await apiFetch<{
      success: boolean;
      data: Record<string, unknown>[];
    }>("/api/buy-requests?status=open&limit=50", {
      token: token ?? null,
      signal,
    });

    return (response.data ?? [])
      .map((row) => buyRequestFromSupabaseRow(row))
      .filter(
        (r) => r.workflowStatus === "open" && r.assignedAgentId == null,
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.warn("useAgentPortalData", "fetchBuyRequests failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return [];
  }
}

async function fetchMyBuyRequests(
  token: string,
  signal?: AbortSignal,
): Promise<BuyRequest[]> {
  try {
    const response = await apiFetch<{
      success: boolean;
      data: Record<string, unknown>[];
    }>("/api/buy-requests/mine?limit=50", { token, signal });

    return (response.data ?? [])
      .map((row) => buyRequestFromSupabaseRow(row))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.warn("useAgentPortalData", "fetchMyBuyRequests failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return [];
  }
}

function mergePoolAndMyBuyRequests(
  pool: BuyRequest[],
  mine: BuyRequest[],
): BuyRequest[] {
  const byId = new Map<string, BuyRequest>();
  for (const r of mine) {
    byId.set(r.id, r);
  }
  for (const r of pool) {
    if (!byId.has(r.id)) {
      byId.set(r.id, r);
    }
  }
  return Array.from(byId.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

async function fetchAgentSalingListings(
  token: string,
  displayAgent: Agent,
  signal?: AbortSignal,
): Promise<MarketplaceListing[]> {
  try {
    const response = await apiFetch<{
      success: boolean;
      data: Array<{ listings: Record<string, unknown> | null }>;
    }>("/api/agent-saling", { token, signal });

    return (response.data ?? [])
      .map((row) =>
        marketplaceListingFromSupabaseListing(row.listings, {
          connectedAgent: displayAgent,
        }),
      )
      .filter((item): item is MarketplaceListing => Boolean(item));
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.warn("useAgentPortalData", "fetchAgentSalingListings failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return [];
  }
}

async function fetchAgentCatalog(
  agentId: string,
  token: string | null,
  signal?: AbortSignal,
): Promise<Apartment[]> {
  try {
    const response = await apiFetch<{
      success: boolean;
      data: Record<string, unknown>[];
    }>(
      `/api/listings?status=published&agentId=${encodeURIComponent(agentId)}&limit=100`,
      { token: token ?? null, signal },
    );
    return (response.data ?? []).map(
      (row) => apartmentFromApiListing(row).apartment,
    );
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.warn("useAgentPortalData", "fetchAgentCatalog failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return [];
  }
}

export type UseAgentPortalDataOptions = {
  /** Dashboard «Хүсэлтүүд» — өөрийн оруулсан хүсэлт + агентын саналуудыг нэгтгэнэ. */
  mergeMyBuyRequests?: boolean;
};

export function useAgentPortalData(options?: UseAgentPortalDataOptions) {
  const mergeMyBuyRequests = options?.mergeMyBuyRequests ?? false;
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();

  const [buyRequestsRaw, setBuyRequestsRaw] = useState<BuyRequest[]>([]);
  const [myBuyRequestsRaw, setMyBuyRequestsRaw] = useState<BuyRequest[]>([]);
  const [claimedSaleListings, setClaimedSaleListings] = useState<
    MarketplaceListing[]
  >([]);
  const [agentCatalog, setAgentCatalog] = useState<Apartment[]>([]);
  const [connectedAgent, setConnectedAgent] = useState<Agent | null>(null);
  const [portalInitialLoading, setPortalInitialLoading] = useState(true);

  const userIdRef = useRef<string | null>(null);
  userIdRef.current = user?.id ?? null;

  /** Session snapshot — давтан ороход tab skeleton багасна. */
  useLayoutEffect(() => {
    if (!userLoaded || !user?.id) return;
    const snap = readAgentPortalSessionCache(user.id);
    if (!snap) return;
    setConnectedAgent(snap.connectedAgent);
    setBuyRequestsRaw(snap.buyRequests);
    if (mergeMyBuyRequests) {
      setMyBuyRequestsRaw(snap.myBuyRequests ?? []);
    }
    setClaimedSaleListings(snap.claimedSaleListings);
    setAgentCatalog(snap.agentCatalog);
    setPortalInitialLoading(false);
  }, [userLoaded, user?.id, mergeMyBuyRequests]);

  useEffect(() => {
    if (!userLoaded) return;

    let cancelled = false;
    const ac = new AbortController();

    const run = async () => {
      const uid = user?.id ?? null;
      const hadCache =
        typeof window !== "undefined" &&
        Boolean(uid && readAgentPortalSessionCache(uid));

      if (!hadCache) {
        setPortalInitialLoading(true);
      }

      if (!user) {
        setConnectedAgent(null);
        setBuyRequestsRaw([]);
        setMyBuyRequestsRaw([]);
        setClaimedSaleListings([]);
        setAgentCatalog([]);
        if (!cancelled) setPortalInitialLoading(false);
        return;
      }

      try {
        const token = await getToken();
        if (cancelled) return;
        if (!token) {
          setConnectedAgent(null);
          setBuyRequestsRaw([]);
          setMyBuyRequestsRaw([]);
          setClaimedSaleListings([]);
          setAgentCatalog([]);
          setPortalInitialLoading(false);
          return;
        }

        const agent = await fetchConnectedAgent(token, ac.signal);
        if (cancelled) return;

        const nextAgent = agent;
        setConnectedAgent(nextAgent);

        const agentId = nextAgent?.id?.trim() ? nextAgent.id : null;
        const mappingAgent = nextAgent ?? FALLBACK_AGENT;
        const minePromise = mergeMyBuyRequests
          ? fetchMyBuyRequests(token, ac.signal)
          : Promise.resolve([] as BuyRequest[]);
        const [buys, mineRows, salingRemapped, catalog] = await Promise.all([
          fetchBuyRequests(token, ac.signal),
          minePromise,
          fetchAgentSalingListings(token, mappingAgent, ac.signal),
          agentId
            ? fetchAgentCatalog(agentId, token, ac.signal)
            : Promise.resolve([] as Apartment[]),
        ]);
        if (cancelled) return;

        setBuyRequestsRaw(buys);
        setMyBuyRequestsRaw(mineRows);
        setClaimedSaleListings(salingRemapped);
        setAgentCatalog(catalog);

        writeAgentPortalSessionCache(user.id, {
          connectedAgent: nextAgent,
          buyRequests: buys,
          ...(mergeMyBuyRequests ? { myBuyRequests: mineRows } : {}),
          claimedSaleListings: salingRemapped,
          agentCatalog: catalog,
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        debug.error("useAgentPortalData", "portal bootstrap failed", {
          message: e instanceof Error ? e.message : "unknown",
        });
      } finally {
        if (!cancelled) setPortalInitialLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [userLoaded, user?.id, getToken, mergeMyBuyRequests]);

  const refresh = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid || !userLoaded) return;
    clearAgentPortalSessionCache(uid);
    try {
      const token = await getToken();
      if (!token) return;

      const nextAgent = await fetchConnectedAgent(token);
      const mappingAgent = nextAgent ?? FALLBACK_AGENT;
      const agentId = nextAgent?.id?.trim() ? nextAgent.id : null;

      const minePromise = mergeMyBuyRequests
        ? fetchMyBuyRequests(token)
        : Promise.resolve([] as BuyRequest[]);
      const [buys, mineRows, saling, catalog] = await Promise.all([
        fetchBuyRequests(token),
        minePromise,
        fetchAgentSalingListings(token, mappingAgent),
        agentId
          ? fetchAgentCatalog(agentId, token)
          : Promise.resolve([] as Apartment[]),
      ]);

      setConnectedAgent(nextAgent);
      setBuyRequestsRaw(buys);
      setMyBuyRequestsRaw(mineRows);
      setClaimedSaleListings(saling);
      setAgentCatalog(catalog);

      writeAgentPortalSessionCache(uid, {
        connectedAgent: nextAgent,
        buyRequests: buys,
        ...(mergeMyBuyRequests ? { myBuyRequests: mineRows } : {}),
        claimedSaleListings: saling,
        agentCatalog: catalog,
      });
    } catch (e) {
      debug.warn("useAgentPortalData", "refresh failed", {
        message: e instanceof Error ? e.message : "unknown",
      });
    }
  }, [getToken, userLoaded, mergeMyBuyRequests]);

  const buyRequestsSeekingAgent = useMemo(() => {
    if (!mergeMyBuyRequests) {
      return buyRequestsRaw;
    }
    return mergePoolAndMyBuyRequests(buyRequestsRaw, myBuyRequestsRaw);
  }, [mergeMyBuyRequests, buyRequestsRaw, myBuyRequestsRaw]);

  const agentPickListings = useMemo((): AgentPortalPickListing[] => {
    if (!connectedAgent) return [];
    return claimedSaleListings.map((l) => ({
      id: l.id,
      title: l.title,
      district: l.district,
      price: l.price,
      imageUrl: l.images?.[0] || undefined,
      source: "claimed",
    }));
  }, [connectedAgent, claimedSaleListings]);

  return {
    userLoaded,
    claimedSaleListings,
    buyRequestsSeekingAgent,
    agentPickListings,
    connectedAgent,
    refresh,
    portalInitialLoading: !userLoaded || portalInitialLoading,
  };
}
