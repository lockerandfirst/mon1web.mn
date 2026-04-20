"use client";

import type { Apartment } from "@/lib/data";
import type { MarketplaceListing } from "@/lib/marketplace";

import { ApartmentCard } from "@/components/apartment-card";

export function PortalListingsPanel({
  marketplace,
  catalog,
}: {
  marketplace: MarketplaceListing[];
  catalog: Apartment[];
}) {
  const total = marketplace.length + catalog.length;

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-5 text-center shadow-sm md:p-12">
        <p className="text-base font-black text-[#1a0b3b] md:text-lg">
          Зар одоогоор алга
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-500 md:text-sm">
          Шинэ зар нэмснээр энд харагдана.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {marketplace.map((apartment, index) => (
        <ApartmentCard key={apartment.id} apartment={apartment} index={index} />
      ))}
      {catalog.map((apartment, index) => (
        <ApartmentCard
          key={apartment.id}
          apartment={apartment}
          index={marketplace.length + index}
        />
      ))}
    </div>
  );
}
