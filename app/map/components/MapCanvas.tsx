"use client";

import dynamic from "next/dynamic";
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
  selectedId: string | null;
  onSelectApartment: (id: string | null) => void;
};

export function MapCanvas({ apartments, selectedId, onSelectApartment }: Props) {
  return (
    <MapView
      apartments={apartments}
      selectedId={selectedId}
      onSelectApartment={onSelectApartment}
    />
  );
}
