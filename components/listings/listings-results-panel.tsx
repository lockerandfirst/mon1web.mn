"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ApartmentCard } from "@/components/apartment-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchX, Grid3X3, List } from "lucide-react";
import type { Apartment } from "@/lib/data";
import { cn } from "@/lib/utils";

type ListingsResultsPanelProps = {
  category: string;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  filteredItems: Apartment[];
  clearFilters: () => void;
};

export function ListingsResultsPanel({
  category,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filteredItems,
  clearFilters,
}: ListingsResultsPanelProps) {
  return (
    <div className="mt-8 min-w-0 space-y-6 lg:row-start-2 lg:mt-10">
      <div className="flex flex-col gap-3 pt-4 max-lg:pt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
        <div className="min-w-0 space-y-1">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#2a00ff] max-lg:truncate lg:text-2xl">
            Бүх зарууд
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff2bad] max-lg:text-[9px]">
            Нийт{" "}
            <span className="italic text-[#2a00ff]">
              {filteredItems.length}
            </span>{" "}
            илэрц
          </p>
        </div>

        <div className="flex w-full min-w-0 shrink-0 items-center gap-2 max-lg:gap-2 lg:w-auto lg:gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className={cn(
                "h-auto min-h-10 w-full min-w-0 flex-1 rounded-xl border-[#eeebff] bg-white py-2 pl-2.5 pr-2 text-left text-[10px] font-bold leading-snug text-[#2a00ff] whitespace-normal",
                "lg:h-10 lg:min-h-10 lg:w-40 lg:shrink-0 lg:whitespace-nowrap lg:px-3 lg:text-xs",
              )}
            >
              <SelectValue placeholder="Эрэмбэлэх" />
            </SelectTrigger>
            <SelectContent className="z-12050 rounded-xl border-[#eeebff] bg-white font-bold text-[#2a00ff]">
              <SelectItem value="newest">Шинэ нь эхэндээ</SelectItem>
              <SelectItem value="price-low">Үнэ: Хямдаас</SelectItem>
              <SelectItem value="price-high">Үнэ: Үнэтэйгээс</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex shrink-0 rounded-xl border border-[#eeebff] bg-white p-0.5 max-lg:p-0.5 lg:p-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`h-7 w-7 rounded-lg max-lg:h-7 max-lg:w-7 lg:h-8 lg:w-8 ${viewMode === "grid" ? "bg-[#eeebff] text-[#2a00ff]" : "text-[#ff9ce0]"}`}
            >
              <Grid3X3 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`h-7 w-7 rounded-lg max-lg:h-7 max-lg:w-7 lg:h-8 lg:w-8 ${viewMode === "list" ? "bg-[#eeebff] text-[#2a00ff]" : "text-[#ff9ce0]"}`}
            >
              <List className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {category === "land" ? (
        <div className="rounded-3xl border border-[#2a00ff]/25 bg-[#eef0ff] px-4 py-3 max-lg:text-xs lg:px-5 lg:py-4">
          <p className="text-sm font-black text-[#2a00ff] max-lg:text-xs lg:text-sm">
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
            <div className="flex flex-col items-center rounded-4xl border border-[#eeebff] bg-white px-6 py-12 text-center shadow-xl shadow-[#2a00ff]/5 max-lg:py-10 max-lg:px-4 sm:px-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-[#eeebff] text-[#2a00ff] max-lg:h-14 max-lg:w-14 lg:mb-6 lg:h-20 lg:w-20">
                <SearchX className="h-8 w-8 max-lg:h-7 max-lg:w-7 lg:h-10 lg:w-10" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-[#2a00ff] max-lg:text-lg lg:text-2xl">
                Илэрц олдсонгүй
              </h3>
              <p className="mt-2 max-w-md text-xs font-medium leading-relaxed text-[#ff2bad] max-lg:text-[11px] lg:mt-3 lg:text-sm lg:leading-6">
                Таны хайлт болон сонгосон шүүлтүүрт тохирох зар одоогоор алга
                байна. Шүүлтүүрээ цэвэрлээд дахин оролдоно уу.
              </p>
              <Button
                type="button"
                onClick={clearFilters}
                variant="outline"
                className="mt-6 h-11 rounded-2xl border-[#eeebff] px-5 font-bold text-[#2a00ff] hover:bg-[#fff9fd] max-lg:mt-5 max-lg:h-10 max-lg:text-sm lg:mt-8 lg:h-12 lg:px-6"
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
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-8"
                : "space-y-4 max-lg:space-y-4 lg:space-y-6"
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
  );
}
