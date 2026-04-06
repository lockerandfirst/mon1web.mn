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
    <section className="relative py-24 bg-white overflow-hidden">
      {/* THE SMOOTHER - Bridge from Hero */}
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-black to-transparent z-0" />
      <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-black/20 via-zinc-50/40 to-transparent z-0" />

      <div className="container relative z-10 mx-auto px-4">
        {/* --- HEADER SECTION - FIXED SPACING & ALIGNMENT --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl" // Өргөнийг нь бага зэрэг нэмэв
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Premium Selection
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-none">
              Онцлох <span className="text-primary italic">зарууд</span>
            </h2>

            <p className="text-zinc-500 text-base font-medium leading-relaxed">
              Баталгаажсан агентуудын сонгосон, зах зээлийн хамгийн шилдэг үл
              хөдлөх хөрөнгийн жагсаалт. Бид чанарыг эрхэмлэнэ.
            </p>
          </motion.div>

          {/* Button section - Fixed alignment to center/right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex shrink-0" // Товчлуурыг шахагдахаас хамгаална
          >
            <Link href="/listings" className="group w-full md:w-auto">
              <Button
                variant="outline"
                className="rounded-3xl h-14 px-10 gap-3 border-zinc-200 bg-white hover:bg-zinc-950 hover:text-white transition-all duration-500 font-bold uppercase text-xs tracking-widest w-full"
              >
                Бүх зар үзэх
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-6">
                  <Skeleton className="aspect-16/10 w-full rounded-[2.5rem] bg-zinc-200/50" />
                  <div className="space-y-3 px-2">
                    <Skeleton className="h-7 w-3/4 rounded-lg bg-zinc-200/50" />
                    <Skeleton className="h-4 w-1/2 rounded-lg bg-zinc-200/50" />
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
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-[3rem] bg-white/50">
              <Building2 className="h-10 w-10 text-zinc-200 mb-4" />
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Зар байхгүй байна
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
