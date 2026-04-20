"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { apartments } from "@/lib/data";
import {
  inferPropertyCategory,
  inferRentSubcategory,
} from "@/lib/property-types";
import {
  readMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";
import {
  DEFAULT_PRICE_RANGE,
  DEFAULT_SQM_RANGE,
  getPriceRangeFromParam,
  matchesCountFilter,
  matchesKeywordSearch,
  normalizeKeyword,
  type PaymentFilter,
} from "@/lib/listings-query";

export function useListingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
  const [sqmRange, setSqmRange] = useState<number[]>(DEFAULT_SQM_RANGE);
  const [category, setCategory] = useState("");
  const [rentSubcategory, setRentSubcategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentFilter>("any");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [district, setDistrict] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [publishedListings, setPublishedListings] = useState<
    MarketplaceListing[]
  >([]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? "down" : "up";
    if (direction === "down" && latest > 150) setIsHeaderVisible(false);
    else setIsHeaderVisible(true);
    setLastScrollY(latest);
  });

  useEffect(() => {
    setPublishedListings(
      readMarketplaceListings().filter((l) => l.workflowStatus === "published"),
    );
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q")?.trim() ?? "");
    setCategory(
      searchParams.get("category") === "all"
        ? ""
        : (searchParams.get("category") ?? ""),
    );
    setRentSubcategory(searchParams.get("rentType") ?? "");
    setPriceRange(getPriceRangeFromParam(searchParams.get("price")));
    setRooms(searchParams.get("rooms") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (category !== "rent" && rentSubcategory) {
      setRentSubcategory("");
    }
  }, [category, rentSubcategory]);

  useEffect(() => {
    if (category === "rent" && paymentMethod !== "any") {
      setPaymentMethod("any");
    }
  }, [category, paymentMethod]);

  const allApartments = useMemo(
    () => [...publishedListings, ...apartments],
    [publishedListings],
  );

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const applyKeywordSearch = () => {
    const normalizedQuery = normalizeKeyword(searchQuery);
    setSearchQuery(normalizedQuery);
    updateQueryParams({ q: normalizedQuery || null });
  };

  const filteredItems = useMemo(() => {
    return allApartments
      .filter((apt) => {
        const matchesSearch = matchesKeywordSearch(apt, searchQuery);
        const matchesPrice =
          apt.price >= priceRange[0] && apt.price <= priceRange[1];
        const matchesSqm = apt.sqm >= sqmRange[0] && apt.sqm <= sqmRange[1];
        const matchesCategory =
          !category || inferPropertyCategory(apt) === category;
        const matchesRentSubcategory =
          !rentSubcategory || inferRentSubcategory(apt) === rentSubcategory;
        const matchesPaymentMethod =
          paymentMethod === "any" ||
          apt.paymentMethod === "any" ||
          apt.paymentMethod === paymentMethod;
        const matchesRooms = matchesCountFilter(apt.rooms, rooms);
        const matchesBathrooms = matchesCountFilter(apt.bathrooms, bathrooms);
        const matchesDistrict =
          !district || district === "any" || apt.district === district;
        return (
          matchesSearch &&
          matchesPrice &&
          matchesSqm &&
          matchesCategory &&
          matchesRentSubcategory &&
          matchesPaymentMethod &&
          matchesRooms &&
          matchesBathrooms &&
          matchesDistrict
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [
    allApartments,
    searchQuery,
    priceRange,
    sqmRange,
    category,
    rentSubcategory,
    paymentMethod,
    rooms,
    bathrooms,
    district,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSqmRange(DEFAULT_SQM_RANGE);
    setCategory("");
    setRentSubcategory("");
    setPaymentMethod("any");
    setRooms("");
    setBathrooms("");
    setDistrict("");
    updateQueryParams({
      q: null,
      category: null,
      rentType: null,
      price: null,
      rooms: null,
    });
  };

  return {
    searchInputRef,
    isHeaderVisible,
    isSearchFocused,
    setIsSearchFocused,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sqmRange,
    setSqmRange,
    category,
    setCategory,
    rentSubcategory,
    setRentSubcategory,
    paymentMethod,
    setPaymentMethod,
    rooms,
    setRooms,
    bathrooms,
    setBathrooms,
    district,
    setDistrict,
    sortBy,
    setSortBy,
    applyKeywordSearch,
    filteredItems,
    clearFilters,
  };
}
