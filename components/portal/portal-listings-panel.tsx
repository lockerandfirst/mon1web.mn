"use client";

import type { Apartment } from "@/lib/data";
import type { MarketplaceListing } from "@/lib/marketplace";

import { ApartmentCard } from "@/components/apartment-card";

export function PortalListingsPanel({
  marketplace,
  catalog,
  claimedSaleListings,
}: {
  marketplace: MarketplaceListing[];
  catalog: Apartment[];
  /** `agent_saling` — «Би заръя»-аар хадгалсан зарууд */
  claimedSaleListings: MarketplaceListing[];
}) {
  const marketplaceIds = new Set(marketplace.map((l) => l.id));
  const claimedOnly = claimedSaleListings.filter(
    (l) => !marketplaceIds.has(l.id),
  );
  const total = claimedOnly.length;

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-5 text-center shadow-sm md:p-12">
        <p className="text-base font-black text-[#1a0b3b] md:text-lg">
          Зар одоогоор алга
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-500 md:text-sm">
          «Зарна» табаас «Би заръя» дарж хариуцсан зарууд энд харагдана.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {claimedOnly.map((apartment, index) => (
        <ApartmentCard
          key={`claimed-${apartment.id}`}
          apartment={apartment}
          index={marketplace.length + index}
        />
      ))}
    </div>
  );
}
