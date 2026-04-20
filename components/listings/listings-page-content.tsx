"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useListingsPage } from "@/hooks/use-listings-page";
import { ListingsSearchBar } from "@/components/listings/listings-search-bar";
import { ListingsFiltersForm } from "@/components/listings/listings-filters-form";
import { ListingsResultsPanel } from "@/components/listings/listings-results-panel";
import { cn } from "@/lib/utils";

export function ListingsPageContent() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const p = useListingsPage();

  const handleClearFilters = () => {
    p.clearFilters();
    setFiltersOpen(false);
  };

  const filterProps = {
    category: p.category,
    setCategory: p.setCategory,
    rentSubcategory: p.rentSubcategory,
    setRentSubcategory: p.setRentSubcategory,
    district: p.district,
    setDistrict: p.setDistrict,
    paymentMethod: p.paymentMethod,
    setPaymentMethod: p.setPaymentMethod,
    rooms: p.rooms,
    setRooms: p.setRooms,
    bathrooms: p.bathrooms,
    setBathrooms: p.setBathrooms,
    sqmRange: p.sqmRange,
    setSqmRange: p.setSqmRange,
    priceRange: p.priceRange,
    setPriceRange: p.setPriceRange,
    clearFilters: handleClearFilters,
  };

  return (
    <div className="min-h-screen bg-[#fff9fd] selection:bg-[#2a00ff]/10">
      <main className="container mx-auto px-4 py-8 max-lg:px-3 max-lg:py-4 max-lg:pb-24 lg:py-10">
        <div className="grid grid-cols-1 gap-6 max-lg:gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8">
          <ListingsSearchBar
            isHeaderVisible={p.isHeaderVisible}
            isSearchFocused={p.isSearchFocused}
            setIsSearchFocused={p.setIsSearchFocused}
            searchInputRef={p.searchInputRef}
            searchQuery={p.searchQuery}
            setSearchQuery={p.setSearchQuery}
            applyKeywordSearch={p.applyKeywordSearch}
          />

          <aside className="hidden shrink-0 self-start lg:block lg:w-80 lg:row-start-2 lg:sticky lg:top-28 lg:-mt-24">
            <ListingsFiltersForm {...filterProps} />
          </aside>

          <ListingsResultsPanel
            category={p.category}
            viewMode={p.viewMode}
            setViewMode={p.setViewMode}
            sortBy={p.sortBy}
            setSortBy={p.setSortBy}
            filteredItems={p.filteredItems}
            clearFilters={handleClearFilters}
          />
        </div>
      </main>

      <Button
        type="button"
        variant="default"
        onClick={() => setFiltersOpen(true)}
        className={cn(
          "fixed left-1/2 z-[10100] h-12 -translate-x-1/2 touch-manipulation gap-2 rounded-full bg-[#2a00ff] px-6 font-black text-white shadow-xl",
          "bottom-[max(5.5rem,env(safe-area-inset-bottom,0px)+4.25rem)] lg:hidden",
        )}
      >
        <Settings2 className="h-5 w-5" />
        Шүүлтүүр
      </Button>

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen} repositionInputs={false}>
        <DrawerContent
          className={cn(
            "max-h-[90dvh] border-0 bg-[#fff9fd] p-0",
            "pb-[max(env(safe-area-inset-bottom),0.75rem)]",
          )}
        >
          <DrawerTitle className="sr-only">Шүүлтүүр</DrawerTitle>
          <div className="max-h-[min(78dvh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain px-3 pt-2">
            <ListingsFiltersForm
              {...filterProps}
              className="border-0 shadow-none"
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Footer />
    </div>
  );
}
