"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Footer } from "@/components/footer";
import { ApartmentCard } from "@/components/apartment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { apartments, type Apartment } from "@/lib/data";
import {
  PROPERTY_CATEGORIES,
  inferPropertyCategory,
  inferRentSubcategory,
  RENT_SUBCATEGORIES,
} from "@/lib/property-types";
import {
  readMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";
import {
  Search,
  SearchX,
  Grid3X3,
  List,
  Settings2,
  Droplets,
  Maximize2,
  Navigation,
  Home,
  Building2,
} from "lucide-react";

const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000000000];
const DEFAULT_SQM_RANGE: [number, number] = [0, 500];
const DISTRICT_OPTIONS = [
  "Сүхбаатар",
  "Хан-Уул",
  "Баянзүрх",
  "Баянгол",
  "Чингэлтэй",
  "Сонгинохайрхан",
] as const;

type PaymentFilter = Apartment["paymentMethod"] | "any";

const paymentFilterLabels: Record<PaymentFilter, string> = {
  any: "Бүгд",
  cash: "Бэлнээр",
  mortgage: "Зээлээр",
  installment: "Лизинг",
};

function getPriceRangeFromParam(priceParam: string | null): [number, number] {
  switch (priceParam) {
    case "0-100":
      return [0, 100000000];
    case "100-300":
      return [100000000, 300000000];
    case "500+":
      return [500000000, 1000000000];
    default:
      return DEFAULT_PRICE_RANGE;
  }
}

