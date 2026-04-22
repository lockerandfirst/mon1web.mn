"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { ApartmentCard } from "@/components/apartment-card";
import { apiFetch } from "@/lib/backend-api";
import type { Agent, Apartment } from "@/lib/data";
import type { MarketplaceListing } from "@/lib/marketplace";
import {
  listerDisplayAgentFromProfile,
  marketplaceListingFromSupabaseListing,
} from "@/lib/portal/supabase-listing-to-marketplace";

export function SaleRequestFeed({
  listings,
  connectedAgent,
  onRefresh,
}: {
  listings: MarketplaceListing[];
  connectedAgent: Agent | null;
  onRefresh: () => void;
}) {
  const { getToken } = useAuth();
  const canAct = Boolean(connectedAgent);
  const [remoteListings, setRemoteListings] = useState<MarketplaceListing[]>(listings);
  const [claimingListingId, setClaimingListingId] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(listings.length === 0);
  const [hasFetchedOnce, setHasFetchedOnce] = useState<boolean>(false);

  const loadSearchingAgent = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        // Token хараахан бэлэн болоогүй үед empty-state рүү унагахгүй.
        return;
      }

      const response = await apiFetch<{
        data: Array<{
          id: string;
          property_id: string;
          created_at: string;
          listings: Record<string, unknown> | null;
          profiles:
            | { full_name?: string | null; email?: string | null; phone?: string | null }
            | null;
        }>;
      }>("/api/searching-agent?limit=100", { token });

      const fallbackAgent: Agent = {
        id: "unknown",
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

      const mapped = response.data
        .map((row): MarketplaceListing | null => {
          const listing = row.listings as Record<string, unknown> | null;
          const submittedByOverride = {
            name: row.profiles?.full_name || "Хэрэглэгч",
            email: row.profiles?.email || "user@mon1.local",
            phone: row.profiles?.phone || undefined,
          };
          const listerDisplayAgent = listerDisplayAgentFromProfile(
            submittedByOverride.name,
            submittedByOverride.email,
            submittedByOverride.phone,
          );
          return marketplaceListingFromSupabaseListing(listing, {
            connectedAgent: connectedAgent ?? fallbackAgent,
            listerDisplayAgent,
            createdAtFallback: row.created_at,
            submittedByOverride,
          });
        })
        .filter((item): item is MarketplaceListing => Boolean(item));

      setRemoteListings(mapped);
      setHasFetchedOnce(true);
    } catch {
      console.log("[SaleRequestFeed] /api/searching-agent failed");
      setHasFetchedOnce(true);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (listings.length > 0) {
      setRemoteListings(listings);
      setIsLoading(false);
      setHasFetchedOnce(true);
    }
  }, [listings]);

  useEffect(() => {
    void loadSearchingAgent();
  }, [loadSearchingAgent]);

  const sorted = useMemo(
    () => [...remoteListings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [remoteListings],
  );

  const claimListing = async (listing: MarketplaceListing) => {
    if (!connectedAgent || !canAct) {
      return;
    }
    setClaimError(null);
    setClaimingListingId(listing.id);
    try {
      const token = await getToken();
      if (!token) {
        setClaimError("Нэвтэрнэ үү.");
        return;
      }
      await apiFetch("/api/agent-saling", {
        method: "POST",
        token,
        body: { listingId: listing.id },
      });
      onRefresh();
      await loadSearchingAgent();
    } catch (e) {
      let message = "Алдаа гарлаа.";
      if (e instanceof Error) {
        try {
          const parsed = JSON.parse(e.message) as { error?: string };
          if (parsed?.error) {
            message = parsed.error;
          }
        } catch {
          message = e.message || message;
        }
      }
      setClaimError(message);
    } finally {
      setClaimingListingId(null);
    }
  };

  const handleBiZarya = (apartment: Apartment) => {
    void claimListing(apartment as MarketplaceListing);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {claimError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-semibold text-red-700 md:text-sm">
          {claimError}
        </p>
      ) : null}
      {!hasFetchedOnce ? null : sorted.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm md:p-12">
          <p className="text-base font-black text-[#1a0b3b] md:text-lg">
            Одоогоор агент хайж буй зар алга
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-500 md:text-sm">
            Хэрэглэгч &quot;Агентаар заруулах&quot; сонгоход энд харагдана.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {sorted.map((listing) => (
            <div key={listing.id} className="relative">
              <ApartmentCard
                apartment={listing}
                agentDisplayMode="user"
                actionLabel={
                  claimingListingId === listing.id ? "Түр хүлээнэ үү…" : "Би заръя"
                }
                onActionClick={canAct && connectedAgent ? handleBiZarya : undefined}
              />
              {!canAct ? (
                <p className="mt-2 text-center text-[11px] font-semibold text-slate-400 md:mt-3 md:text-xs">
                  Зөвхөн баталгаажсан агент үйлдэл хийж болно.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
