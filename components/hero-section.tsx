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
    <section
      className={[
        "relative w-full overflow-hidden flex flex-col justify-center",
        "min-h-screen pt-[env(safe-area-inset-top,20px)] pb-[env(safe-area-inset-bottom,20px)]",
        "md:min-h-screen md:items-center md:py-10",
      ].join(" ")}
    >
      {/* --- BACKGROUND DECOR --- */}
      <div className="pointer-events-none absolute inset-0 bg-(image:--page-gradient)" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        {/* --- HEADER SECTION --- */}
        <div className="mx-auto mb-4 text-center sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-wider text-blue-600 shadow-sm sm:mb-4 sm:px-4 sm:text-[13px]"
          >
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>Бид авна, бид бас зарна</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-1 text-[2.2rem] font-black leading-[0.9] tracking-tighter text-slate-950 italic sm:text-5xl md:text-7xl lg:text-8xl"
          >
            Зөвхөн <br />
            <span className="text-[#ff3bad]">1 ХУВЬ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-[280px] text-xs font-bold text-slate-500 italic sm:max-w-md sm:text-base"
          >
            Монголын Үндэсний үл хөдлөх хөрөнгийн платформ.
          </motion.p>
        </div>

        {/* --- MAIN ACTION BUTTONS --- */}
        <div className="mb-5 flex w-full flex-row items-center justify-center gap-2 sm:mx-auto sm:max-w-none lg:mb-10">
          <button
            type="button"
            onClick={() => router.push("/add-property")}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#ff3bad] text-[11px] font-black uppercase tracking-wider text-[#ff3bad] transition-all active:scale-[0.95] sm:h-14 sm:w-auto sm:flex-none sm:px-8"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            Зарна
          </button>
          <button
            type="button"
            onClick={() => router.push("/buy-request")}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2a00ff] text-[11px] font-black uppercase tracking-wider text-white transition-all active:scale-[0.95] sm:h-14 sm:w-auto sm:flex-none sm:px-8"
          >
            <Search className="h-4 w-4 shrink-0" />
            Авна
          </button>
        </div>

        {/* --- CATEGORIES GRID --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mx-auto max-w-5xl pt-2"
        >
          <div className="rounded-[2rem] border-[1.5px] border-[#ff2bad]/40 bg-white/80 p-2 shadow-xl backdrop-blur-sm md:p-4">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 md:grid-cols-4">
              {LISTING_PROPERTY_CATEGORIES.map((item, index) => {
                const Icon = categoryIcons[item.value];
                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.03 }}
                    onClick={() => openCategory(item.value)}
                    className="group flex min-h-[60px] items-center gap-2.5 rounded-xl bg-slate-50/50 p-2 text-left transition-all active:scale-[0.96] sm:min-h-0 md:p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#2a00ff] shadow-sm group-hover:bg-[#2a00ff] group-hover:text-white md:h-10 md:w-10">
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black leading-tight text-[#2a00ff] group-hover:text-[#ff3bad] sm:text-sm">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-blue-400 group-hover:text-[#ff3bad]">
                        Үзэх
                        <ArrowRight className="h-2.5 w-2.5 shrink-0" />
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
