"use client";

import Link from "next/link";
import { UserSearch, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export function AgentSearchHero() {
  return (
    <section className="relative overflow-hidden bg-[#fff9fd] px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(42, 0, 255,0.08),_transparent_55%)]" />
      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2a00ff]/15 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]"
        >
          <UserSearch className="h-4 w-4 text-[#ff3bad]" />
          Агент хайлт
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl font-black leading-[1.05] tracking-tighter text-[#1a0b3b] md:text-6xl"
        >
          Агент <span className="text-[#ff3bad]">хайж буй</span> хүмүүс
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-slate-600 md:text-lg"
        >
          Доорх жагсаалтаас үл хөдлөх хайж буй хэрэглэгчдийг үзнэ үү. Та өөрөө
          агент болохыг зорьж байвал доорх маягтаар хүсэлт илгээнэ үү.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#agent-apply-on-search"
            className="inline-flex items-center gap-2 rounded-3xl bg-[#2a00ff] px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-[#2a00ff]/30 transition-transform hover:scale-[1.02] hover:bg-[#2400d9]"
          >
            Агент болох хүсэлт
            <ArrowDown className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
