"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Heart, MapPin, Search } from "lucide-react";
import { formatPrice, type Apartment } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  favorites: string[];
  filteredApartments: Apartment[];
  selectedId: string | null;
  onResetFilters: () => void;
  onSelectApartment: (id: string) => void;
  onToggleFavorite: (id: string, event: React.MouseEvent<HTMLElement>) => void;
};

export function MapListingsPanel({
  favorites,
  filteredApartments,
  selectedId,
  onResetFilters,
  onSelectApartment,
  onToggleFavorite,
}: Props) {
  return (
    <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto bg-slate-50/30 px-4 py-5 pt-2 scroll-smooth">
      {filteredApartments.length === 0 ? (
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
        <AnimatePresence mode="popLayout">
          {filteredApartments.map((apt) => (
            <motion.div
              layout
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => onSelectApartment(apt.id)}
              className={cn(
                "group relative cursor-pointer rounded-3xl border bg-white p-3 transition-all duration-300",
                selectedId === apt.id
                  ? "border-blue-600 shadow-xl ring-1 ring-blue-600"
                  : "border-slate-100 hover:shadow-lg",
              )}
            >
              <div className="flex gap-3">
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={apt.images[0]}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    alt={apt.title}
                  />
                  {apt.verified && (
                    <div className="absolute left-2 top-2 rounded-lg bg-white/90 p-1 backdrop-blur-md">
                      <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="truncate pr-2 text-[13px] font-black uppercase italic tracking-tight text-slate-900">
                        {apt.title}
                      </h3>
                      <button
                        type="button"
                        onClick={(event) => onToggleFavorite(apt.id, event)}
                        aria-label="Хадгалах"
                        className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-400 transition hover:bg-blue-100 hover:text-blue-600"
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
                    <p className="text-base font-black italic text-blue-600">
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
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
