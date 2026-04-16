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

type Props = {
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
    <div className="space-y-4 border-b border-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic leading-none tracking-tighter text-slate-900">
            <span className="text-3xl text-blue-600">Газрын</span> Зураг
          </h2>
          <p className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Улаанбаатар хот</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge className="rounded-lg border-none bg-blue-50 px-3 py-1.5 text-[10px] font-black text-blue-600">{resultCount} ҮР ДҮН</Badge>
          <Button onClick={props.onResetFilters} variant="outline" className="h-7 shrink-0 rounded-lg border-slate-200 bg-white px-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600">
            <SlidersHorizontal className="mr-1 h-3 w-3" />
            Цэвэрлэх
          </Button>
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="group relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-all group-focus-within:text-blue-600" />
          <Input placeholder="Байршил хайх..." value={searchQuery} onChange={(e) => props.onSearchChange(e.target.value)} className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 pl-11 pr-12 font-semibold focus-visible:ring-4 focus-visible:ring-blue-500/10" />
          <button type="button" onClick={() => props.onSearchChange("")} disabled={!searchQuery} aria-label="Хайлтыг цэвэрлэх" className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition hover:text-slate-600 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-3">
          {ROOM_OPTIONS.map((room) => {
            const isActive = roomFilter === room.value;
            return (
              <Button key={room.value} variant={isActive ? "default" : "outline"} size="sm" onClick={() => props.onRoomChange(room.value)} className={cn("relative h-10 shrink-0 overflow-hidden whitespace-nowrap rounded-xl px-5 text-xs font-bold uppercase tracking-tighter transition-all", isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "border-slate-100 bg-white text-slate-500")}>
                {isActive && <motion.span layoutId="activeTab" className="absolute inset-0 -z-10 bg-blue-600" />}
                {room.label}
              </Button>
            );
          })}
        </div>

        <div className="scrollbar-hide flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
          <Popover open={isDistrictOpen} onOpenChange={setIsDistrictOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest">
                Байршил: {districtFilter === "any" ? "Бүгд" : districtFilter}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl" align="start">
              <div className="grid grid-cols-2 gap-2">
                <Button variant={districtFilter === "any" ? "default" : "outline"} onClick={() => { props.onDistrictChange("any"); setIsDistrictOpen(false); }} className="h-10 rounded-xl text-[11px] font-bold">Бүгд</Button>
                {DISTRICT_OPTIONS.map((district) => (
                  <Button key={district} variant={districtFilter === district ? "default" : "outline"} onClick={() => { props.onDistrictChange(district); setIsDistrictOpen(false); }} className="h-10 rounded-xl text-[11px] font-bold">{district}</Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest">
                Ангилал: {categoryFilterLabels[category]}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl" align="start">
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_CATEGORIES.map((item) => (
                  <Button key={item.value} variant={category === item.value ? "default" : "outline"} onClick={() => props.onCategoryChange(item.value)} className="h-10 rounded-xl text-[11px] font-bold">{item.label}</Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {category === "rent" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest">
                  Түрээсийн төрөл: {rentSubcategory === "any" ? "Бүгд" : rentSubcategory}
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl" align="start">
                <div className="grid grid-cols-1 gap-2">
                  <Button variant={rentSubcategory === "any" ? "default" : "outline"} onClick={() => props.onRentSubcategoryChange("any")} className="h-10 rounded-xl text-[11px] font-bold">Бүгд</Button>
                  {RENT_SUBCATEGORIES.map((item) => (
                    <Button key={item.value} variant={rentSubcategory === item.value ? "default" : "outline"} onClick={() => props.onRentSubcategoryChange(item.value)} className="h-10 rounded-xl text-[11px] font-bold">{item.label}</Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="scrollbar-hide flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest">Үнэ: {priceRange[0]}m - {priceRange[1]}m <ChevronDown className="h-3 w-3 text-slate-400" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl" align="start"><Slider value={priceRange} max={MAX_PRICE_MILLION} step={10} onValueChange={props.onPriceRangeChange} className="py-4" /></PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest">Талбай: {sqmRange[0]}-{sqmRange[1]}м² <ChevronDown className="h-3 w-3 text-slate-400" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl" align="start"><Slider value={sqmRange} max={MAX_SQM} step={5} onValueChange={props.onSqmRangeChange} className="py-4" /></PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 min-w-max gap-2 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest">Нэмэлт <ChevronDown className="h-3 w-3 text-slate-400" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-88 rounded-4xl border-slate-100 bg-white p-6 shadow-2xl" align="start">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">{(["any", "cash", "mortgage", "installment"] as PaymentFilter[]).map((option) => <Button key={option} variant={paymentMethod === option ? "default" : "outline"} onClick={() => props.onPaymentMethodChange(option)} className="h-10 rounded-xl text-[11px] font-bold">{paymentFilterLabels[option]}</Button>)}</div>
                <div className="grid grid-cols-3 gap-2">{(["any", "yes", "no"] as TernaryFilter[]).map((option) => <Button key={option} variant={hasElevator === option ? "default" : "outline"} onClick={() => props.onHasElevatorChange(option)} className="h-10 rounded-xl text-[11px] font-bold">{ternaryFilterLabels[option]}</Button>)}</div>
                <div className="grid grid-cols-3 gap-2">{(["any", "yes", "no"] as TernaryFilter[]).map((option) => <Button key={option} variant={isCommissioned === option ? "default" : "outline"} onClick={() => props.onIsCommissionedChange(option)} className="h-10 rounded-xl text-[11px] font-bold">{ternaryFilterLabels[option]}</Button>)}</div>
                <div className="space-y-2"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Building2 className="h-3.5 w-3.5 text-blue-600" />Давхар</div><Slider value={floorRange} min={1} max={MAX_FLOOR} step={1} onValueChange={props.onFloorRangeChange} className="py-2" /></div>
                <div className="space-y-2"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><CalendarRange className="h-3.5 w-3.5 text-blue-600" />Ашиглалтанд орсон он</div><Slider value={yearRange} min={MIN_COMMISSION_YEAR} max={MAX_COMMISSION_YEAR} step={1} onValueChange={props.onYearRangeChange} className="py-2" /></div>
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
