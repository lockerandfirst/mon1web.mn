import { useState, useEffect, useMemo } from "react";
import { apartments, agents } from "@/lib/data";
import {
  readMarketplaceListings,
  writeMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";

export function useDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const currentAgent = agents[0];

  useEffect(() => {
    setMarketplaceListings(readMarketplaceListings());
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

  return {
    currentAgent,
    searchQuery,
    setSearchQuery,
    filteredListings,
    favoriteApartments: apartments.filter((apt) => favorites.includes(apt.id)),
  };
}
