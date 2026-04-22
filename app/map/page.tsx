"use client";

import { type MouseEvent, useState } from "react";
import { List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapCanvas } from "./components/MapCanvas";
import { MapFilterPanel } from "./components/MapFilterPanel";
import { MapListingsPanel } from "./components/MapListingsPanel";
import { MapSelectedApartmentCard } from "./components/MapSelectedApartmentCard";
import { useMapFilters } from "./use-map-filters";

export default function MapPage() {
  const filters = useMapFilters();
  const [mobilePanelTab, setMobilePanelTab] = useState<"filters" | "list">(
    "filters",
  );

  const toggleFavorite = (id: string, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    filters.setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#FDFCFB] md:h-screen">
      <main className="relative flex min-h-0 flex-1 overflow-hidden">
        {filters.showListings && (
          <button
            type="button"
            aria-label="Шүүлтүүрийн самбар хаах"
            onClick={() => filters.setShowListings(false)}
            className="absolute inset-0 z-20 bg-[#2a00ff]/25 backdrop-blur-[1px] md:hidden"
          />
        )}

        <aside
          className={cn(
            "absolute bottom-0 left-0  bg-white top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-30 flex w-[min(94vw,22rem)] max-w-sm flex-col overflow-hidden border-r border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:relative md:top-0 md:h-full md:w-105 md:max-w-none",
            filters.showListings
              ? "translate-x-0"
              : "pointer-events-none -translate-x-[105%]",
          )}
        >
          <div className="flex h-full min-w-0 flex-col bg-white md:min-w-105">
            <div className="border-b border-slate-100 bg-white p-2 md:hidden">
              <button
                type="button"
                aria-label="Хажуу самбарыг хаах"
                onClick={() => filters.setShowListings(false)}
                className="absolute right-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2a00ff] shadow transition hover:bg-[#f3f0fe] md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                <Button
                  type="button"
                  variant={mobilePanelTab === "filters" ? "default" : "ghost"}
                  onClick={() => setMobilePanelTab("filters")}
                  className="h-9 rounded-xl text-[11px] font-black uppercase tracking-wide"
                >
                  Шүүлтүүр
                </Button>
                <Button
                  type="button"
                  variant={mobilePanelTab === "list" ? "default" : "ghost"}
                  onClick={() => setMobilePanelTab("list")}
                  className="h-9 rounded-xl text-[11px] font-black uppercase tracking-wide"
                >
                  Жагсаалт ({filters.filteredApartments.length})
                </Button>
              </div>
            </div>

            <MapFilterPanel
              activeFilterBadges={filters.activeFilterBadges}
              category={filters.category}
              districtFilter={filters.districtFilter}
              floorRange={filters.floorRange}
              hasElevator={filters.hasElevator}
              isCommissioned={filters.isCommissioned}
              onCategoryChange={filters.setCategory}
              onDistrictChange={filters.setDistrictFilter}
              onFloorRangeChange={filters.setFloorRange}
              onHasElevatorChange={filters.setHasElevator}
              onIsCommissionedChange={filters.setIsCommissioned}
              onPaymentMethodChange={filters.setPaymentMethod}
              onPriceRangeChange={filters.setPriceRange}
              onRemoveFilter={filters.removeFilter}
              onRentSubcategoryChange={filters.setRentSubcategory}
              onResetFilters={filters.resetFilters}
              onRoomChange={filters.setRoomFilter}
              onSearchChange={filters.setSearchQuery}
              onSqmRangeChange={filters.setSqmRange}
              onYearRangeChange={filters.setYearRange}
              paymentMethod={filters.paymentMethod}
              priceRange={filters.priceRange}
              rentSubcategory={filters.rentSubcategory}
              resultCount={filters.filteredApartments.length}
              roomFilter={filters.roomFilter}
              searchQuery={filters.searchQuery}
              sqmRange={filters.sqmRange}
              yearRange={filters.yearRange}
              className={cn(mobilePanelTab !== "filters" && "max-md:hidden")}
            />

            <MapListingsPanel
              favorites={filters.favorites}
              filteredApartments={filters.filteredApartments}
              onResetFilters={filters.resetFilters}
              onSelectApartment={filters.setSelectedId}
              onToggleFavorite={toggleFavorite}
              selectedId={filters.selectedId}
              className={cn(mobilePanelTab !== "list" && "max-md:hidden")}
            />
          </div>
        </aside>

        <div className="relative z-10 flex-1 overflow-hidden bg-slate-100">
          {/* Доор нь байрлуулна: тогтмол header (z-9999) дээр товч дарагдахгүй */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-5000 max-md:pt-[calc(0.5rem+4.35rem+env(safe-area-inset-top,0px))] md:static md:z-auto md:pt-0">
            <div className="pointer-events-auto flex justify-start px-3 md:absolute md:left-6 md:top-6 md:px-0">
              <Button
                variant="outline"
                onClick={() => {
                  const next = !filters.showListings;
                  filters.setShowListings(next);
                  if (next) setMobilePanelTab("filters");
                }}
                className="h-9 gap-2 rounded-xl border-none bg-white px-3 text-slate-700 shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-50 active:scale-95 max-md:shadow-lg md:h-12 md:w-12 md:gap-0 md:px-0 md:shadow-xl"
              >
                {filters.showListings ? (
                  <X className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
                ) : (
                  <>
                    <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#2a00ff] md:hidden" />
                    <List className="hidden h-5 w-5 shrink-0 md:block" />
                  </>
                )}
                <span className="text-[11px] font-black uppercase tracking-wide max-md:inline md:hidden">
                  {filters.showListings ? "Хаах" : "Шүүлтүүр"}
                </span>
              </Button>
            </div>
          </div>

          <MapCanvas
            apartments={filters.filteredApartments}
            selectedId={filters.selectedId}
            onSelectApartment={filters.setSelectedId}
          />

          <MapSelectedApartmentCard
            apartment={filters.selectedApartment}
            onClose={() => filters.setSelectedId(null)}
          />
        </div>
      </main>
    </div>
  );
}
