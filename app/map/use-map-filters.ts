"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Apartment } from "@/lib/data";
import { apiFetch } from "@/lib/backend-api";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";
import { inferPropertyCategory, inferRentSubcategory } from "@/lib/property-types";
import { boundsForMapListingsQuery, type MapBoundsLiteral } from "./map-bounds";
import {
  mapBoundsQueryCacheKey,
  markMapListingsFetched,
  mergeMapListingsIntoCache,
  pickListingsInQueryBounds,
  shouldSkipMapListingFetch,
} from "./map-listings-cache";
import {
  ActiveFilterBadge,
  ActiveFilterBadgeKey,
  categoryFilterLabels,
  CURRENT_YEAR,
  MAX_COMMISSION_YEAR,
  MAX_FLOOR,
  MAX_PRICE_MILLION,
  MAX_SQM,
  MIN_COMMISSION_YEAR,
  PaymentFilter,
  paymentFilterLabels,
  RentSubcategoryFilter,
  ternaryFilterLabels,
  TernaryFilter,
  CategoryFilter,
} from "./map-config";

function apartmentHasElevator(apartment: Apartment) {
  return apartment.features.some((feature) =>
    feature.toLowerCase().includes("elevator"),
  );
}

function apartmentIsCommissioned(apartment: Apartment) {
  return apartment.commissionYear <= CURRENT_YEAR;
}

const MAP_LISTINGS_LIMIT = 400;
const BOUNDS_DEBOUNCE_MS = 320;

function isAbortError(e: unknown) {
  return (
    (e instanceof DOMException && e.name === "AbortError") ||
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as { name: string }).name === "AbortError")
  );
}

