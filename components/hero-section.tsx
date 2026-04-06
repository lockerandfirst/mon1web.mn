"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Home, Banknote, Sparkles } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [rooms, setRooms] = useState("");
  const selectItemClassName = "text-white data-[highlighted]:text-[#0044ff]";

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("q", location.trim());
    }

    if (priceRange) {
      params.set("price", priceRange);
    }

    if (rooms) {
      params.set("rooms", rooms);
    }

    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  return (
    <section className="relative h-screen w-full -mt-17 mb-15 flex items-center justify-center overflow-hidden bg-black">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-70" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              Монголын №1 Үл хөдлөх хөрөнгийн платформ
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tighter leading-[0.9]"
          >
            Мөрөөдлийн <span className="text-primary">гэрээ</span> <br />
            эндээс олоорой.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-white/50 max-w-2xl mx-auto font-medium"
          >
            Улаанбаатар даяарх хамгийн шилдэг, баталгаажсан зарууд.
          </motion.p>
        </div>

        {/* --- FIXED SEARCH FORM --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-2xl rounded-4xl border border-white/10 p-3 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-full">
              {/* 1. Location Input */}
              <div className="relative h-13 w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-20" />
                <Input
                  placeholder="Байршил..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-full w-full pl-12 bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-white/20 text-white rounded-2xl placeholder:text-white/30 text-base"
                />
              </div>

              {/* 2. Price Select - FIXED HEIGHT */}
              <div className="h-13 w-full">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="flex min-h-13 w-full items-center gap-3 bg-white/5 border-none focus:ring-1 focus:ring-white/20 text-white rounded-2xl px-6 text-base shadow-none">
                    <Banknote className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 text-left">
                      <SelectValue placeholder="Үнийн хүрээ" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem className={selectItemClassName} value="0-100">
                      100 сая хүртэл
                    </SelectItem>
                    <SelectItem className={selectItemClassName} value="100-300">
                      100 - 300 сая
                    </SelectItem>
                    <SelectItem className={selectItemClassName} value="500+">
                      500 сая+
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Rooms Select - FIXED HEIGHT */}
              <div className="h-13 w-full">
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="flex min-h-13 w-full items-center gap-3 bg-white/5 border-none focus:ring-1 focus:ring-white/20 text-white rounded-2xl px-6 text-base shadow-none">
                    <Home className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 text-left">
                      <SelectValue placeholder="Өрөө" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem className={selectItemClassName} value="1">
                      1 өрөө
                    </SelectItem>
                    <SelectItem className={selectItemClassName} value="2">
                      2 өрөө
                    </SelectItem>
                    <SelectItem className={selectItemClassName} value="3+">
                      3+ өрөө
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Search Button */}
              <div className="h-13 w-full">
                <Button
                  className="h-full w-full bg-primary hover:bg-primary/90 text-white rounded-2xl gap-3 text-lg font-bold shadow-lg shadow-primary/20 group"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Хайх</span>
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-12 mt-16 border-t border-white/5 pt-12"
          >
            {[
              { label: "Идэвхтэй зар", value: "2,500+" },
              { label: "Баталгаажсан агент", value: "150+" },
              { label: "Сэтгэл ханамж", value: "99%" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-3xl md:text-5xl font-bold text-white mb-1 tracking-tighter group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold italic">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
