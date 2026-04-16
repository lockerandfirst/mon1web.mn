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
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-black text-[#1a0b3b]">Зар одоогоор алга</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Шинэ зар нэмснээр энд харагдана.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