function matchesCountFilter(value: number, filterValue: string) {
  if (!filterValue || filterValue === "any") {
    return true;
  }

  if (filterValue.endsWith("+")) {
    const minimumValue = Number.parseInt(filterValue, 10);
    return Number.isFinite(minimumValue) && value >= minimumValue;
  }

  return value === Number.parseInt(filterValue, 10);
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function matchesKeywordSearch(apartment: Apartment, keyword: string) {
  const normalizedKeyword = normalizeKeyword(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  const searchableContent = [
    apartment.title,
    apartment.location,
    apartment.district,
    apartment.address,
    apartment.description,
    apartment.propertyType,
    apartment.agent.name,
    apartment.agent.company,
    ...apartment.features,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return normalizedKeyword
    .split(" ")
    .every((part) => searchableContent.includes(part));
}

export default function ListingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // --- FILTERS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
  const [sqmRange, setSqmRange] = useState<number[]>(DEFAULT_SQM_RANGE);
  const [category, setCategory] = useState("");
  const [rentSubcategory, setRentSubcategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentFilter>("any");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [district, setDistrict] = useState("");
  const [locationType, setLocationType] = useState("");
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
    const listings = readMarketplaceListings().filter(
      (l) => l.workflowStatus === "published",
    );
    setPublishedListings(listings);
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

  return (
    <div className="min-h-screen bg-[#fff9fd] selection:bg-[#2a00ff]/10">
      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8">
          {/* --- STICKY SEARCH BAR --- */}
          <motion.div
            animate={{
              y: 0,
              opacity: isHeaderVisible || isSearchFocused ? 1 : 0.96,
              scale: isHeaderVisible || isSearchFocused ? 1 : 0.985,
            }}
            transition={{ duration: 0.3 }}
            className="sticky top-28 z-40 lg:col-start-2"
          >
            <div
              onClick={() => searchInputRef.current?.focus()}
              className={`w-full rounded-4xl p-2 shadow-2xl shadow-[#2a00ff]/5 flex items-center gap-2 border backdrop-blur-2xl transition-all duration-200 ${
                isSearchFocused
                  ? "bg-white border-[#2a00ff] shadow-[#2a00ff]/10 ring-4 ring-[#2a00ff]/10"
                  : "bg-white/80 border-[#eeebff]"
              }`}
            >
              <div className="relative flex-1 group pl-4">
                <Search
                  className={`absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isSearchFocused ? "text-[#2a00ff]" : "text-[#ff9ce0]"}`}
                />
                <Input
                  ref={searchInputRef}
                  placeholder="Түлхүүр үг, байршил, дүүрэг хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyKeywordSearch();
                    }
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-12 h-14 bg-transparent shadow-none border-none focus-visible:ring-0 text-base font-bold text-[#2a00ff]"
                />
              </div>
              <Button
                onClick={applyKeywordSearch}
                className="h-14 px-10 rounded-3xl font-black bg-[#2a00ff] text-white shadow-xl shadow-[#2a00ff]/10 hover:bg-[#ff3bad] transition-all"
              >
                ХАЙХ
              </Button>
            </div>
          </motion.div>

          {/* --- SIDEBAR --- */}
          <aside className="lg:w-80 shrink-0 self-start -mt-24 lg:row-start-2 lg:sticky lg:top-28">
            <div className="bg-white rounded-[3rem] border border-[#eeebff] p-5 shadow-xl shadow-[#2a00ff]/5 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl flex items-center gap-2 tracking-tight text-[#2a00ff] uppercase">
                  <Settings2 className="h-5 w-5 text-[#2a00ff]" /> Шүүлтүүр
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#ff2bad] font-bold hover:text-[#ff3bad]"
                >
                  Цэвэрлэх
                </Button>
              </div>

              {/* Ангилал */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff] flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" /> Ангилал
                </label>
                <Select
                  value={category || "all"}
                  onValueChange={(value) =>
                    setCategory(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-[#eeebff] bg-[#fff9fd] font-bold text-[#2a00ff]">
                    <SelectValue placeholder="Бүх ангилал" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#eeebff] bg-white">
                    {PROPERTY_CATEGORIES.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="text-[#2a00ff] font-bold"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {category === "rent" && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] flex items-center gap-2">
                    <Home className="h-3.5 w-3.5" /> Түрээсийн төрөл
                  </label>
                  <Select
                    value={rentSubcategory || "any"}
                    onValueChange={(value) =>
                      setRentSubcategory(value === "any" ? "" : value)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-[#eeebff] bg-[#fff9fd] font-bold text-[#2a00ff] text-sm">
                      <SelectValue placeholder="Бүгд" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#eeebff] bg-white text-[#2a00ff] font-bold">
                      <SelectItem value="any">Бүгд</SelectItem>
                      {RENT_SUBCATEGORIES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5" /> Байршил
                </label>
                <Select value={district || "any"} onValueChange={setDistrict}>
                  <SelectTrigger className="h-12 rounded-2xl border-[#eeebff] bg-[#fff9fd] font-bold text-[#2a00ff]">
                    <SelectValue placeholder="Бүгд" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#eeebff] bg-white text-[#2a00ff] font-bold">
                    <SelectItem value="any">Бүгд</SelectItem>
                    {DISTRICT_OPTIONS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {category !== "rent" && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] flex items-center gap-2">
                    Төлбөрийн нөхцөл
                  </label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentFilter)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-[#eeebff] bg-[#fff9fd] px-3 font-bold text-[#2a00ff] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#eeebff] bg-white text-[#2a00ff] font-bold">
                      {(
                        ["any", "cash", "mortgage", "installment"] as const
                      ).map((option) => (
                        <SelectItem key={option} value={option}>
                          {paymentFilterLabels[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3 w-fit">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] flex items-center gap-2">
                    <Home className="h-3.5 w-3.5" /> Өрөө
                  </label>
                  <Select
                    value={rooms || "any"}
                    onValueChange={(value) =>
                      setRooms(value === "any" ? "" : value)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-[#eeebff] bg-[#fff9fd] px-3 font-bold text-[#2a00ff] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#eeebff] bg-white text-[#2a00ff] font-bold">
                      {(["any", "1", "2", "3", "4", "5+"] as const).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r === "any" ? "Бүгд" : `${r} өрөө`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 -ml-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] flex items-center gap-2">
                    <Droplets className="h-3.5 w-3.5" /> Угаалгын
                  </label>
                  <Select
                    value={bathrooms || "any"}
                    onValueChange={(value) =>
                      setBathrooms(value === "any" ? "" : value)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-[#eeebff] bg-[#fff9fd] px-3 font-bold text-[#2a00ff] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#eeebff] bg-white text-[#2a00ff] font-bold">
                      {(["any", "1", "2", "3+"] as const).map((b) => (
                        <SelectItem key={b} value={b}>
                          {b === "any" ? "Бүгд" : `${b} угаалгын өрөө`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* МКВ Slider */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] flex items-center gap-2">
                  <Maximize2 className="h-3.5 w-3.5" /> Хэмжээ (мкв)
                </label>
                <Slider
                  value={sqmRange}
                  onValueChange={setSqmRange}
                  max={500}
                  step={1}
                  className="**:[[role=slider]]:bg-[#2a00ff]"
                />
                <div className="flex justify-between font-black text-[11px] text-[#2a00ff]">
                  <span>
                    {sqmRange[0]} мкв - {sqmRange[1]} мкв
                  </span>
                </div>
              </div>

              {/* Үнэ Slider */}
              <div className="space-y-4 border-t border-[#eeebff] pt-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad]">
                  Үнэ
                </label>
                <Slider
                  className="mt-4 **:[[role=slider]]:bg-[#ff3bad]"
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000000000}
                  step={10000000}
                />
                <div className="flex justify-between font-black text-[#ff3bad] text-xs italic">
                  <span>{(priceRange[0] / 1000000).toFixed(0)}м₮</span>
                  <span>{(priceRange[1] / 1000000).toFixed(0)}м₮</span>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="min-w-0 space-y-6 lg:row-start-2 mt-10">
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-[#2a00ff] uppercase">
                  Бүх зарууд
                </h2>
                <p className="text-[#ff2bad] font-bold text-[10px] uppercase tracking-[0.2em]">
                  Нийт{" "}
                  <span className="text-[#2a00ff] italic">
                    {filteredItems.length}
                  </span>{" "}
                  илэрц
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 w-40 rounded-xl border-[#eeebff] font-bold text-xs bg-white text-[#2a00ff]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#eeebff] bg-white text-[#2a00ff] font-bold">
                    <SelectItem value="newest">Шинэ нь эхэндээ</SelectItem>
                    <SelectItem value="price-low">Үнэ: Хямдаас</SelectItem>
                    <SelectItem value="price-high">Үнэ: Үнэтэйгээс</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex bg-white p-1 rounded-xl border border-[#eeebff]">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewMode("grid")}
                    className={`h-8 w-8 rounded-lg ${viewMode === "grid" ? "bg-[#eeebff] text-[#2a00ff]" : "text-[#ff9ce0]"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewMode("list")}
                    className={`h-8 w-8 rounded-lg ${viewMode === "list" ? "bg-[#eeebff] text-[#2a00ff]" : "text-[#ff9ce0]"}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {category === "land" ? (
              <div className="rounded-3xl border border-[#2a00ff]/25 bg-[#eef0ff] px-5 py-4">
                <p className="text-sm font-black text-[#2a00ff]">
                  Газар зар дээр зөвхөн 2% агентын төлбөр тооцогдоно.
                </p>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {filteredItems.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mx-auto w-full max-w-2xl"
                >
                  <div className="flex flex-col items-center rounded-4xl border border-[#eeebff] bg-white px-8 py-16 text-center shadow-xl shadow-[#2a00ff]/5 sm:px-12">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#eeebff] text-[#2a00ff]">
                      <SearchX className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-[#2a00ff]">
                      Илэрц олдсонгүй
                    </h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#ff2bad]">
                      Таны хайлт болон сонгосон шүүлтүүрт тохирох зар одоогоор
                      алга байна. Шүүлтүүрээ цэвэрлээд дахин оролдоно уу.
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="mt-8 h-12 rounded-2xl border-[#eeebff] px-6 font-bold text-[#2a00ff] hover:bg-[#fff9fd]"
                    >
                      Шүүлтүүр цэвэрлэх
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`results-${viewMode}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                      : "space-y-6"
                  }
                >
                  {filteredItems.map((apt, idx) => (
                    <motion.div
                      key={apt.id}
                      className="h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                    >
                      <ApartmentCard
                        apartment={apt}
                        variant={viewMode === "list" ? "compact" : "default"}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
