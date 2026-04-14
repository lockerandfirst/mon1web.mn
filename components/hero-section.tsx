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

  const openCategory = (category: string) => {
    router.push(`/listings?category=${category}`);
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white py-10 md:py-12">
      {/* --- BACKGROUND DECOR --- */}

      <div className="relative z-10 container mx-auto -mt-20 px-4">
        {/* --- HEADER SECTION --- */}
        <div className="mx-auto mb-6 max-w-4xl text-center lg:mb-10">
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
            Монголын Үндэсний үл хөдлөх хөрөнгийн платпорм.
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
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mx-auto max-w-5xl border-t border-slate-100 pt-10"
        >
          <div className="rounded-[2.5rem] border-2 border-[#ff2bad] bg-white p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] md:p-5">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {LISTING_PROPERTY_CATEGORIES.map((item, index) => {
                const Icon = categoryIcons[item.value];
                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.04 }}
                    onClick={() => openCategory(item.value)}
                    className="group rounded-3xl border  bg-slate-50/70 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ff00c8]/70 hover:bg-[#fff1f9] hover:shadow-xl hover:shadow-[#ff00c8]/20 md:p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#2a00ff] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2a00ff] group-hover:text-white md:mb-4 md:h-11 md:w-11">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black tracking-tight text-[#2a00ff] transition-colors group-hover:text-[#ff3bad] md:text-base">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a00ff] transition-colors group-hover:text-[#ff3bad] md:text-[11px]">
                        Үзэх
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
