// hooks/use-featured-apartments.ts
import { useState, useEffect } from "react";
import { apartments } from "@/lib/data";
import {
  readMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";

export function useFeaturedApartments(limit = 3) {
  const [data, setData] = useState<
    (MarketplaceListing | (typeof apartments)[0])[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const marketplace = readMarketplaceListings()
        .filter((listing) => listing.workflowStatus === "published")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      const combined = [
        ...marketplace,
        ...apartments.filter((apt) => apt.featured),
      ].slice(0, limit);

      setData(combined);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  return { data, isLoading };
}
