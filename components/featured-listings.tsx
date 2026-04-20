"use client";

import { motion } from "framer-motion";
import { ApartmentCard } from "./apartment-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedApartments } from "@/hooks/use-features-apartments";

export function FeaturedListings() {
  const { data, isLoading } = useFeaturedApartments(3);

  return (
    <section className="relative py-10 md:py-24 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-12 md:h-24 bg-gradient-to-b from-blue-50/30 to-white pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 md:mb-16 gap-4">
          <div className="space-y-2 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                Premium Selection
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Онцлох <span className="text-blue-600 italic">зарууд</span>
            </h2>
          </div>

          <Link href="/listings" className="w-full md:w-auto">
            <Button
              variant="ghost"
              className="group h-11 w-full rounded-xl border border-[#eeebff] bg-white px-4 text-[10px] font-black uppercase tracking-wide text-[#2a00ff] transition-all hover:border-[#dcd3ff] hover:bg-[#fff9fd] md:h-14 md:w-auto md:rounded-3xl md:px-8 md:text-xs md:tracking-widest"
            >
              Бүх зар
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-16/10 w-full rounded-2xl md:rounded-[2.5rem] bg-slate-100" />
                    <Skeleton className="h-6 w-3/4 mx-2 bg-slate-100" />
                  </div>
                ))
            : data?.map((apartment, i) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  index={i}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
