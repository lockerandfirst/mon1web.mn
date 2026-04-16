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
    <section className="relative mt-14 flex h-svh w-full items-center justify-center overflow-hidden py-10 pt-24 md:h-screen md:py-10">
      {/* --- BACKGROUND DECOR --- */}
      <div className="pointer-events-none absolute  inset-0 bg-(image:--page-gradient)" />

      <div className="relative z-10 container mx-auto w-full px-4 pb-0 -mt-10 md:px-0">
        {/* --- HEADER SECTION --- */}
        <div className="mx-auto mb-6 max-w-4xl text-center lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 text-[14px] font-black uppercase tracking-widest text-blue-600 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Бид авна, бид бас зарна
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-4xl font-black leading-[0.85] tracking-tighter italic sm:text-6xl md:text-8xl text-slate-950"
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
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:mb-10">
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
          className="relative mx-auto max-w-5xl border-t border-slate-100 pt-7 md:pt-4"
        >
          <div className="rounded-[2.5rem] border-2 border-[#ff2bad] bg-white p-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] md:p-4">
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
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
                    className="group rounded-3xl border bg-slate-50/70 p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ff00c8]/70 hover:bg-[#fff1f9] hover:shadow-xl hover:shadow-[#ff00c8]/20 md:p-4"
                  >
                    <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#2a00ff] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2a00ff] group-hover:text-white md:mb-3 md:h-10 md:w-10">
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
