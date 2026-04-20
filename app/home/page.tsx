"use client";

import { HeroSection } from "@/components/hero-section";
import { FeaturedListings } from "@/components/featured-listings";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Smartphone,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-blue-100">
      <main>
        <HeroSection />

        {/* Tightened the overlap for mobile */}
        <div className="relative z-20 -mt-8 md:-mt-10 lg:-mt-14">
          <FeaturedListings />
        </div>

        {/* --- DATA INFOGRAPHIC SECTION --- */}
        {/* Reduced py-12 to py-8 for mobile */}
        <section className="relative overflow-hidden bg-white py-8 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-2 md:mb-4 inline-flex items-center gap-2 rounded-full bg-[#eeebff] px-3 py-1 text-[10px] md:text-[10px] font-black uppercase tracking-[0.15em] text-[#2a00ff] md:tracking-[0.2em]"
              >
                <Building2 className="h-3 w-3 md:h-4 md:w-4" />
                Үл Хөдлөх
              </motion.div>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 md:text-6xl leading-none">
                Тоон мэдээлэл <span className="text-[#ff3bad]">товчхоноор</span>
              </h2>
            </div>

            {/* Tightened gap-4 to gap-3 */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-2xl md:rounded-[2.5rem] border border-slate-100 bg-[#fff9fd] p-5 md:p-8 text-center shadow-sm"
              >
                <p className="text-3xl md:text-5xl font-black text-[#2a00ff] mb-0.5">
                  50К+
                </p>
                <p className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-[#ff3bad]">
                  Нийлүүлэлт
                </p>
                <p className="mt-2 text-[13px] md:text-sm font-medium text-slate-500 leading-snug md:leading-relaxed">
                  2024-2025 онд зах зээлд хүлээгдэж буй шинэ орон сууц.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-2xl md:rounded-[2.5rem] border border-blue-50 bg-[#2a00ff] p-5 md:p-8 text-center shadow-xl shadow-blue-200"
              >
                <p className="text-3xl md:text-5xl font-black text-white mb-0.5">
                  1%
                </p>
                <p className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-blue-200">
                  Зорилго
                </p>
                <p className="mt-2 text-[13px] md:text-sm font-medium text-blue-100/80 leading-snug md:leading-relaxed">
                  Шимтгэлийг 1% болгож, мөнгийг гэр бүлд нь үлдээх.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-2xl md:rounded-[2.5rem] border border-slate-100 bg-[#fff9fd] p-5 md:p-8 text-center shadow-sm"
              >
                <p className="text-3xl md:text-5xl font-black text-[#ff3bad] mb-0.5">
                  30К+
                </p>
                <p className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-[#2a00ff]">
                  Хүлээлт
                </p>
                <p className="mt-2 text-[13px] md:text-sm font-medium text-slate-500 leading-snug md:leading-relaxed">
                  Ипотекийн зээл хүсээд 1-2 жил хүлээж буй иргэд.
                </p>
              </motion.div>
            </div>

            {/* --- TWO COLUMN DETAIL SECTION --- */}
            {/* Reduced mt-12 to mt-8 */}
            <div className="mt-8 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
              <div>
                <h3 className="text-xl md:text-3xl font-black tracking-tight text-slate-900 mb-4 text-center md:text-left leading-none">
                  Иргэн төвтэй <span className="text-[#2a00ff]">шийдэл</span>
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "Зардал бууруулах",
                      desc: "Хэлцлийн зардлыг багасгаж, 12-14 сая төгрөг хэмнэх.",
                      icon: BadgeDollarSign,
                    },
                    {
                      title: "Мобайл платформ",
                      desc: "80% нь утсаар мэдээлэл авдаг тул хялбар апп.",
                      icon: Smartphone,
                    },
                    {
                      title: "Ирээдүйн хөрөнгө",
                      desc: "Хэмнэсэн мөнгөө гэр бүлдээ зарцуулах нөхцөл.",
                      icon: Users,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-[#eeebff] flex items-center justify-center text-[#2a00ff]">
                        <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-[10px] md:text-xs tracking-wide leading-tight md:tracking-widest md:leading-none">
                          {item.title}
                        </h4>
                        <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl md:rounded-[3rem] p-5 md:p-8 border border-slate-100">
                <h4 className="mb-3 font-black uppercase text-[#ff3bad] text-[11px] md:text-xs tracking-[0.15em] md:tracking-[0.2em]">
                  Зах зээлийн бодит тоо
                </h4>
                <ul className="space-y-2 md:space-y-4">
                  {[
                    "Жил бүр 45,000 хэлцэл хийгддэг",
                    "25,000 шинэ гэр бүл зах зээлд ордог",
                    "Нийт хэлцлийн 33,000 нь орон сууц",
                    "2,000+ агентад нээлттэй экосистем",
                  ].map((text, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[13px] md:text-sm font-bold text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#2a00ff] shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 md:mt-8 p-3 bg-white rounded-xl border border-pink-100">
                  <p className="text-[11px] font-black uppercase text-[#ff3bad]">
                    Анхаарах:
                  </p>
                  <p className="text-[12px] font-medium leading-snug text-slate-500 md:text-xs md:leading-tight">
                    70,000 гаруй иргэн хохирсон судалгаа бий. Бид үүнийг
                    өөрчлөхөөр ирлээ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        {/* Reduced py-16 to py-10 */}
        <section className="relative overflow-hidden bg-[#fff9fd] py-12 md:py-24 border-t border-pink-50/50">
          <div className="container mx-auto px-4 text-center relative z-10">
            {/* text-3xl for phone, text-7xl for desktop */}
            <h2 className="mb-4 md:mb-6 text-3xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1] md:leading-none">
              Мөнгө таньд үлдэнэ <br />{" "}
              <span className="text-[#2a00ff]">Монголдоо үлдэнэ</span>
            </h2>

            {/* text-xs for phone, text-lg for desktop */}
            <p className="mx-auto mb-8 md:mb-10 max-w-2xl text-sm md:text-lg font-medium text-slate-500 px-6 md:px-0 leading-snug md:leading-relaxed">
              Бид үл хөдлөхийн сүүлийн үеийн мэдээлэл, хууль эрх зүйн зөвлөгөөг
              иргэдэд хамгийн ойлгомжтойгоор хүргэж байна.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 sm:flex-row">
              {/* Primary Button: Full width on phone, original px-12 on desktop */}
              <Link href="/listings" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl px-12 text-sm md:text-base font-black bg-[#2a00ff] hover:bg-[#ff3bad] transition-all shadow-lg shadow-blue-600/10"
                >
                  ЗАРУУД ҮЗЭХ
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>

              {/* Secondary Buttons: Side-by-side grid on phone to save vertical space */}
              <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:gap-4">
                <Link href="/agent-portal" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full h-12 md:h-16 rounded-xl md:rounded-2xl text-[12px] md:text-base font-black border-slate-200 bg-white"
                  >
                    Агент портал
                  </Button>
                </Link>
                <Link href="/news" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full h-12 md:h-16 rounded-xl md:rounded-2xl text-[12px] md:text-base font-black border-[#ff3bad]/30 text-[#ff3bad]"
                  >
                    МЭДЭЭ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
