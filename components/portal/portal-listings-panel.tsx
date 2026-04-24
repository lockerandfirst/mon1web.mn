"use client";

import type { MarketplaceListing } from "@/lib/marketplace";

import { ApartmentCard } from "@/components/apartment-card";
import { ListingsGridSkeleton } from "@/components/skeletons";

/**
 * Агентын «Миний зарууд» таб — `agent_saling` хүснэгтээс татсан «Би заръя»-аар
 * хариуцсан зарууд харагдана.
 */
export function PortalListingsPanel({
  claimedSaleListings,
  initialDataLoading = false,
}: {
  claimedSaleListings: MarketplaceListing[];
  /** Эхний fetch дуусах хүртэл хоосон «зар алга»-г харуулахгүй. */
  initialDataLoading?: boolean;
}) {
  if (initialDataLoading && claimedSaleListings.length === 0) {
    return (
      <ListingsGridSkeleton className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3" />
    );
  }

  if (claimedSaleListings.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-[#2a00ff]/25 bg-linear-to-br from-white to-[#f7f5ff] p-6 text-center shadow-[0_24px_48px_-30px_rgba(42,0,255,0.45)] md:p-12">
        <p className="text-base font-black text-[#1a0b3b] md:text-lg">
          Зар одоогоор алга
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-600 md:text-sm">
          Таны худалдаалах хүсэлтэй байгаа зарууд энд харагдана.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {claimedSaleListings.map((apartment, index) => (
        <ApartmentCard
          key={`claimed-${apartment.id}`}
          apartment={apartment}
          index={index}
        />
      ))}
    </div>
  );
}
