"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

import type { AgentPortalPickListing } from "@/components/portal/portal-types";
import { MOCK_SALE_REQUESTS } from "@/components/portal/mock-sale-requests";
import { apartments, agents } from "@/lib/data";
import type { BuyRequest } from "@/lib/buy-requests";
import { readBuyRequests } from "@/lib/buy-requests";
import type { MarketplaceListing } from "@/lib/marketplace";
import { readMarketplaceListings } from "@/lib/marketplace";

function normalizeEmail(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function reloadOpenBuyRequests(): BuyRequest[] {
  return readBuyRequests()
    .filter((r) => r.workflowStatus === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function listingInSaleAgentFeed(
  listing: MarketplaceListing,
  connectedAgent: (typeof agents)[number] | null,
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
  const [marketplaceRaw, setMarketplaceRaw] = useState<MarketplaceListing[]>(
    [],
  );
  const [buyRequestsRaw, setBuyRequestsRaw] = useState<BuyRequest[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    const liveListings = readMarketplaceListings();
    setMarketplaceRaw(
      liveListings.length > 0 ? liveListings : MOCK_SALE_REQUESTS,
    );
    setBuyRequestsRaw(reloadOpenBuyRequests());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  const email = normalizeEmail(user?.primaryEmailAddress?.emailAddress);

  const connectedAgent = useMemo(
    () => agents.find((a) => normalizeEmail(a.email) === email) ?? null,
    [email],
  );

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
    const liveFeed = marketplaceRaw.filter((l) =>
      listingInSaleAgentFeed(l, connectedAgent),
    );
    if (liveFeed.length > 0) {
      return liveFeed;
    }
    return MOCK_SALE_REQUESTS.filter((l) =>
      listingInSaleAgentFeed(l, connectedAgent),
    );
  }, [mounted, marketplaceRaw, connectedAgent]);

  const agentPickListings = useMemo((): AgentPortalPickListing[] => {
    if (!mounted || !connectedAgent) {
      return [];
    }
    const rows: AgentPortalPickListing[] = catalog.map((a) => ({
      id: a.id,
      title: a.title,
      district: a.district,
      price: a.price,
      source: "catalog",
    }));
    for (const l of marketplace) {
      rows.push({
        id: l.id,
        title: l.title,
        district: l.district,
        price: l.price,
        source: "marketplace",
      });
    }
    return rows;
  }, [mounted, connectedAgent, catalog, marketplace]);

  return {
    userLoaded,
    mounted,
    marketplace,
    catalog,
    buyRequestsSeekingAgent,
    saleFeedListings,
    agentPickListings,
    connectedAgent,
    refresh,
  };
}
