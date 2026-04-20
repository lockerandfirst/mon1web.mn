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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section className="relative py-12 md:py-24 bg-white overflow-hidden">
      {/* THE SMOOTHER - Bridge from Hero */}
      <div className="absolute top-0 left-0 w-full h-12 md:h-24 bg-linear-to-b from-blue-50/30 to-white pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3 md:space-y-4 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
              <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                Premium Selection
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Онцлох <span className="text-blue-600 italic">зарууд</span>
            </h2>

            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-[90%] md:max-w-full">
              Баталгаажсан агентуудын сонгосон шилдэг үл хөдлөх хөрөнгө.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex shrink-0"
          >
            <Link href="/listings" className="group w-full md:w-auto">
              <Button
                variant="outline"
                className="rounded-2xl md:rounded-3xl h-12 md:h-14 px-6 md:px-10 gap-3 border-slate-200 bg-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-500 font-bold uppercase text-[10px] md:text-xs tracking-widest w-full shadow-sm"
              >
                Бүх зар
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* --- LISTINGS GRID --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          /* Adjusted gap for mobile (6) vs desktop (10) */
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
        >
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-4 md:space-y-6">
                  {/* Smaller border radius for mobile skeletons */}
                  <Skeleton className="aspect-16/10 w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-100" />
                  <div className="space-y-2 px-2">
                    <Skeleton className="h-6 w-3/4 rounded-lg bg-slate-100" />
                    <Skeleton className="h-4 w-1/2 rounded-lg bg-slate-100" />
                  </div>
                </div>
              ))
          ) : data && data.length > 0 ? (
            data.map((apartment, i) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                index={i}
              />
            ))
          ) : (
            <div className="col-span-full py-12 md:py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] md:rounded-[3rem] bg-slate-50/30">
              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">
                Зар байхгүй байна
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