export function useMapFilters() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomFilter, setRoomFilter] = useState<string>("any");
  const [districtFilter, setDistrictFilter] = useState<string>("any");
  const [showListings, setShowListings] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, MAX_PRICE_MILLION]);
  const [sqmRange, setSqmRange] = useState<number[]>([0, MAX_SQM]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentFilter>("any");
  const [hasElevator, setHasElevator] = useState<TernaryFilter>("any");
  /** Include 0 so listings without `floor` in DB (stored as 0) are not excluded by default. */
  const [floorRange, setFloorRange] = useState<number[]>([0, MAX_FLOOR]);
  const [yearRange, setYearRange] = useState<number[]>([
    MIN_COMMISSION_YEAR,
    MAX_COMMISSION_YEAR,
  ]);
  const [isCommissioned, setIsCommissioned] = useState<TernaryFilter>("any");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [rentSubcategory, setRentSubcategory] =
    useState<RentSubcategoryFilter>("any");

  const fetchSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstBoundsHandledRef = useRef(false);
  const firstLoadFinishedRef = useRef(false);

  const loadListingsForBounds = useCallback(async (bounds: MapBoundsLiteral) => {
    const queryBounds = boundsForMapListingsQuery(bounds);
    const boundsKey = mapBoundsQueryCacheKey(queryBounds);

    const fromCache = pickListingsInQueryBounds(queryBounds);
    if (fromCache.length > 0) {
      setApartments(fromCache);
    }

    if (shouldSkipMapListingFetch(boundsKey)) {
      if (fromCache.length === 0) {
        setApartments([]);
      }
      if (!firstLoadFinishedRef.current) {
        firstLoadFinishedRef.current = true;
        setIsLoadingListings(false);
      }
      return;
    }

    if (fromCache.length === 0) {
      setApartments([]);
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const seq = ++fetchSeqRef.current;

    const qs = new URLSearchParams({
      minLat: String(queryBounds.south),
      maxLat: String(queryBounds.north),
      minLng: String(queryBounds.west),
      maxLng: String(queryBounds.east),
      limit: String(MAP_LISTINGS_LIMIT),
    });

    try {
      const response = await apiFetch<{
        success: boolean;
        data: Record<string, unknown>[];
      }>(`/api/listings/map?${qs.toString()}`, { signal: ac.signal });

      if (seq !== fetchSeqRef.current) return;

      const mapped = (response.data ?? []).map(
        (row) => apartmentFromApiListing(row).apartment,
      );
      mergeMapListingsIntoCache(mapped);
      markMapListingsFetched(boundsKey);
      setApartments(pickListingsInQueryBounds(queryBounds));
    } catch (e: unknown) {
      if (isAbortError(e) || seq !== fetchSeqRef.current) return;
      setApartments((prev) => (prev.length > 0 ? prev : []));
    } finally {
      if (seq !== fetchSeqRef.current) return;
      if (!firstLoadFinishedRef.current) {
        firstLoadFinishedRef.current = true;
        setIsLoadingListings(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowListings(window.innerWidth >= 768);
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const onMapBoundsChange = useCallback((bounds: MapBoundsLiteral) => {
    if (!firstBoundsHandledRef.current) {
      firstBoundsHandledRef.current = true;
      void loadListingsForBounds(bounds);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      void loadListingsForBounds(bounds);
    }, BOUNDS_DEBOUNCE_MS);
  }, [loadListingsForBounds]);

  useEffect(() => {
    if (category !== "rent" && rentSubcategory !== "any") {
      setRentSubcategory("any");
    }
  }, [category, rentSubcategory]);

  const filteredApartments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return apartments.filter((apt) => {
      const inferredCategory = inferPropertyCategory(apt);
      const inferredRentSubcategory = inferRentSubcategory(apt);
      const matchesSearch =
        !normalizedQuery ||
        apt.title.toLowerCase().includes(normalizedQuery) ||
        apt.location.toLowerCase().includes(normalizedQuery) ||
        apt.district.toLowerCase().includes(normalizedQuery);
      const matchesDistrict =
        districtFilter === "any" || apt.district === districtFilter;
      const matchesRooms =
        roomFilter === "any" ||
        (roomFilter === "4+"
          ? apt.rooms >= 4
          : apt.rooms === Number.parseInt(roomFilter, 10));
      const matchesPrice =
        apt.price >= priceRange[0] * 1_000_000 &&
        apt.price <= priceRange[1] * 1_000_000;
      const matchesSqm = apt.sqm >= sqmRange[0] && apt.sqm <= sqmRange[1];
      const matchesPayment =
        paymentMethod === "any" ||
        apt.paymentMethod === "any" ||
        apt.paymentMethod === paymentMethod;
      const matchesCategory = category === "all" || inferredCategory === category;
      const matchesRentSubcategory =
        category !== "rent" ||
        rentSubcategory === "any" ||
        inferredRentSubcategory === rentSubcategory;
      const elevatorValue = apartmentHasElevator(apt);
      const matchesElevator =
        hasElevator === "any" ||
        (hasElevator === "yes" ? elevatorValue : !elevatorValue);
      const matchesFloor =
        apt.floor >= floorRange[0] && apt.floor <= floorRange[1];
      const matchesYear =
        apt.commissionYear >= yearRange[0] &&
        apt.commissionYear <= yearRange[1];
      const commissionedValue = apartmentIsCommissioned(apt);
      const matchesCommissioned =
        isCommissioned === "any" ||
        (isCommissioned === "yes" ? commissionedValue : !commissionedValue);

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesRooms &&
        matchesPrice &&
        matchesSqm &&
        matchesPayment &&
        matchesCategory &&
        matchesRentSubcategory &&
        matchesElevator &&
        matchesFloor &&
        matchesYear &&
        matchesCommissioned
      );
    }).sort((a, b) => {
      const priorityA = a.featured ? 2 : a.verified ? 1 : 0;
      const priorityB = b.featured ? 2 : b.verified ? 1 : 0;
      if (priorityA !== priorityB) return priorityB - priorityA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    apartments,
    category,
    districtFilter,
    floorRange,
    hasElevator,
    isCommissioned,
    paymentMethod,
    priceRange,
    rentSubcategory,
    roomFilter,
    searchQuery,
    sqmRange,
    yearRange,
  ]);

  const activeFilterBadges = useMemo(() => {
    const items: ActiveFilterBadge[] = [];
    if (searchQuery.trim()) items.push({ key: "search", label: `Хайлт: ${searchQuery.trim()}` });
    if (roomFilter !== "any") items.push({ key: "room", label: `Өрөө: ${roomFilter}` });
    if (districtFilter !== "any") items.push({ key: "district", label: `Байршил: ${districtFilter}` });
    if (category !== "all") items.push({ key: "category", label: `Ангилал: ${categoryFilterLabels[category]}` });
    if (category === "rent" && rentSubcategory !== "any") {
      items.push({ key: "rentSubcategory", label: `Түрээсийн төрөл: ${rentSubcategory}` });
    }
    if (priceRange[0] !== 0 || priceRange[1] !== MAX_PRICE_MILLION) {
      items.push({ key: "price", label: `Үнэ: ${priceRange[0]}m-${priceRange[1]}m` });
    }
    if (sqmRange[0] !== 0 || sqmRange[1] !== MAX_SQM) {
      items.push({ key: "sqm", label: `Талбай: ${sqmRange[0]}-${sqmRange[1]}м²` });
    }
    if (paymentMethod !== "any") items.push({ key: "payment", label: paymentFilterLabels[paymentMethod] });
    if (hasElevator !== "any") items.push({ key: "elevator", label: `Лифт: ${ternaryFilterLabels[hasElevator]}` });
    if (isCommissioned !== "any") items.push({ key: "commissioned", label: `Ашиглалт: ${ternaryFilterLabels[isCommissioned]}` });
    if (floorRange[0] !== 0 || floorRange[1] !== MAX_FLOOR) {
      items.push({ key: "floor", label: `Давхар: ${floorRange[0]}-${floorRange[1]}` });
    }
    if (yearRange[0] !== MIN_COMMISSION_YEAR || yearRange[1] !== MAX_COMMISSION_YEAR) {
      items.push({ key: "year", label: `Он: ${yearRange[0]}-${yearRange[1]}` });
    }
    return items;
  }, [
    category,
    districtFilter,
    floorRange,
    hasElevator,
    isCommissioned,
    paymentMethod,
    priceRange,
    rentSubcategory,
    roomFilter,
    searchQuery,
    sqmRange,
    yearRange,
  ]);

  const selectedApartment = useMemo(
    () => filteredApartments.find((apt) => apt.id === selectedId) ?? null,
    [filteredApartments, selectedId],
  );

  useEffect(() => {
    if (!selectedId) return;
    if (!apartments.some((a) => a.id === selectedId)) {
      setSelectedId(null);
    }
  }, [apartments, selectedId]);

  useEffect(() => {
    if (selectedId && !filteredApartments.some((apartment) => apartment.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredApartments, selectedId]);

  const resetFilters = () => {
    setRoomFilter("any");
    setDistrictFilter("any");
    setSearchQuery("");
    setCategory("all");
    setRentSubcategory("any");
    setPriceRange([0, MAX_PRICE_MILLION]);
    setSqmRange([0, MAX_SQM]);
    setPaymentMethod("any");
    setHasElevator("any");
    setFloorRange([0, MAX_FLOOR]);
    setYearRange([MIN_COMMISSION_YEAR, MAX_COMMISSION_YEAR]);
    setIsCommissioned("any");
  };

  const removeFilter = (key: ActiveFilterBadgeKey) => {
    if (key === "search") setSearchQuery("");
    if (key === "room") setRoomFilter("any");
    if (key === "district") setDistrictFilter("any");
    if (key === "category") setCategory("all");
    if (key === "rentSubcategory") setRentSubcategory("any");
    if (key === "price") setPriceRange([0, MAX_PRICE_MILLION]);
    if (key === "sqm") setSqmRange([0, MAX_SQM]);
    if (key === "payment") setPaymentMethod("any");
    if (key === "elevator") setHasElevator("any");
    if (key === "floor") setFloorRange([0, MAX_FLOOR]);
    if (key === "year") setYearRange([MIN_COMMISSION_YEAR, MAX_COMMISSION_YEAR]);
    if (key === "commissioned") setIsCommissioned("any");
  };

  return {
    activeFilterBadges,
    category,
    districtFilter,
    favorites,
    filteredApartments,
    isLoadingListings,
    onMapBoundsChange,
    floorRange,
    hasElevator,
    isCommissioned,
    paymentMethod,
    priceRange,
    removeFilter,
    rentSubcategory,
    resetFilters,
    roomFilter,
    searchQuery,
    selectedApartment,
    selectedId,
    setCategory,
    setDistrictFilter,
    setFavorites,
    setFloorRange,
    setHasElevator,
    setIsCommissioned,
    setPaymentMethod,
    setPriceRange,
    setRentSubcategory,
    setRoomFilter,
    setSearchQuery,
    setSelectedId,
    setShowListings,
    setSqmRange,
    setYearRange,
    showListings,
    sqmRange,
    yearRange,
  };
}
