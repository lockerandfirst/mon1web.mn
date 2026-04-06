"use client";

import { useAuth } from "@clerk/nextjs";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/header";
import { Photo360Viewer } from "@/components/photo-360-viewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apartments, formatPrice, type Apartment } from "@/lib/data";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Building,
  Phone,
  Calendar,
  Heart,
  Share2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [apt, setApt] = useState<Apartment | null>(null);
  const [viewMode, setViewMode] = useState<"photos" | "360">("photos");
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const found = apartments.find((a) => a.id === resolvedParams.id);
    setApt(found || null);
  }, [resolvedParams.id]);

  if (!apt)
    return (
      <div className="h-screen flex items-center justify-center font-bold">
        Уншиж байна...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-slate-900">
      <Header />

      {/* --- HERO MEDIA SECTION --- */}
      <section className="relative h-[70vh] w-full bg-black group">
        <AnimatePresence mode="wait">
          {viewMode === "photos" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full"
            >
              <img
                src={apt.images[currentImg]}
                className="h-full w-full object-cover"
                alt="Apartment"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full"
            >
              <Photo360Viewer images={apt.images} title={apt.title} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Controller */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 z-20">
          <button
            onClick={() => setViewMode("photos")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "photos" ? "bg-white text-black" : "text-white"}`}
          >
            Зураг
          </button>
          <button
            onClick={() => setViewMode("360")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "360" ? "bg-white text-black" : "text-white"}`}
          >
            360° Тур
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-20 relative z-30">
        {/* LEFT COLUMN: INFO */}
        <div className="lg:col-span-2 space-y-8 bg-white p-10 rounded-4xl shadow-sm border border-slate-100">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge className="bg-red-700 hover:bg-red-800 text-white border-none px-4">
                ОНЦЛОХ
              </Badge>
              <Badge variant="outline" className="border-slate-200">
                ШИНЭ
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif font-medium tracking-tight text-slate-900">
              {apt.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-red-700" />
              {apt.address}, {apt.district}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 py-8 border-y border-slate-100">
            <QuickStat icon={Bed} label="Өрөө" val={apt.rooms} />
            <QuickStat icon={Maximize2} label="Хэмжээ" val={`${apt.sqm}м²`} />
            <QuickStat icon={Building} label="Давхар" val={apt.floor} />
            <QuickStat icon={Bath} label="Ариун цэвэр" val={apt.bathrooms} />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-700" /> Танилцуулга
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {apt.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: PRICING & ACTION */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">
              Нийт үнэ
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-500">
                {formatPrice(apt.price)}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              1м² = {formatPrice(apt.pricePerSqm)}
            </p>

            <div className="mt-8 space-y-3">
              <Button className="w-full h-14 bg-red-700 hover:bg-red-800 rounded-xl text-lg font-bold">
                <Phone className="w-5 h-5 mr-2" /> Утас харах
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-xl"
              >
                <Calendar className="w-5 h-5 mr-2" /> Үзэх цаг товлох
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
              <span>Зар тавигдсан: 2026.04.06</span>
              <div className="flex gap-4">
                <Share2 className="w-4 h-4 cursor-pointer hover:text-white" />
                <Heart className="w-4 h-4 cursor-pointer hover:text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex gap-4 items-start">
            <ShieldCheck className="w-10 h-10 text-red-700 shrink-0" />
            <div>
              <h4 className="font-bold text-red-900 text-sm">
                Зөвхөн 1% шимтгэл
              </h4>
              <p className="text-xs text-red-800/70 mt-1">
                Бусад агентууд 3.5% авдаг бол бид ердөө 1% авч таны мөнгийг
                Монголдоо үлдээж байна.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickStat({ icon: Icon, label, val }: any) {
  return (
    <div className="text-center space-y-1">
      <Icon className="w-5 h-5 mx-auto text-slate-400" />
      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
        {label}
      </p>
      <p className="font-bold text-slate-900">{val}</p>
    </div>
  );
}
