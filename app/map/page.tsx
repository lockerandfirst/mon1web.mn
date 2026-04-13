"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

import { apartments, formatPrice, type Apartment } from "@/lib/data";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Search,
  MapPin,
  BadgeCheck,
  Heart,
  List,
  ArrowRight,
  X,
  ChevronDown,
  SlidersHorizontal,
  Building2,
  CalendarRange,
  Landmark,
  CheckCircle2,
} from "lucide-react";

type TernaryFilter = "any" | "yes" | "no";
type PaymentFilter = Apartment["paymentMethod"] | "any";
type ActiveFilterBadge = {
  key:
    | "search"
    | "room"
    | "district"
    | "price"
    | "sqm"
    | "payment"
    | "elevator"
    | "floor"
    | "year"
    | "commissioned";
  label: string;
};

const CURRENT_YEAR = new Date().getFullYear();
const MAX_PRICE_MILLION = Math.max(
  1000,
  ...apartments.map((apt) => Math.ceil(apt.price / 1000000)),
);
const MAX_SQM = Math.max(...apartments.map((apt) => apt.sqm));
const DISTRICT_OPTIONS = [
  "Сүхбаатар",
  "Хан-Уул",
  "Баянзүрх",
  "Баянгол",
  "Чингэлтэй",
  "Сонгинохайрхан",
] as const;
const MAX_FLOOR = Math.max(...apartments.map((apt) => apt.totalFloors));
const MIN_COMMISSION_YEAR = Math.min(
  ...apartments.map((apt) => apt.commissionYear),
);
const MAX_COMMISSION_YEAR = Math.max(
  CURRENT_YEAR,
  ...apartments.map((apt) => apt.commissionYear),
);

const paymentFilterLabels: Record<PaymentFilter, string> = {
  any: "Төлбөр",
  cash: "Бэлэн",
  mortgage: "Ипотек",
  installment: "Хувь лизинг",
};

const ternaryFilterLabels: Record<TernaryFilter, string> = {
  any: "Хамаагүй",
  yes: "Тийм",
  no: "Үгүй",
};

function apartmentHasElevator(apartment: Apartment) {
  return apartment.features.some((feature) =>
    feature.toLowerCase().includes("elevator"),
  );
}

function apartmentIsCommissioned(apartment: Apartment) {
  return apartment.commissionYear <= CURRENT_YEAR;
}

