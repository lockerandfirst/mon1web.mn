"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LISTING_PROPERTY_CATEGORIES } from "@/lib/property-types";
import {
  Building2,
  Building,
  House,
  Landmark,
  Warehouse,
  BriefcaseBusiness,
  CarFront,
  KeyRound,
  ArrowRight,
  PlusCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons = {
  apartment: Building2,
  "new-apartment": Building,
  rent: KeyRound,
  house: House,
  land: Landmark,
  office: BriefcaseBusiness,
  barter: CarFront,
  industrial: Warehouse,
} as const;

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen lg:h-[calc(100vh-80px)] w-full flex-col items-center justify-center overflow-hidden bg-white pt-12 pb-12 lg:pt-0 lg:pb-0">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/40 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center">
        {/* --- HEADER --- */}
        <div className="max-w-4xl text-center mb-6 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Бид авна, бид бас зарна
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-5xl font-black leading-[0.85] tracking-tighter italic sm:text-7xl md:text-8xl lg:text-[8rem] text-slate-950"
          >
            Зөвхөн <br />
            <span className="text-[#ff3bad]">1 ХУВЬ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base lg:text-lg font-bold text-slate-400 italic"
          >
            Монголын Үндэсний үл хөдлөх хөрөнгийн агентлаг.
          </motion.p>
        </div>

        {/* --- BUTTONS --- */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 lg:mb-12">
          <button
            onClick={() => router.push("/add-property")}
            className="h-14 lg:h-16 px-8 lg:px-10 rounded-2xl border-2 border-[#ff3bad] text-[#ff3bad] font-black uppercase tracking-widest transition-all hover:bg-[#ff3bad] hover:text-white active:scale-95 flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Зарна
          </button>
          <button
            onClick={() => router.push("/buy-request")}
            className="h-14 lg:h-16 px-8 lg:px-10 rounded-2xl bg-[#2a00ff] text-white font-black uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Авна
          </button>
        </div>

        {/* --- CATEGORIES GRID --- */}
        <div className="w-full max-w-6xl px-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {LISTING_PROPERTY_CATEGORIES.map((item, index) => {
              const Icon =
                categoryIcons[item.value as keyof typeof categoryIcons] ||
                Building2;
              return (
                <motion.button
                  key={item.value}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  // FAST BACK: transition here controls how it returns to normal
                  transition={{
                    delay: 0.4 + index * 0.05,
                    duration: 0.2, // Faster return speed
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.15, ease: "circOut" }, // Snappy entry
                  }}
                  onClick={() =>
                    router.push(`/listings?category=${item.value}`)
                  }
                  className={cn(
                    "group relative flex flex-col items-start p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] bg-white border border-slate-100",
                    "transition-all duration-200", // Faster Tailwind transition for colors
                    "hover:border-[#ff3bad]/40 hover:bg-[#ff3bad]/5 hover:shadow-[0_20px_40px_-12px_rgba(255,59,173,0.12)]",
                  )}
                >
                  {/* Icon Container */}
                  <div className="mb-3 flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-[#ff3bad] group-hover:text-white transition-colors duration-200">
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </div>

                  {/* Label */}
                  <p className="text-[12px] lg:text-sm font-black uppercase italic tracking-tight text-slate-900 group-hover:text-[#ff3bad] transition-colors duration-200">
                    {item.label}
                  </p>

                  {/* Uzeh Section - Hidden by default, slides in and shows on hover */}
                  <div className="mt-2 flex items-center gap-1.5 overflow-hidden h-4">
                    <div className="flex items-center gap-1.5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
                        Үзэх
                      </span>
                      <ArrowRight className="h-3 w-3 text-[#ff3bad]" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
