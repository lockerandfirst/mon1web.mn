"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  PROPERTY_CATEGORIES,
  RENT_SUBCATEGORIES,
} from "@/lib/property-types";
import {
  DISTRICT_OPTIONS,
  paymentFilterLabels,
  type PaymentFilter,
} from "@/lib/listings-query";
import {
  Settings2,
  Navigation,
  Home,
  Droplets,
  Maximize2,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ListingsFiltersFormProps = {
  className?: string;
  category: string;
  setCategory: (v: string) => void;
  rentSubcategory: string;
  setRentSubcategory: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  paymentMethod: PaymentFilter;
  setPaymentMethod: (v: PaymentFilter) => void;
  rooms: string;
  setRooms: (v: string) => void;
  bathrooms: string;
  setBathrooms: (v: string) => void;
  sqmRange: number[];
  setSqmRange: (v: number[]) => void;
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  clearFilters: () => void;
};

const triggerBase =
  "rounded-2xl border-[#eeebff] bg-[#fff9fd] font-bold text-[#2a00ff] max-lg:text-xs lg:text-sm";
/** Drawer overlay z-11000 — dropdown энд дээр гарна */
const selectContentClass =
  "z-12050 rounded-2xl border-[#eeebff] bg-white text-[#2a00ff] font-bold";

export function ListingsFiltersForm({
  className,
  category,
  setCategory,
  rentSubcategory,
  setRentSubcategory,
  district,
  setDistrict,
  paymentMethod,
  setPaymentMethod,
  rooms,
  setRooms,
  bathrooms,
  setBathrooms,
  sqmRange,
  setSqmRange,
  priceRange,
  setPriceRange,
  clearFilters,
}: ListingsFiltersFormProps) {
  return (
    <div
      className={cn(
        "space-y-3.5 rounded-[3rem] border border-[#eeebff] bg-white p-5 shadow-xl shadow-[#2a00ff]/5",
        "max-lg:space-y-2.5 max-lg:rounded-4xl max-lg:p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-[#2a00ff] max-lg:text-base lg:text-xl">
          <Settings2 className="h-4 w-4 text-[#2a00ff] max-lg:h-4 lg:h-5 lg:w-5" />
          Шүүлтүүр
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="shrink-0 font-bold text-[#ff2bad] hover:text-[#ff3bad] max-lg:h-8 max-lg:px-2 max-lg:text-xs"
        >
          Цэвэрлэх
        </Button>
      </div>

      <div className="space-y-3 max-lg:space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff] max-lg:text-[9px]">
          <Building2 className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" /> Ангилал
        </label>
        <Select
          value={category || "all"}
          onValueChange={(value) => setCategory(value === "all" ? "" : value)}
        >
          <SelectTrigger className={cn("h-10 lg:h-12", triggerBase)}>
            <SelectValue placeholder="Бүх ангилал" />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
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
        <div className="space-y-3 max-lg:space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
            <Home className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" /> Түрээсийн
            төрөл
          </label>
          <Select
            value={rentSubcategory || "any"}
            onValueChange={(value) =>
              setRentSubcategory(value === "any" ? "" : value)
            }
          >
            <SelectTrigger className={cn("h-10 lg:h-11", triggerBase)}>
              <SelectValue placeholder="Бүгд" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
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

      <div className="space-y-3 max-lg:space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
          <Navigation className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" /> Байршил
        </label>
        <Select
          value={district || "any"}
          onValueChange={(v) => setDistrict(v === "any" ? "" : v)}
        >
          <SelectTrigger className={cn("h-10 lg:h-12", triggerBase)}>
            <SelectValue placeholder="Бүгд" />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
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
        <div className="space-y-3 max-lg:space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
            Төлбөрийн нөхцөл
          </label>
          <Select
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentFilter)}
          >
            <SelectTrigger className={cn("h-10 px-3 lg:h-11", triggerBase)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {(["any", "cash", "mortgage", "installment"] as const).map(
                (option) => (
                  <SelectItem key={option} value={option}>
                    {paymentFilterLabels[option]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-lg:gap-2">
        <div className="w-fit space-y-3 max-lg:space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
            <Home className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" /> Өрөө
          </label>
          <Select
            value={rooms || "any"}
            onValueChange={(value) => setRooms(value === "any" ? "" : value)}
          >
            <SelectTrigger className={cn("h-10 px-3 lg:h-11", triggerBase)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {(["any", "1", "2", "3", "4", "5+"] as const).map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "any" ? "Бүгд" : `${r} өрөө`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="-ml-5 space-y-3 max-lg:-ml-2 max-lg:space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
            <Droplets className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" /> Угаалгын
          </label>
          <Select
            value={bathrooms || "any"}
            onValueChange={(value) =>
              setBathrooms(value === "any" ? "" : value)
            }
          >
            <SelectTrigger className={cn("h-10 px-3 lg:h-11", triggerBase)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {(["any", "1", "2", "3+"] as const).map((b) => (
                <SelectItem key={b} value={b}>
                  {b === "any" ? "Бүгд" : `${b} угаалгын өрөө`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 max-lg:space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
          <Maximize2 className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" /> Хэмжээ
          (мкв)
        </label>
        <Slider
          value={sqmRange}
          onValueChange={setSqmRange}
          max={500}
          step={1}
          className="**:[[role=slider]]:bg-[#2a00ff]"
        />
        <div className="flex justify-between font-black text-[11px] text-[#2a00ff] max-lg:text-[10px]">
          <span>
            {sqmRange[0]} мкв - {sqmRange[1]} мкв
          </span>
        </div>
      </div>

      <div className="space-y-4 border-t border-[#eeebff] pt-4 max-lg:space-y-2 max-lg:pt-3">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
          Үнэ
        </label>
        <Slider
          className="mt-4 **:[[role=slider]]:bg-[#ff3bad] max-lg:mt-2"
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000000000}
          step={10000000}
        />
        <div className="flex justify-between text-xs font-black italic text-[#ff3bad] max-lg:text-[11px]">
          <span>{(priceRange[0] / 1000000).toFixed(0)}м₮</span>
          <span>{(priceRange[1] / 1000000).toFixed(0)}м₮</span>
        </div>
      </div>
    </div>
  );
}
