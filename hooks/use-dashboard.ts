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

import type { Agent, Apartment } from "@/lib/data";
import { apiFetch } from "@/lib/backend-api";
import { debug } from "@/lib/debug";
import {
  patchDashboardSessionListings,
  readDashboardSessionCache,
  writeDashboardSessionCache,
} from "@/lib/dashboard-session-cache";
import { useFavorites } from "@/hooks/use-favorites";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";

const FALLBACK_AGENT: Agent = {
  id: "",
  name: "Агент",
  avatar: "",
  phone: "",
  email: "",
  company: "",
  rating: 0,
  reviewCount: 0,
  listingsCount: 0,
  verified: false,
};

async function fetchAgentMe(
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
    debug.error("useDashboard", "fetchAgentMe failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return null;
  }
}

async function fetchListingsForAgent(
  token: string,
  agentId: string,
  signal?: AbortSignal,
): Promise<Apartment[]> {
  try {
    const res = await apiFetch<{
      success: boolean;
      data: Record<string, unknown>[];
    }>(
      `/api/listings?status=published&agentId=${encodeURIComponent(agentId)}&limit=100`,
      { token, signal },
    );
    return (res.data ?? []).map((row) => apartmentFromApiListing(row).apartment);
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.error("useDashboard", "fetchListingsForAgent failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return [];
  }
}

async function fetchSavedListingApartments(
  token: string,
  signal?: AbortSignal,
): Promise<Apartment[]> {
  try {
    const res = await apiFetch<{
      success: boolean;
      data: Array<{
        listingId: string;
        listings: Record<string, unknown> | null;
      }>;
    }>("/api/saved-listings", { token, signal });
    return (res.data ?? [])
      .map((row) => row.listings)
      .filter((row): row is Record<string, unknown> => Boolean(row))
      .map((row) => apartmentFromApiListing(row).apartment);
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    debug.warn("useDashboard", "fetchSavedListingApartments failed", {
      message: e instanceof Error ? e.message : "unknown",
    });
    return [];
  }
}

export function useDashboard() {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const favorites = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentAgent, setCurrentAgent] = useState<Agent>(FALLBACK_AGENT);
  const [listings, setListings] = useState<Apartment[]>([]);
  const [favoriteApartments, setFavoriteApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingsAgentId, setListingsAgentId] = useState<string | null>(null);

  const userIdRef = useRef<string | null>(null);
  userIdRef.current = user?.id ?? null;

  /** Session cache-аас нэг кадрын дотор hydrate — skeleton flash багасна. */
  useLayoutEffect(() => {
    if (!userLoaded || !user?.id) return;
    const cached = readDashboardSessionCache(user.id);
    if (!cached) return;
    setCurrentAgent(cached.agent);
    setListings(cached.listings);
    setFavoriteApartments(cached.favorites);
    setListingsAgentId(cached.agent.id?.trim() ? cached.agent.id : null);
    setIsLoading(false);
  }, [userLoaded, user?.id]);

  useEffect(() => {
    if (!userLoaded) {
      return;
    }

    let cancelled = false;
    const ac = new AbortController();

    const run = async () => {
      const hadSessionCache =
        typeof window !== "undefined" &&
        Boolean(user?.id && readDashboardSessionCache(user.id));

      if (!hadSessionCache) {
        setIsLoading(true);
      }

      if (!user) {
        setCurrentAgent(FALLBACK_AGENT);
        setListings([]);
        setFavoriteApartments([]);
        setListingsAgentId(null);
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const token = await getToken();
        if (cancelled) return;
        if (!token) {
          setCurrentAgent(FALLBACK_AGENT);
          setListings([]);
          setFavoriteApartments([]);
          setListingsAgentId(null);
          setIsLoading(false);
          return;
        }

        const [agent, favoritesList] = await Promise.all([
          fetchAgentMe(token, ac.signal),
          fetchSavedListingApartments(token, ac.signal),
        ]);
        if (cancelled) return;

        const nextAgent = agent ?? FALLBACK_AGENT;
        setCurrentAgent(nextAgent);
        setFavoriteApartments(favoritesList);

        const agentId = nextAgent.id?.trim() ? nextAgent.id : null;
        setListingsAgentId(agentId);

        const nextListings = agentId
          ? await fetchListingsForAgent(token, agentId, ac.signal)
          : [];
        if (cancelled) return;

        setListings(nextListings);
        writeDashboardSessionCache(user.id, {
          agent: nextAgent,
          listings: nextListings,
          favorites: favoritesList,
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        debug.error("useDashboard", "bootstrap failed", {
          message: e instanceof Error ? e.message : "unknown",
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [userLoaded, user?.id, getToken]);

  const refreshListings = useCallback(async () => {
    const agentId = listingsAgentId;
    if (!agentId) return;
    try {
      const token = await getToken();
      if (!token) return;
      const next = await fetchListingsForAgent(token, agentId);
      setListings(next);
      const uid = userIdRef.current;
      if (uid) patchDashboardSessionListings(uid, next);
    } catch (e) {
      debug.error("useDashboard", "refreshListings failed", {
        message: e instanceof Error ? e.message : "unknown",
      });
    }
  }, [getToken, listingsAgentId]);

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter(
      (apt) =>
        apt.title.toLowerCase().includes(q) ||
        apt.location.toLowerCase().includes(q),
    );
  }, [listings, searchQuery]);

  const visibleFavorites = useMemo(
    () => favoriteApartments.filter((apt) => favorites.favoriteIds.has(apt.id)),
    [favoriteApartments, favorites.favoriteIds],
  );

  return {
    currentAgent,
    searchQuery,
    setSearchQuery,
    filteredListings,
    favoriteApartments: visibleFavorites,
    isLoading: !userLoaded || isLoading,
    refreshListings,
  };
}
