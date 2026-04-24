"use client";

import { BadgeCheck, Heart, MapPin, Search, Star } from "lucide-react";
import { formatPrice, type Apartment } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

function MapListingRowSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-2 max-md:rounded-2xl max-md:p-2 md:rounded-3xl md:p-3">
      <div className="flex gap-2 max-md:gap-2 md:gap-3">
        <Skeleton className="h-20 w-24 shrink-0 rounded-xl max-md:h-20 max-md:w-24 md:h-24 md:w-28 md:rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-0.5">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-[90%] rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
          <div className="flex items-end justify-between gap-2 pt-1">
            <Skeleton className="h-5 w-24 rounded-md" />
            <div className="flex gap-1">
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-md" />
              <Skeleton className="h-6 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  favorites: string[];
  filteredApartments: Apartment[];
  isLoading?: boolean;
  selectedId: string | null;
  onResetFilters: () => void;
  onSelectApartment: (id: string) => void;
  onToggleFavorite: (id: string, event: React.MouseEvent<HTMLElement>) => void;
};

export function MapListingsPanel({
  className,
  favorites,
  filteredApartments,
  isLoading = false,
  selectedId,
  onResetFilters,
  onSelectApartment,
  onToggleFavorite,
}: Props) {
  return (
    <div
      aria-busy={isLoading}
      className={cn(
        "scrollbar-hide flex-1 space-y-2 lg:mb-0 mb-20 overflow-y-auto bg-slate-50/30 px-3 py-3 pt-1 scroll-smooth max-md:space-y-2 max-md:px-3 max-md:py-3 md:space-y-3 md:px-4 md:py-5 md:pt-2",
        className,
      )}
    >
      {isLoading ? (
        <div className="space-y-2 md:space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <MapListingRowSkeleton key={i} />
          ))}
        </div>
      ) : filteredApartments.length === 0 ? (
        <div className="flex h-full min-h-72 items-center justify-center">
          <div className="w-full rounded-[28px] border border-dashed border-slate-200 bg-white/90 px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-slate-900">
              Үр дүн олдсонгүй
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              Хайлтын нөхцөлөө бага зэрэг сулруулаад дахин үзэх эсвэл бүх
              шүүлтүүрийг цэвэрлэж бүх байрыг харна уу.
            </p>
            <Button
              onClick={onResetFilters}
              className="mt-5 h-10 rounded-xl bg-blue-600 px-4 text-[11px] font-black uppercase tracking-widest text-white hover:bg-blue-700"
            >
              Бүх шүүлтүүрийг цэвэрлэх
            </Button>
          </div>
        </div>
      ) : (
        <>
          {filteredApartments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onSelectApartment(apt.id)}
              className={cn(
                "group relative cursor-pointer rounded-2xl border bg-white p-2 transition-all duration-300 max-md:rounded-2xl max-md:p-2 md:rounded-3xl md:p-3",
                selectedId === apt.id
                  ? "border-blue-600 shadow-xl ring-1 ring-blue-600"
                  : "border-slate-100 hover:shadow-lg",
              )}
            >
              <div className="flex gap-2 max-md:gap-2 md:gap-3">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 max-md:h-20 max-md:w-24 md:h-24 md:w-28 md:rounded-2xl">
                  <SafeImage
                    src={apt.images[0]}
                    variant="listing"
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    alt={apt.title}
                  />
                  <div className="absolute left-2 top-2 flex items-center gap-1">
                    {apt.featured && (
                      <div className="rounded-lg bg-[#ff3bad]/95 p-1 backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                      </div>
                    )}
                    {apt.verified && (
                      <div className="rounded-lg bg-white/90 p-1 backdrop-blur-md">
                        <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="truncate pr-1 text-[11px] font-black uppercase italic leading-tight tracking-tight text-slate-900 max-md:text-[11px] md:pr-2 md:text-[13px]">
                        {apt.title}
                      </h3>
                      <button
                        type="button"
                        onClick={(event) => onToggleFavorite(apt.id, event)}
                        aria-label="Хадгалах"
                        className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-400 transition hover:bg-blue-100 hover:text-blue-600 max-md:h-7 max-md:w-7 md:ml-1 md:h-8 md:w-8"
                      >
                        <Heart
                          className={cn(
                            "h-4.5 w-4.5",
                            favorites.includes(apt.id)
                              ? "fill-blue-600 text-blue-600"
                              : "text-blue-400",
                          )}
                        />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      {apt.district}
                    </div>
                  </div>

                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-sm font-black italic text-blue-600 max-md:text-sm md:text-base">
                      {formatPrice(apt.price)}
                    </p>
                    <div className="flex flex-wrap justify-end gap-1 text-[9px] font-black uppercase italic text-slate-500">
                      <span className="rounded-md bg-slate-50 px-1.5 py-1">
                        өрөө {apt.rooms}
                      </span>
                      <span className="rounded-md bg-slate-50 px-1.5 py-1">
                        {apt.floor}/{apt.totalFloors} д.
                      </span>
                      <span className="rounded-md bg-slate-50 px-1.5 py-1">
                        {apt.sqm}м²
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
