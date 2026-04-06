"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Header } from "@/components/header";
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
import { apartments } from "@/lib/data";
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
} from "lucide-react";

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // --- FILTERS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [sqmRange, setSqmRange] = useState([0, 500]);
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
    // Scroll up хийхэд Header-ээс зайтай харагдуулахын тулд логикийг хэвээр үлдээв
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

  const allApartments = useMemo(
    () => [...publishedListings, ...apartments],
    [publishedListings],
  );

  const filteredItems = useMemo(() => {
    return allApartments
      .filter((apt) => {
        const matchesSearch =
          apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice =
          apt.price >= priceRange[0] && apt.price <= priceRange[1];
        const matchesSqm = apt.sqm >= sqmRange[0] && apt.sqm <= sqmRange[1];
        const matchesRooms =
          !rooms || rooms === "any" || apt.rooms === parseInt(rooms);
        const matchesBathrooms =
          !bathrooms ||
          bathrooms === "any" ||
          apt.bathrooms === parseInt(bathrooms);
        const matchesDistrict =
          !district || district === "any" || apt.district === district;
        return (
          matchesSearch &&
          matchesPrice &&
          matchesSqm &&
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
    rooms,
    bathrooms,
    district,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 1000000000]);
    setSqmRange([0, 500]);
    setRooms("");
    setBathrooms("");
    setDistrict("");
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 selection:bg-primary/10">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12">
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
              className={`w-full rounded-4xl p-2 shadow-2xl shadow-zinc-200/40 flex items-center gap-2 border backdrop-blur-2xl transition-all duration-200 ${
                isSearchFocused
                  ? "bg-white border-primary shadow-primary/10 ring-4 ring-primary/10"
                  : "bg-white/80 border-zinc-200"
              }`}
            >
              <div className="relative flex-1 group pl-4">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-primary" />
                <Input
                  ref={searchInputRef}
                  placeholder="Байршил, дүүрэг хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-12 h-14 bg-transparent shadow-none border-none focus-visible:ring-0 text-base font-bold text-zinc-900"
                />
              </div>
              <Button className="h-14 px-10 rounded-3xl font-black bg-primary text-white shadow-xl shadow-primary/10 hover:scale-105 transition-transform">
                ХАЙХ
              </Button>
            </div>
          </motion.div>

          {/* --- SIDEBAR: LEFT SIDE FIXED --- */}
          <aside className="lg:w-80 shrink-0 self-start lg:row-start-2 lg:sticky lg:top-32">
            <div className="bg-white rounded-[3rem] border border-zinc-200 p-8 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl flex items-center gap-2 tracking-tight">
                  <Settings2 className="h-5 w-5 text-primary" /> Шүүлтүүр
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-zinc-400 font-bold hover:text-primary"
                >
                  Цэвэрлэх
                </Button>
              </div>

              {/* Өрөө */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Home className="h-3.5 w-3.5" /> Өрөө
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["any", "1", "2", "3", "4", "5+"].map((r) => (
                    <Button
                      key={r}
                      variant={
                        rooms === r || (r === "any" && !rooms)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setRooms(r === "any" ? "" : r)}
                      className="rounded-xl h-10 font-bold text-xs"
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Угаалгын өрөө */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5" /> Угаалгын өрөө
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["any", "1", "2", "3+"].map((b) => (
                    <Button
                      key={b}
                      variant={
                        bathrooms === b || (b === "any" && !bathrooms)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setBathrooms(b === "any" ? "" : b)}
                      className="rounded-xl h-10 font-bold text-xs"
                    >
                      {b}
                    </Button>
                  ))}
                </div>
              </div>

              {/* МКВ */}
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Maximize2 className="h-3.5 w-3.5" /> Хэмжээ (мкв)
                </label>
                <Slider
                  value={sqmRange}
                  onValueChange={setSqmRange}
                  max={500}
                  step={1}
                />
                <div className="flex justify-between font-black text-[11px] text-zinc-400">
                  <span>
                    {sqmRange[0]} мкв - {sqmRange[1]} мкв
                  </span>
                </div>
              </div>

              {/* Үнэ */}
              <div className="space-y-6 pt-4 border-t border-zinc-100">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Үнийн хүрээ
                </label>
                <Slider
                  className="mt-4"
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000000000}
                  step={10000000}
                />
                <div className="flex justify-between font-black text-primary text-xs italic">
                  <span>{(priceRange[0] / 1000000).toFixed(0)}м₮</span>
                  <span>{(priceRange[1] / 1000000).toFixed(0)}м₮</span>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT: SEARCH + GRID --- */}
          <div className="min-w-0 space-y-8 lg:row-start-2">
            {/* Results Header */}
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                  Бүх зарууд
                </h2>
                <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                  Нийт{" "}
                  <span className="text-primary italic">
                    {filteredItems.length}
                  </span>{" "}
                  илэрц
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 w-40 rounded-xl border-zinc-200 font-bold text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest">Шинэ нь эхэндээ</SelectItem>
                    <SelectItem value="price-low">Үнэ: Хямдаас</SelectItem>
                    <SelectItem value="price-high">Үнэ: Үнэтэйгээс</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex bg-white p-1 rounded-xl border border-zinc-200">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewMode("grid")}
                    className={`h-8 w-8 rounded-lg ${viewMode === "grid" ? "bg-zinc-100" : ""}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewMode("list")}
                    className={`h-8 w-8 rounded-lg ${viewMode === "list" ? "bg-zinc-100" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Apartments Grid */}
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
                  <div className="flex flex-col items-center rounded-4xl border border-zinc-200 bg-white px-8 py-16 text-center shadow-sm sm:px-12">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary/8 text-primary">
                      <SearchX className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-zinc-900">
                      Илэрц олдсонгүй
                    </h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-6 text-zinc-500">
                      Таны хайлт болон сонгосон шүүлтүүрт тохирох зар одоогоор
                      алга байна. Шүүлтүүрээ цэвэрлээд дахин оролдоно уу.
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="mt-8 h-12 rounded-2xl border-zinc-200 px-6 font-bold"
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
