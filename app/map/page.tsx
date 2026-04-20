"use client";

import { type MouseEvent } from "react";
import { List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapCanvas } from "./components/MapCanvas";
import { MapFilterPanel } from "./components/MapFilterPanel";
import { MapListingsPanel } from "./components/MapListingsPanel";
import { MapSelectedApartmentCard } from "./components/MapSelectedApartmentCard";
import { useMapFilters } from "./use-map-filters";

export default function MapPage() {
  const filters = useMapFilters();

  const toggleFavorite = (id: string, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    filters.setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FDFCFB]">
      <main className="relative flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-30 flex h-full w-[88%] max-w-sm flex-col overflow-hidden border-r border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:relative md:w-105 md:max-w-none",
            filters.showListings
              ? "translate-x-0"
              : "pointer-events-none -translate-x-[105%]",
          )}
        >
          <div className="flex h-full min-w-0 flex-col bg-white md:min-w-105">
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
            />

            <MapListingsPanel
              favorites={filters.favorites}
              filteredApartments={filters.filteredApartments}
              onResetFilters={filters.resetFilters}
              onSelectApartment={filters.setSelectedId}
              onToggleFavorite={toggleFavorite}
              selectedId={filters.selectedId}
            />
          </div>
        </aside>

        <div className="relative z-10 flex-1 overflow-hidden bg-slate-100">
          <div className="absolute left-4 top-4 z-40 md:left-6 md:top-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => filters.setShowListings(!filters.showListings)}
              className="h-12 w-12 rounded-2xl border-none bg-white text-slate-600 shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {!filters.showListings ? (
                <List className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
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
