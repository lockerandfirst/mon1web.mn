import { useState, useEffect, useMemo } from "react";
import { apartments, agents } from "@/lib/data";
import {
  readMarketplaceListings,
  publishMarketplaceListing,
  writeMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";
import {
  readBuyRequests,
  writeBuyRequests,
  claimBuyRequest,
  getBuyRequestBudgetLabel,
  type BuyRequest,
} from "@/lib/buy-requests";

export function useDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const currentAgent = agents[0];

  useEffect(() => {
    setMarketplaceListings(readMarketplaceListings());
    setBuyRequests(readBuyRequests());
    setFavorites(["1", "3", "5"]);
  }, []);

  const agentListings = useMemo(
    () => [
      ...marketplaceListings.filter(
        (l) =>
          l.workflowStatus === "published" && l.agent.id === currentAgent.id,
      ),
      ...apartments.filter((apt) => apt.agent.id === currentAgent.id),
    ],
    [marketplaceListings, currentAgent.id],
  );

  const filteredListings = agentListings.filter(
    (apt) =>
      apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userRequests = marketplaceListings.filter(
    (l) => l.workflowStatus === "pending",
  );
  const buyerRequests = buyRequests.filter(
    (request) => request.workflowStatus === "open",
  );

  const actions = {
    handleClaimListing: (id: string) => {
      const next = publishMarketplaceListing(
        id,
        currentAgent,
        marketplaceListings,
      );
      writeMarketplaceListings(next);
      setMarketplaceListings(next);
    },
    handleClaimBuyRequest: (id: string) => {
      const next = claimBuyRequest(id, currentAgent, buyRequests);
      writeBuyRequests(next);
      setBuyRequests(next);
    },
  };

  return {
    currentAgent,
    searchQuery,
    setSearchQuery,
    filteredListings,
    userRequests,
    buyerRequests,
    favoriteApartments: apartments.filter((apt) => favorites.includes(apt.id)),
    totalIncoming: userRequests.length + buyerRequests.length,
    getBuyRequestBudgetLabel,
    actions,
  };
}
