"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PROPERTY_CATEGORIES } from "@/lib/property-types";
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
        <div className="mx-auto mb-8 max-w-5xl text-center md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex w-fit items-center gap-2 italic rounded-full border border-[#2a00ff]/10 bg-[#eeebff] px-3 py-1 text-[12px] font-black uppercase tracking-[0.15em] text-[#2a00ff] shadow-sm"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span className="leading-none">Бид авна, бид бас зарна</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 text-4xl font-black leading-[0.92] tracking-tighter italic pb-2 text-brand-gradient sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Зөвхөн <span className="text-[#ff00c8]">1 хувь</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-sm font-medium text-[#ff3ccf] sm:text-base"
          >
            Монголын Үндэсний үл хөдлөх хөрөнгийн агентлаг.
          </motion.p>
        </div>

        {/* --- ACTION BUTTONS (AVNA / ZARNA) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-row items-center justify-center gap-3 mb-8"
        >
          {" "}
          <button
            onClick={() => router.push("/add-property")}
            className="group flex items-center gap-2 rounded-2xl bg-white border-2 border-[#ff00c8] px-8 py-4 text-sm font-black uppercase tracking-widest text-[#ff00c8] shadow-lg shadow-[#ff00c8]/10 transition-all hover:scale-105 hover:bg-[#fff1f9] active:scale-95"
          >
            <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Зарна
          </button>
          <button
            onClick={() => router.push("/listings")}
            className="group flex items-center gap-2 rounded-2xl bg-[#2a00ff] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-[#2a00ff]/20 transition-all hover:scale-105 hover:bg-[#2000cc] active:scale-95"
          >
            <Search className="h-4 w-4 transition-transform group-hover:scale-125" />
            Авна
          </button>
        </motion.div>

        {/* --- CATEGORIES GRID --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mx-auto max-w-5xl border-t border-slate-100 pt-10"
        >
          <div className="rounded-[2.5rem] border-3 border-[#ff2bad] bg-white p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] md:p-5">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {PROPERTY_CATEGORIES.map((item, index) => {
                const Icon = categoryIcons[item.value];
                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.04 }}
                    onClick={() => openCategory(item.value)}
                    className="group rounded-3xl border border-[#ff2bad] bg-slate-50/70 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ff00c8]/70 hover:bg-[#fff1f9] hover:shadow-xl hover:shadow-[#ff00c8]/20 md:p-5"
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
