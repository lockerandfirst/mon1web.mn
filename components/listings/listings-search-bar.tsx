"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ListingsSearchBarProps = {
  isHeaderVisible: boolean;
  isSearchFocused: boolean;
  setIsSearchFocused: (v: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  applyKeywordSearch: () => void;
};

export function ListingsSearchBar({
  isHeaderVisible,
  isSearchFocused,
  setIsSearchFocused,
  searchInputRef,
  searchQuery,
  setSearchQuery,
  applyKeywordSearch,
}: ListingsSearchBarProps) {
  return (
    <motion.div
      animate={{
        y: 0,
        opacity: isHeaderVisible || isSearchFocused ? 1 : 0.96,
        scale: isHeaderVisible || isSearchFocused ? 1 : 0.985,
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-24 z-40 lg:col-start-2 max-lg:top-16"
    >
      <div
        role="presentation"
        onClick={() => searchInputRef.current?.focus()}
        className={cn(
          "flex w-full items-center gap-2 rounded-4xl border p-2 shadow-2xl shadow-[#2a00ff]/5 backdrop-blur-2xl transition-all duration-200",
          "max-lg:gap-1.5 max-lg:rounded-3xl max-lg:p-1.5 lg:gap-2 lg:rounded-4xl lg:p-2",
          isSearchFocused
            ? "border-[#2a00ff] bg-white shadow-[#2a00ff]/10 ring-4 ring-[#2a00ff]/10"
            : "border-[#eeebff] bg-white/80",
        )}
      >
        <div className="group relative flex-1 pl-4">
          <Search
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors max-lg:h-4 max-lg:w-4 lg:left-6 lg:h-5 lg:w-5",
              isSearchFocused ? "text-[#2a00ff]" : "text-[#ff9ce0]",
            )}
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
            className={cn(
              "h-11 border-none bg-transparent pl-10 text-sm font-bold text-[#2a00ff] shadow-none focus-visible:ring-0",
              "lg:h-14 lg:pl-12 lg:text-base",
            )}
          />
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            applyKeywordSearch();
          }}
          className={cn(
            "h-11 shrink-0 rounded-2xl bg-[#2a00ff] px-4 text-xs font-black text-white shadow-xl shadow-[#2a00ff]/10 transition-all hover:bg-[#ff3bad]",
            "lg:h-14 lg:rounded-3xl lg:px-10 lg:text-base",
          )}
        >
          ХАЙХ
        </Button>
      </div>
    </motion.div>
  );
}
