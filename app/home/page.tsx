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
        <div className="relative z-20 -mt-6 md:-mt-10 lg:-mt-14">
          <FeaturedListings />
        </div>

        {/* --- DATA INFOGRAPHIC SECTION --- */}
        <section className="relative overflow-hidden bg-white py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#eeebff] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]"
              >
                <Building2 className="h-4 w-4" />
                Монголын Үл Хөдлөхийн Зах Зээл
              </motion.div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 md:text-6xl">
                Тоон мэдээлэл <span className="text-[#ff3bad]">товчхоноор</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Card 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-[2.5rem] border border-slate-100 bg-[#fff9fd] p-8 text-center shadow-sm"
              >
                <p className="text-5xl font-black text-[#2a00ff] mb-2">50К+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-[#ff3bad]">
                  Нийлүүлэлт
                </p>
                <p className="mt-4 text-sm font-medium text-slate-500 leading-relaxed">
                  2024-2025 онд зах зээлд гарахаар хүлээгдэж буй шинэ орон
                  сууцны тоо.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-[2.5rem] border border-blue-50 bg-[#2a00ff] p-8 text-center shadow-xl shadow-blue-200"
              >
                <p className="text-5xl font-black text-white mb-2">1%</p>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                  Бидний Зорилго
                </p>
                <p className="mt-4 text-sm font-medium text-blue-100/80 leading-relaxed">
                  Зах зээлийн 3%-ийн шимтгэлийг 1% болгож, иргэдийн мөнгийг гэр
                  бүлд нь үлдээх.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-[2.5rem] border border-slate-100 bg-[#fff9fd] p-8 text-center shadow-sm"
              >
                <p className="text-5xl font-black text-[#ff3bad] mb-2">30К+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-[#2a00ff]">
                  Хүлээлт
                </p>
                <p className="mt-4 text-sm font-medium text-slate-500 leading-relaxed">
                  Ипотекийн зээлийн хүсэлт өгөөд 1-2 жил хүлээж буй иргэдийн
                  тоо.
                </p>
              </motion.div>
            </div>

            {/* --- TWO COLUMN DETAIL SECTION --- */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-6">
                  Иргэн төвтэй <br />{" "}
                  <span className="text-[#2a00ff]">ухаалаг шийдэл</span>
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      title: "Зардал бууруулах",
                      desc: "Хэлцлийн зардлыг 6-7%-иас багасгаж, 12-14 сая төгрөг хэмнэх боломж.",
                      icon: BadgeDollarSign,
                    },
                    {
                      title: "Мобайл платформ",
                      desc: "Хэрэглэгчдийн 80% нь гар утсаар мэдээлэл авдаг тул хамгийн хялбар апп.",
                      icon: Smartphone,
                    },
                    {
                      title: "Ирээдүйн хөрөнгө",
                      desc: "Хэмнэсэн мөнгөө хүүхдийн сургалт, эрүүл мэнддээ зарцуулах нөхцөл.",
                      icon: Users,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#eeebff] flex items-center justify-center text-[#2a00ff]">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100">
                <h4 className="font-black text-[#ff3bad] uppercase text-xs tracking-[0.2em] mb-6">
                  Зах зээлийн бодит тоо
                </h4>
                <ul className="space-y-4">
                  {[
                    "Жил бүр 45,000 хэлцэл хийгддэг",
                    "25,000 шинэ гэр бүл зах зээлд орж ирдэг",
                    "Нийт хэлцлийн 33,000 нь орон сууц",
                    "2,000+ агентад нээлттэй экосистем",
                  ].map((text, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-bold text-slate-700"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#2a00ff]" />
                      {text}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-4 bg-white rounded-2xl border border-pink-100">
                  <p className="text-[11px] font-black text-[#ff3bad] uppercase mb-1">
                    Анхаарах:
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Үл хөдлөхийн салбарт 70,000 гаруй иргэн ямар нэг байдлаар
                    хохирсон тоон судалгаа байна. Бид үүнийг өөрчлөхөөр ирлээ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="relative overflow-hidden bg-[#fff9fd] py-24">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="mb-6 text-5xl font-black tracking-tighter text-slate-900 md:text-7xl leading-none">
              Мөнгө таньд үлдэнэ <br />{" "}
              <span className="text-[#2a00ff]">Мөнгө монголдоо үлдэнэ</span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base font-medium text-slate-500 md:text-lg">
              Бид үл хөдлөхийн сүүлийн үеийн мэдээлэл, хууль эрх зүйн зөвлөгөөг
              иргэдэд хамгийн ойлгомжтойгоор хүргэж байна.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/listings">
                <Button
                  size="lg"
                  className="h-16 rounded-2xl px-12 text-base font-black bg-[#2a00ff] hover:bg-[#ff3bad] transition-all"
                >
                  ЗАРУУД ҮЗЭХ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/agent-portal">
                <Button
                  variant="outline"
                  className="h-16 rounded-2xl px-12 text-base font-black border-slate-200 hover:bg-slate-50"
                >
                  Агент портал
                </Button>
              </Link>
              <Link href="/news">
                <Button
                  variant="outline"
                  className="h-16 rounded-2xl px-12 text-base font-black border-[#ff3bad]/30 text-[#ff3bad] hover:bg-[#fff1f9] hover:text-[#2a00ff]"
                >
                  МЭДЭЭ
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
