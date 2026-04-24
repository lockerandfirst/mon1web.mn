"use client";

import dynamic from "next/dynamic";
import type { MapBoundsLiteral } from "@/app/map/map-bounds";
import { type Apartment } from "@/lib/data";

const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600/20 border-t-blue-600" />
          <p className="text-[10px] font-black uppercase tracking-widest italic text-slate-400">
            Газрын зураг ачаалж байна...
          </p>
        </div>
      </div>
    ),
  },
);

type Props = {
  apartments: Apartment[];
  isLoadingListings?: boolean;
  onMapBoundsChange?: (bounds: MapBoundsLiteral) => void;
  selectedId: string | null;
  onSelectApartment: (id: string | null) => void;
};

export function MapCanvas({
  apartments,
  isLoadingListings = false,
  onMapBoundsChange,
  selectedId,
  onSelectApartment,
}: Props) {
  return (
    <div className="relative h-full w-full min-h-0">
      <MapView
        apartments={apartments}
        onBoundsChange={onMapBoundsChange}
        selectedId={selectedId}
        onSelectApartment={onSelectApartment}
      />
      {isLoadingListings ? (
        <div
          className="absolute inset-0 z-[400] flex flex-col items-center justify-center gap-3 bg-slate-100/85 backdrop-blur-[2px]"
          aria-busy="true"
          aria-label="Зарууд ачаалж байна"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600/20 border-t-blue-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Зарууд ачаалж байна...
          </p>
        </div>
      ) : null}
    </div>
  );
}
