"use client";

import { motion } from "framer-motion";
import { Building2, CalendarRange, CheckCircle2, ChevronDown, Landmark, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { PROPERTY_CATEGORIES, RENT_SUBCATEGORIES } from "@/lib/property-types";
import { cn } from "@/lib/utils";
import {
  ActiveFilterBadge,
  ActiveFilterBadgeKey,
  CategoryFilter,
  categoryFilterLabels,
  DISTRICT_OPTIONS,
  MAX_COMMISSION_YEAR,
  MAX_FLOOR,
  MAX_PRICE_MILLION,
  MAX_SQM,
  MIN_COMMISSION_YEAR,
  paymentFilterLabels,
  PaymentFilter,
  RentSubcategoryFilter,
  ROOM_OPTIONS,
  ternaryFilterLabels,
  TernaryFilter,
} from "../map-config";
import { useState } from "react";

/** Leaflet overlay-оос дээр; утас дээр багтаалт */
const mapPopoverContentClass =
  "z-[1300] w-80 rounded-4xl border border-slate-100 bg-white p-6 text-slate-900 shadow-2xl outline-none max-md:w-[min(calc(100vw-1rem),22rem)] max-md:p-4 max-md:shadow-xl";

type Props = {
  className?: string;
  activeFilterBadges: ActiveFilterBadge[];
  category: CategoryFilter;
  districtFilter: string;
  priceRange: number[];
  rentSubcategory: string;
  roomFilter: string;
  searchQuery: string;
  sqmRange: number[];
  paymentMethod: PaymentFilter;
  hasElevator: TernaryFilter;
  isCommissioned: TernaryFilter;
  floorRange: number[];
  yearRange: number[];
  resultCount: number;
  onCategoryChange: (value: CategoryFilter) => void;
  onDistrictChange: (value: string) => void;
  onFloorRangeChange: (value: number[]) => void;
  onHasElevatorChange: (value: TernaryFilter) => void;
  onIsCommissionedChange: (value: TernaryFilter) => void;
  onPaymentMethodChange: (value: PaymentFilter) => void;
  onPriceRangeChange: (value: number[]) => void;
  onRemoveFilter: (key: ActiveFilterBadgeKey) => void;
  onRentSubcategoryChange: (value: RentSubcategoryFilter) => void;
  onResetFilters: () => void;
  onRoomChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSqmRangeChange: (value: number[]) => void;
  onYearRangeChange: (value: number[]) => void;
};

export function MapFilterPanel(props: Props) {
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const {
    activeFilterBadges,
    category,
    districtFilter,
    floorRange,
    hasElevator,
    isCommissioned,
    paymentMethod,
    priceRange,
    rentSubcategory,
    resultCount,
    roomFilter,
    searchQuery,
    sqmRange,
    yearRange,
  } = props;

  return (
    <div className={cn("space-y-4 border-b border-slate-50 p-5 max-md:space-y-3 max-md:p-3", props.className)}>
      <div className="flex items-center justify-between gap-2 max-md:gap-2 md:gap-3">
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-black uppercase italic leading-none tracking-tighter text-slate-900 max-md:text-base md:text-2xl">
            <span className="text-xl text-blue-600 max-md:text-lg md:text-3xl">Газрын</span> Зураг
          </h2>
          <p className="ml-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 max-md:ml-0 md:ml-1 md:text-[10px]">
            Улаанбаатар хот
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 max-md:gap-1 md:gap-1.5">
          <Badge className="rounded-md border-none bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-600 max-md:px-2 max-md:py-1 md:rounded-lg md:px-3 md:py-1.5 md:text-[10px]">
            {resultCount} ҮР ДҮН
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-md:space-y-2.5 md:space-y-3.5">
        <div className="group relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-all group-focus-within:text-blue-600 max-md:left-3 md:left-4 md:h-4 md:w-4" />
          <Input placeholder="Байршил хайх..." value={searchQuery} onChange={(e) => props.onSearchChange(e.target.value)} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 pl-10 pr-10 text-sm font-semibold focus-visible:ring-4 focus-visible:ring-blue-500/10 max-md:h-10 max-md:pl-9 max-md:pr-10 max-md:text-[13px] md:h-12 md:rounded-2xl md:pl-11 md:pr-12" />
          <button type="button" onClick={() => props.onSearchChange("")} disabled={!searchQuery} aria-label="Хайлтыг цэвэрлэх" className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition hover:text-slate-600 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-300 max-md:right-2 md:right-3 md:h-7 md:w-7">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto pb-2 max-md:gap-1.5 max-md:pb-2 md:gap-2 md:pb-3">
          {ROOM_OPTIONS.map((room) => {
            const isActive = roomFilter === room.value;
            return (
              <Button key={room.value} variant={isActive ? "default" : "outline"} size="sm" onClick={() => props.onRoomChange(room.value)} className={cn("relative h-8 shrink-0 overflow-hidden whitespace-nowrap rounded-lg px-3 text-[10px] font-bold uppercase tracking-tighter transition-all max-md:h-8 max-md:px-3 md:h-10 md:rounded-xl md:px-5 md:text-xs", isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "border-slate-100 bg-white text-slate-500")}>
                {isActive && <motion.span layoutId="activeTab" className="absolute inset-0 -z-10 bg-blue-600" />}
                {room.label}
              </Button>
            );
          })}
        </div>

        <div className="scrollbar-hide flex min-w-0 items-center gap-1.5 overflow-x-auto pb-1 max-md:flex-wrap max-md:overflow-visible max-md:pb-0 max-md:gap-1.5 md:gap-2">
          <Popover open={isDistrictOpen} onOpenChange={setIsDistrictOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-max gap-1 rounded-lg border-slate-100 bg-slate-50/50 px-2 text-[9px] font-black uppercase tracking-wide max-md:h-8 md:h-9 md:gap-2 md:rounded-xl md:px-3 md:text-[10px] md:tracking-widest">
                Байршил: {districtFilter === "any" ? "Бүгд" : districtFilter}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={mapPopoverContentClass} align="start" sideOffset={8} collisionPadding={12}>
              <div className="grid grid-cols-2 gap-1.5 max-md:gap-1.5 md:gap-2">
                <Button variant={districtFilter === "any" ? "default" : "outline"} onClick={() => { props.onDistrictChange("any"); setIsDistrictOpen(false); }} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">Бүгд</Button>
                {DISTRICT_OPTIONS.map((district) => (
                  <Button key={district} variant={districtFilter === district ? "default" : "outline"} onClick={() => { props.onDistrictChange(district); setIsDistrictOpen(false); }} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">{district}</Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-max gap-1 rounded-lg border-slate-100 bg-slate-50/50 px-2 text-[9px] font-black uppercase tracking-wide max-md:h-8 md:h-9 md:gap-2 md:rounded-xl md:px-3 md:text-[10px] md:tracking-widest">
                Ангилал: {categoryFilterLabels[category]}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={mapPopoverContentClass} align="start" sideOffset={8} collisionPadding={12}>
              <div className="grid grid-cols-2 gap-1.5 max-md:gap-1.5 md:gap-2">
                {PROPERTY_CATEGORIES.map((item) => (
                  <Button key={item.value} variant={category === item.value ? "default" : "outline"} onClick={() => props.onCategoryChange(item.value)} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">{item.label}</Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {category === "rent" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 min-w-max gap-1 rounded-lg border-slate-100 bg-slate-50/50 px-2 text-[9px] font-black uppercase tracking-wide max-md:h-8 md:h-9 md:gap-2 md:rounded-xl md:px-3 md:text-[10px] md:tracking-widest">
                  Түрээсийн төрөл: {rentSubcategory === "any" ? "Бүгд" : rentSubcategory}
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={mapPopoverContentClass} align="start" sideOffset={8} collisionPadding={12}>
                <div className="grid grid-cols-1 gap-1.5 max-md:gap-1.5 md:gap-2">
                  <Button variant={rentSubcategory === "any" ? "default" : "outline"} onClick={() => props.onRentSubcategoryChange("any")} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">Бүгд</Button>
                  {RENT_SUBCATEGORIES.map((item) => (
                    <Button key={item.value} variant={rentSubcategory === item.value ? "default" : "outline"} onClick={() => props.onRentSubcategoryChange(item.value)} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">{item.label}</Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="scrollbar-hide flex min-w-0 items-center gap-1.5 overflow-x-auto pb-1 max-md:flex-wrap max-md:overflow-visible max-md:pb-0 max-md:gap-1.5 md:gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-max gap-1 rounded-lg border-slate-100 bg-slate-50/50 px-2 text-[9px] font-black uppercase tracking-wide max-md:h-8 md:h-9 md:gap-2 md:rounded-xl md:px-3 md:text-[10px] md:tracking-widest">
                Үнэ: {priceRange[0]}m - {priceRange[1]}m <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={mapPopoverContentClass} align="start" sideOffset={8} collisionPadding={12}>
              <div className="space-y-3 max-md:space-y-3 md:space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 max-md:text-[9px]">
                  Үнэ (сая ₮)
                </p>
                <Slider value={priceRange} max={MAX_PRICE_MILLION} step={10} onValueChange={props.onPriceRangeChange} className="py-3 max-md:py-4 md:py-4" />
                <div className="flex justify-between font-black text-xs text-blue-600 max-md:text-[11px] md:text-sm">
                  <span>{priceRange[0]}m</span>
                  <span>{priceRange[1]}m</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-max gap-1 rounded-lg border-slate-100 bg-slate-50/50 px-2 text-[9px] font-black uppercase tracking-wide max-md:h-8 md:h-9 md:gap-2 md:rounded-xl md:px-3 md:text-[10px] md:tracking-widest">
                Талбай: {sqmRange[0]}-{sqmRange[1]}м² <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={mapPopoverContentClass} align="start" sideOffset={8} collisionPadding={12}>
              <div className="space-y-3 max-md:space-y-3 md:space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 max-md:text-[9px]">
                  Талбай (м²)
                </p>
                <Slider value={sqmRange} max={MAX_SQM} step={5} onValueChange={props.onSqmRangeChange} className="py-3 max-md:py-4 md:py-4" />
                <div className="flex justify-between font-black text-xs text-blue-600 max-md:text-[11px] md:text-sm">
                  <span>{sqmRange[0]} м²</span>
                  <span>{sqmRange[1]} м²</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-max gap-1 rounded-lg border-slate-100 bg-slate-50/50 px-2 text-[9px] font-black uppercase tracking-wide max-md:h-8 md:h-9 md:gap-2 md:rounded-xl md:px-3 md:text-[10px] md:tracking-widest">
                Нэмэлт <ChevronDown className="h-3 w-3 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={cn(mapPopoverContentClass, "md:w-88")} align="start" sideOffset={8} collisionPadding={12}>
              <div className="max-h-[min(70dvh,32rem)] space-y-3 overflow-y-auto overscroll-contain max-md:max-h-[65dvh] md:space-y-4">
                <div className="grid grid-cols-2 gap-1.5 max-md:gap-1.5 md:gap-2">{(["any", "cash", "mortgage", "installment"] as PaymentFilter[]).map((option) => <Button key={option} variant={paymentMethod === option ? "default" : "outline"} onClick={() => props.onPaymentMethodChange(option)} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">{paymentFilterLabels[option]}</Button>)}</div>
                <div className="grid grid-cols-3 gap-1.5 max-md:gap-1.5 md:gap-2">{(["any", "yes", "no"] as TernaryFilter[]).map((option) => <Button key={option} variant={hasElevator === option ? "default" : "outline"} onClick={() => props.onHasElevatorChange(option)} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">{ternaryFilterLabels[option]}</Button>)}</div>
                <div className="grid grid-cols-3 gap-1.5 max-md:gap-1.5 md:gap-2">{(["any", "yes", "no"] as TernaryFilter[]).map((option) => <Button key={option} variant={isCommissioned === option ? "default" : "outline"} onClick={() => props.onIsCommissionedChange(option)} className="h-9 rounded-lg text-[10px] font-bold max-md:h-9 md:h-10 md:rounded-xl md:text-[11px]">{ternaryFilterLabels[option]}</Button>)}</div>
                <div className="space-y-2"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 max-md:text-[9px] md:text-[10px]"><Building2 className="h-3 w-3 shrink-0 text-blue-600 md:h-3.5 md:w-3.5" />Давхар</div><Slider value={floorRange} min={1} max={MAX_FLOOR} step={1} onValueChange={props.onFloorRangeChange} className="py-2" /></div>
                <div className="space-y-2"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 max-md:text-[9px] md:text-[10px]"><CalendarRange className="h-3 w-3 shrink-0 text-blue-600 md:h-3.5 md:w-3.5" />Ашиглалтанд орсон он</div><Slider value={yearRange} min={MIN_COMMISSION_YEAR} max={MAX_COMMISSION_YEAR} step={1} onValueChange={props.onYearRangeChange} className="py-2" /></div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {activeFilterBadges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilterBadges.map((item) => (
              <div key={item.key} className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-600">
                <span>{item.label}</span>
                <button type="button" onClick={() => props.onRemoveFilter(item.key)} className="flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition hover:bg-blue-100 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