const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600/20 border-t-blue-600" />
          <p className="text-[10px] font-black uppercase tracking-widest italic text-slate-400">
            Газрын зураг ачаалж байна...
          </p>
        </div>
      </div>
    ),
  },
);

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomFilter, setRoomFilter] = useState<string>("any");
  const [districtFilter, setDistrictFilter] = useState<string>("any");
  const [isDistrictPopoverOpen, setIsDistrictPopoverOpen] = useState(false);
  const [showListings, setShowListings] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([
    0,
    MAX_PRICE_MILLION,
  ]);
  const [sqmRange, setSqmRange] = useState<number[]>([0, MAX_SQM]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentFilter>("any");
  const [hasElevator, setHasElevator] = useState<TernaryFilter>("any");
  const [floorRange, setFloorRange] = useState<number[]>([1, MAX_FLOOR]);
  const [yearRange, setYearRange] = useState<number[]>([
    MIN_COMMISSION_YEAR,
    MAX_COMMISSION_YEAR,
  ]);
  const [isCommissioned, setIsCommissioned] = useState<TernaryFilter>("any");

  const filteredApartments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return apartments.filter((apt) => {
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
        apt.price >= priceRange[0] * 1000000 &&
        apt.price <= priceRange[1] * 1000000;
      const matchesSqm = apt.sqm >= sqmRange[0] && apt.sqm <= sqmRange[1];
      const matchesPayment =
        paymentMethod === "any" || apt.paymentMethod === paymentMethod;

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
        matchesElevator &&
        matchesFloor &&
        matchesYear &&
        matchesCommissioned
      );
    });
  }, [
    searchQuery,
    districtFilter,
    roomFilter,
    priceRange,
    sqmRange,
    paymentMethod,
    hasElevator,
    floorRange,
    yearRange,
    isCommissioned,
  ]);

  const activeFilterBadges = useMemo(() => {
    const items: ActiveFilterBadge[] = [];

    if (searchQuery.trim()) {
      items.push({ key: "search", label: `Хайлт: ${searchQuery.trim()}` });
    }
    if (roomFilter !== "any") {
      items.push({
        key: "room",
        label: `Өрөө: ${roomFilter === "4+" ? "4+" : roomFilter}`,
      });
    }

    if (districtFilter !== "any") {
      items.push({ key: "district", label: `Байршил: ${districtFilter}` });
    }
    if (priceRange[0] !== 0 || priceRange[1] !== MAX_PRICE_MILLION) {
      items.push({
        key: "price",
        label: `Үнэ: ${priceRange[0]}m-${priceRange[1]}m`,
      });
    }
    if (sqmRange[0] !== 0 || sqmRange[1] !== MAX_SQM) {
      items.push({
        key: "sqm",
        label: `Талбай: ${sqmRange[0]}-${sqmRange[1]}м²`,
      });
    }
    if (paymentMethod !== "any") {
      items.push({ key: "payment", label: paymentFilterLabels[paymentMethod] });
    }
    if (hasElevator !== "any") {
      items.push({
        key: "elevator",
        label: `Лифт: ${ternaryFilterLabels[hasElevator]}`,
      });
    }
    if (isCommissioned !== "any") {
      items.push({
        key: "commissioned",
        label: `Ашиглалт: ${ternaryFilterLabels[isCommissioned]}`,
      });
    }
    if (floorRange[0] !== 1 || floorRange[1] !== MAX_FLOOR) {
      items.push({
        key: "floor",
        label: `Давхар: ${floorRange[0]}-${floorRange[1]}`,
      });
    }
    if (
      yearRange[0] !== MIN_COMMISSION_YEAR ||
      yearRange[1] !== MAX_COMMISSION_YEAR
    ) {
      items.push({ key: "year", label: `Он: ${yearRange[0]}-${yearRange[1]}` });
    }

    return items;
  }, [
    searchQuery,
    roomFilter,
    districtFilter,
    priceRange,
    sqmRange,
    paymentMethod,
    hasElevator,
    isCommissioned,
    floorRange,
    yearRange,
  ]);

  const selectedApartment = useMemo(
    () => filteredApartments.find((apt) => apt.id === selectedId) ?? null,
    [filteredApartments, selectedId],
  );

  useEffect(() => {
    if (
      selectedId &&
      !filteredApartments.some((apartment) => apartment.id === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [filteredApartments, selectedId]);

  const toggleFavorite = (id: string, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  const handleDistrictSelect = (district: string) => {
    setDistrictFilter(district);
    setIsDistrictPopoverOpen(false);
  };

  const resetFilters = () => {
    setRoomFilter("any");
    setDistrictFilter("any");
    setSearchQuery("");
    setPriceRange([0, MAX_PRICE_MILLION]);
    setSqmRange([0, MAX_SQM]);
    setPaymentMethod("any");
    setHasElevator("any");
    setFloorRange([1, MAX_FLOOR]);
    setYearRange([MIN_COMMISSION_YEAR, MAX_COMMISSION_YEAR]);
    setIsCommissioned("any");
  };

  const removeFilter = (key: ActiveFilterBadge["key"]) => {
    switch (key) {
      case "search":
        setSearchQuery("");
        break;
      case "room":
        setRoomFilter("any");
        break;
      case "district":
        setDistrictFilter("any");
        break;
      case "price":
        setPriceRange([0, MAX_PRICE_MILLION]);
        break;
      case "sqm":
        setSqmRange([0, MAX_SQM]);
        break;
      case "payment":
        setPaymentMethod("any");
        break;
      case "elevator":
        setHasElevator("any");
        break;
      case "floor":
        setFloorRange([1, MAX_FLOOR]);
        break;
      case "year":
        setYearRange([MIN_COMMISSION_YEAR, MAX_COMMISSION_YEAR]);
        break;
      case "commissioned":
        setIsCommissioned("any");
        break;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FDFCFB]">
      <Header />

      <main className="relative flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "relative z-30 flex h-full flex-col overflow-hidden border-r border-slate-100 bg-white shadow-2xl transition-all duration-500 ease-in-out",
            showListings
              ? "w-full opacity-100 md:w-105"
              : "pointer-events-none w-0 opacity-0",
          )}
        >
          <div className="flex h-full min-w-105 flex-col bg-white">
            <div className="space-y-4 border-b border-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase italic leading-none tracking-tighter text-slate-900">
                    <span className="text-3xl text-blue-600">Газрын</span> Зураг
                  </h2>
                  <p className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Улаанбаатар хот
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge className="rounded-lg border-none bg-blue-50 px-3 py-1.5 text-[10px] font-black text-blue-600">
                    {filteredApartments.length} ҮР ДҮН
                  </Badge>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="h-7 shrink-0 rounded-lg border-slate-200 bg-white px-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <SlidersHorizontal className="mr-1 h-3 w-3" />
                    Цэвэрлэх
                  </Button>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="group relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-all group-focus-within:text-blue-600" />
                  <Input
                    placeholder="Байршил хайх..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 pl-11 pr-12 font-semibold focus-visible:ring-4 focus-visible:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    disabled={!searchQuery}
                    aria-label="Хайлтыг цэвэрлэх"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition hover:text-slate-600 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-3">
                  {[
                    { value: "any", label: "Бүгд" },
                    { value: "1", label: "1 өрөө" },
                    { value: "2", label: "2 өрөө" },
                    { value: "3", label: "3 өрөө" },
                    { value: "4+", label: "4+ өрөө" },
                  ].map((room) => {
                    const isActive = roomFilter === room.value;
                    return (
                      <Button
                        key={room.value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRoomFilter(room.value)}
                        className={cn(
                          "relative h-10 shrink-0 overflow-hidden whitespace-nowrap rounded-xl px-5 text-xs font-bold uppercase tracking-tighter transition-all",
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                            : "border-slate-100 bg-white text-slate-500",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeTab"
                            className="absolute inset-0 -z-10 bg-blue-600"
                          />
                        )}
                        {room.label}
                      </Button>
                    );
                  })}
                </div>

                <div className="-mt-1 flex items-center gap-2">
                  <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1">
                    <Popover
                      open={isDistrictPopoverOpen}
                      onOpenChange={setIsDistrictPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest"
                        >
                          Байршил:{" "}
                          {districtFilter === "any" ? "Бүгд" : districtFilter}
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl"
                        align="start"
                      >
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest italic">
                            Байршил
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={
                                districtFilter === "any" ? "default" : "outline"
                              }
                              onClick={() => handleDistrictSelect("any")}
                              className="h-10 rounded-xl text-[11px] font-bold"
                            >
                              Бүгд
                            </Button>
                            {DISTRICT_OPTIONS.map((district) => (
                              <Button
                                key={district}
                                variant={
                                  districtFilter === district
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handleDistrictSelect(district)}
                                className="h-10 rounded-xl text-[11px] font-bold"
                              >
                                {district}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest"
                        >
                          Үнэ: {priceRange[0]}m - {priceRange[1]}m
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="max-h-[70vh] w-80 overflow-y-auto rounded-4xl border-slate-100 bg-white p-6 shadow-2xl scrollbar-hide"
                        align="start"
                      >
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest italic">
                            Үнийн интервал (сая ₮)
                          </h4>
                          <Slider
                            value={priceRange}
                            max={MAX_PRICE_MILLION}
                            step={10}
                            onValueChange={setPriceRange}
                            className="py-4"
                          />
                          <div className="flex justify-between text-[11px] font-black italic text-blue-600">
                            <span>{priceRange[0]}M ₮</span>
                            <span>{priceRange[1]}M ₮</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest"
                        >
                          Талбай: {sqmRange[0]}-{sqmRange[1]}м²
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="max-h-[70vh] w-80 overflow-y-auto rounded-4xl border-slate-100 bg-white p-6 shadow-2xl scrollbar-hide"
                        align="start"
                      >
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest italic">
                            Талбайн хэмжээ (м²)
                          </h4>
                          <Slider
                            value={sqmRange}
                            max={MAX_SQM}
                            step={5}
                            onValueChange={setSqmRange}
                            className="py-4"
                          />
                          <div className="flex justify-between text-[11px] font-black italic text-blue-600">
                            <span>{sqmRange[0]} м²</span>
                            <span>{sqmRange[1]} м²</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest"
                        >
                          Нэмэлт
                          {activeFilterBadges.length > 0 && (
                            <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] text-white">
                              {activeFilterBadges.length}
                            </span>
                          )}
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="max-h-[70vh] w-88 overflow-y-auto rounded-4xl border-slate-100 bg-white p-6 shadow-2xl scrollbar-hide"
                        align="start"
                      >
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <Landmark className="h-3.5 w-3.5 text-blue-600" />
                              Төлбөрийн нөхцөл
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {(
                                [
                                  "any",
                                  "cash",
                                  "mortgage",
                                  "installment",
                                ] as PaymentFilter[]
                              ).map((option) => (
                                <Button
                                  key={option}
                                  variant={
                                    paymentMethod === option
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => setPaymentMethod(option)}
                                  className="h-10 rounded-xl text-[11px] font-bold"
                                >
                                  {paymentFilterLabels[option]}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <Building2 className="h-3.5 w-3.5 text-blue-600" />
                              Лифттэй эсэх
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {(["any", "yes", "no"] as TernaryFilter[]).map(
                                (option) => (
                                  <Button
                                    key={option}
                                    variant={
                                      hasElevator === option
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => setHasElevator(option)}
                                    className="h-10 rounded-xl text-[11px] font-bold"
                                  >
                                    {ternaryFilterLabels[option]}
                                  </Button>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                              Ашиглалтанд орсон эсэх
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {(["any", "yes", "no"] as TernaryFilter[]).map(
                                (option) => (
                                  <Button
                                    key={option}
                                    variant={
                                      isCommissioned === option
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => setIsCommissioned(option)}
                                    className="h-10 rounded-xl text-[11px] font-bold"
                                  >
                                    {ternaryFilterLabels[option]}
                                  </Button>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <Building2 className="h-3.5 w-3.5 text-blue-600" />
                              Хэдээс хэдэн давхар
                            </div>
                            <Slider
                              value={floorRange}
                              min={1}
                              max={MAX_FLOOR}
                              step={1}
                              onValueChange={setFloorRange}
                              className="py-2"
                            />
                            <div className="flex justify-between text-[11px] font-black italic text-blue-600">
                              <span>{floorRange[0]} давхар</span>
                              <span>{floorRange[1]} давхар</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <CalendarRange className="h-3.5 w-3.5 text-blue-600" />
                              Ашиглалтанд орсон он
                            </div>
                            <Slider
                              value={yearRange}
                              min={MIN_COMMISSION_YEAR}
                              max={MAX_COMMISSION_YEAR}
                              step={1}
                              onValueChange={setYearRange}
                              className="py-2"
                            />
                            <div className="flex justify-between text-[11px] font-black italic text-blue-600">
                              <span>{yearRange[0]} он</span>
                              <span>{yearRange[1]} он</span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {activeFilterBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeFilterBadges.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-600"
                      >
                        <span>{item.label}</span>
                        <button
                          type="button"
                          onClick={() => removeFilter(item.key)}
                          aria-label={`${item.label} шүүлтүүрийг арилгах`}
                          className="flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition hover:bg-blue-100 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                      Хайлтын нөхцөлөө бага зэрэг сулруулаад дахин үзэх эсвэл
                      бүх шүүлтүүрийг цэвэрлэж бүх байрыг харна уу.
                    </p>
                    <Button
                      onClick={resetFilters}
                      className="mt-5 h-10 rounded-xl bg-blue-600 px-4 text-[11px] font-black uppercase tracking-widest text-white hover:bg-blue-700"
                    >
                      Бүх шүүлтүүрийг цэвэрлэх
                    </Button>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredApartments.map((apt) => {
                    const commissioned = apartmentIsCommissioned(apt);

                    return (
                      <motion.div
                        layout
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setSelectedId(apt.id)}
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
                                  onClick={(event) =>
                                    toggleFavorite(apt.id, event)
                                  }
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
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </aside>

        <div className="relative z-10 flex-1 overflow-hidden bg-slate-100">
          <div className="absolute left-6 top-6 z-40">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowListings(!showListings)}
              className="h-12 w-12 rounded-2xl border-none bg-white text-slate-600 shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {!showListings ? (
                <List className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
          </div>

          <MapView
            apartments={filteredApartments}
            selectedId={selectedId}
            onSelectApartment={setSelectedId}
          />

          <AnimatePresence>
            {selectedApartment && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="absolute bottom-10 left-6 right-6 z-40 md:left-auto md:right-10 md:w-95"
              >
                <div className="flex gap-4 rounded-[2.5rem] border border-white bg-white/90 p-5 shadow-2xl backdrop-blur-2xl">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-2 border-white shadow-md">
                    <img
                      src={selectedApartment.images[0]}
                      className="h-full w-full object-cover"
                      alt="Preview"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div className="flex items-start justify-between">
                      <Badge className="h-5 bg-blue-600 px-2 py-0 text-[9px] font-black">
                        TOP CHOICE
                      </Badge>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="rounded-full p-1 transition-colors hover:bg-slate-100"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                    <h3 className="my-1 truncate text-lg font-black uppercase italic leading-none tracking-tighter text-slate-900">
                      {selectedApartment.title}
                    </h3>
                    <p className="text-2xl font-black italic tracking-tighter text-blue-600">
                      {formatPrice(selectedApartment.price)}
                    </p>
                    <Link
                      href={`/apartment/${selectedApartment.id}`}
                      className="mt-2"
                    >
                      <Button className="group h-10 w-full rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-600">
                        Дэлгэрэнгүй
                        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
