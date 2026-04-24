"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import type { Apartment } from "@/lib/data";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";
import { apiFetch } from "@/lib/backend-api";
import {
  DEFAULT_PRICE_RANGE,
  DEFAULT_SQM_RANGE,
  getPriceRangeFromParam,
  normalizeKeyword,
  type PaymentFilter,
} from "@/lib/listings-query";

const LIST_PAGE_SIZE = 24;

export type ListingsSort = "newest" | "price-low" | "price-high";

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function parseSort(v: string | null): ListingsSort {
  if (v === "price-low" || v === "price-high") return v;
  return "newest";
}

function buildListingsApiQuery(args: {
  page: number;
  sort: ListingsSort;
  q: string;
  priceRange: number[];
  sqmRange: number[];
  category: string;
  rentSubcategory: string;
  district: string;
  rooms: string;
  bathrooms: string;
  paymentMethod: PaymentFilter;
}): string {
  const p = new URLSearchParams();
  p.set("status", "published");
  p.set("page", String(args.page));
  p.set("limit", String(LIST_PAGE_SIZE));
  p.set("sort", args.sort);
  if (args.q) p.set("q", args.q);
  p.set("priceMin", String(args.priceRange[0]));
  p.set("priceMax", String(args.priceRange[1]));
  p.set("sqmMin", String(args.sqmRange[0]));
  p.set("sqmMax", String(args.sqmRange[1]));
  if (args.category) p.set("category", args.category);
  if (args.rentSubcategory) p.set("rentType", args.rentSubcategory);
  if (args.district && args.district !== "any") {
    p.set("district", args.district);
  }
  if (args.rooms) p.set("rooms", args.rooms);
  if (args.bathrooms) p.set("bathrooms", args.bathrooms);
  if (args.paymentMethod !== "any") {
    p.set("paymentMethod", args.paymentMethod);
  }
  return p.toString();
}

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
  const [sortBy, setSortBy] = useState<ListingsSort>("newest");

  const [listItems, setListItems] = useState<Apartment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );

  const debouncedSearch = useDebounced(searchQuery, 320);
  const debouncedPrice = useDebounced(priceRange, 380);
  const debouncedSqm = useDebounced(sqmRange, 380);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? "down" : "up";
    if (direction === "down" && latest > 150) setIsHeaderVisible(false);
    else setIsHeaderVisible(true);
    setLastScrollY(latest);
  });

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
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
    },
    [pathname, router, searchParams],
  );

  const updateQueryParamsRef = useRef(updateQueryParams);
  updateQueryParamsRef.current = updateQueryParams;

  useEffect(() => {
    setSearchQuery(searchParams.get("q")?.trim() ?? "");
    setCategory(
      searchParams.get("category") === "all"
        ? ""
        : (searchParams.get("category") ?? ""),
    );
    setRentSubcategory(searchParams.get("rentType") ?? "");
    setRooms(searchParams.get("rooms") ?? "");
    setBathrooms(searchParams.get("bathrooms") ?? "");
    setDistrict(searchParams.get("district") ?? "");
    setSortBy(parseSort(searchParams.get("sort")));

    const pay =
      searchParams.get("paymentMethod") ?? searchParams.get("payment");
    if (
      pay === "cash" ||
      pay === "mortgage" ||
      pay === "installment" ||
      pay === "any"
    ) {
      setPaymentMethod(pay as PaymentFilter);
    }

    const pm = searchParams.get("priceMin");
    const px = searchParams.get("priceMax");
    if (
      pm != null &&
      px != null &&
      pm.length > 0 &&
      px.length > 0 &&
      Number.isFinite(Number(pm)) &&
      Number.isFinite(Number(px))
    ) {
      setPriceRange([Number(pm), Number(px)]);
    } else {
      setPriceRange(getPriceRangeFromParam(searchParams.get("price")));
    }

    const sm = searchParams.get("sqmMin");
    const sx = searchParams.get("sqmMax");
    if (
      sm != null &&
      sx != null &&
      sm.length > 0 &&
      sx.length > 0 &&
      Number.isFinite(Number(sm)) &&
      Number.isFinite(Number(sx))
    ) {
      setSqmRange([Number(sm), Number(sx)]);
    }
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

  const filterSignature = useMemo(
    () =>
      JSON.stringify({
        debouncedSearch,
        debouncedPrice,
        debouncedSqm,
        category,
        rentSubcategory,
        district,
        rooms,
        bathrooms,
        paymentMethod,
        sortBy,
      }),
    [
      debouncedSearch,
      debouncedPrice,
      debouncedSqm,
      category,
      rentSubcategory,
      district,
      rooms,
      bathrooms,
      paymentMethod,
      sortBy,
    ],
  );

  const prevFilterSignature = useRef<string | null>(null);
  useEffect(() => {
    if (prevFilterSignature.current === null) {
      prevFilterSignature.current = filterSignature;
      return;
    }
    if (prevFilterSignature.current !== filterSignature) {
      prevFilterSignature.current = filterSignature;
      if (page > 1) {
        updateQueryParams({ page: null });
      }
    }
  }, [filterSignature, page, updateQueryParams]);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    const run = async () => {
      setIsLoadingListings(true);
      const qs = buildListingsApiQuery({
        page,
        sort: sortBy,
        q: debouncedSearch,
        priceRange: debouncedPrice,
        sqmRange: debouncedSqm,
        category,
        rentSubcategory,
        district,
        rooms,
        bathrooms,
        paymentMethod,
      });

      try {
        const response = await apiFetch<{
          success: boolean;
          data: Record<string, unknown>[];
          meta?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        }>(`/api/listings?${qs}`, { signal: ac.signal });

        if (cancelled) return;

        const meta = response.meta;
        const total = meta?.total ?? 0;
        const tp = meta?.totalPages ?? 1;

        if (total > 0 && page > tp) {
          if (!cancelled) {
            setIsLoadingListings(false);
          }
          updateQueryParamsRef.current({
            page: tp <= 1 ? null : String(tp),
          });
          return;
        }

        setListItems(
          (response.data ?? []).map(
            (row) => apartmentFromApiListing(row).apartment,
          ),
        );
        setTotalCount(total);
        setTotalPages(Math.max(1, tp));
      } catch (e) {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        setListItems([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!cancelled) {
          setIsLoadingListings(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [
    page,
    sortBy,
    debouncedSearch,
    debouncedPrice,
    debouncedSqm,
    category,
    rentSubcategory,
    district,
    rooms,
    bathrooms,
    paymentMethod,
  ]);

  const applyKeywordSearch = () => {
    const normalizedQuery = normalizeKeyword(searchQuery);
    setSearchQuery(normalizedQuery);
    updateQueryParams({
      q: normalizedQuery || null,
      page: null,
    });
  };

  const setSortByAndUrl = useCallback(
    (next: string) => {
      const v = parseSort(next);
      setSortBy(v);
      updateQueryParams({
        sort: v === "newest" ? null : v,
        page: null,
      });
    },
    [updateQueryParams],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      const p = Math.max(1, Math.min(nextPage, totalPages));
      updateQueryParams({ page: p <= 1 ? null : String(p) });
    },
    [totalPages, updateQueryParams],
  );

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
    setSortBy("newest");
    updateQueryParams({
      q: null,
      category: null,
      rentType: null,
      price: null,
      rooms: null,
      bathrooms: null,
      district: null,
      paymentMethod: null,
      payment: null,
      priceMin: null,
      priceMax: null,
      sqmMin: null,
      sqmMax: null,
      sort: null,
      page: null,
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
    setSortBy: setSortByAndUrl,
    applyKeywordSearch,
    listItems,
    totalCount,
    page,
    totalPages,
    goToPage,
    isLoadingListings,
    clearFilters,
  };
}
