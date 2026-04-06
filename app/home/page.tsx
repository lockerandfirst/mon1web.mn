"use client";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedListings } from "@/components/featured-listings";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen  selection:bg-primary/10">
      <Header />

      <main>
        <HeroSection />

        <div className="relative z-20 -mt-20">
          <FeaturedListings />
        </div>

        {/* --- 3. MODERN ACTION GRID (Perfect Clean Layout) --- */}
        <section className="py-32 bg-white relative overflow-hidden">
          {/* Subtle light decoration */}
          <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* --- LEFT: TEXT CONTENT --- */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-10"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950 text-white shadow-xl">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Trust 2.0 System
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter leading-[0.9]">
                    Зөвхөн{" "}
                    <span className="text-primary italic">баталгаажсан</span>{" "}
                    <br />
                    орчинд мөрөөдлөө ол.
                  </h2>
                  <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
                    Бид гар аргаар бүх зарыг шалгаж, AI системээр үнийн
                    хөөсөрлийг хянадаг. Таны аюулгүй байдал бидний тэргүүн
                    зорилт.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                  {[
                    {
                      icon: Zap,
                      t: "Шуурхай үзлэг",
                      d: "Агенттай 1 минутанд холбогдох боломж",
                    },
                    {
                      icon: Sparkles,
                      t: "AI Туслах",
                      d: "Танд тохирох байрыг систем санал болгоно",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-7 rounded-4xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 group-hover:scale-110 transition-transform">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-black text-zinc-900 text-sm mb-2 uppercase tracking-widest">
                        {item.t}
                      </h4>
                      <p className="text-zinc-500 text-xs leading-relaxed font-semibold">
                        {item.d}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* --- RIGHT: IMAGE CONTENT (Fixed Borders) --- */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-5 relative"
              >
                {/* 
                   AspectRatio 3/4 ашиглаж, бүх талын border-ыг цэвэрхэн харуулав. 
                   Ямар ч тасралтгүй, төгс бөөрөнхий хүрээ.
                */}
                <div className="relative aspect-4/4 w-full rounded-[3.5rem] overflow-hidden shadow-2xl border border-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073"
                    alt="Safe Property"
                    className="h-full w-full object-cover"
                  />

                  {/* Floating Badge */}
                  <div className="absolute bottom-8 left-8 bg-zinc-950 text-white p-6 rounded-4xl shadow-2xl border border-white/10 group hover:scale-105 transition-transform duration-500">
                    <p className="text-3xl font-black tracking-tighter text-white">
                      150+
                    </p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">
                      Verified Agents
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- 4. FINAL CTA --- */}
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(var(--primary-rgb),0.1),transparent_70%)] opacity-50" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none uppercase italic">
              Мөрөөдлийн гэрээ <br />{" "}
              <span className="text-primary not-italic">өнөөдөр</span> олоорой.
            </h2>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/listings">
                <Button
                  size="lg"
                  className="h-16 px-12 rounded-xl bg-primary text-white font-black text-lg shadow-lg hover:scale-105 transition-all"
                >
                  ЗАРУУД ҮЗЭХ
                </Button>
              </Link>
              <Link href="/agent-portal">
                <Button
                  variant="ghost"
                  className="h-16 px-12 rounded-xl text-white/40 font-black text-lg hover:text-white transition-colors"
                >
                  АГЕНТ ПОРТАЛ
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
