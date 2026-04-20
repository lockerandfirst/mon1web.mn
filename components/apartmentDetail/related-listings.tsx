"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApartmentCard } from "@/components/apartment-card";
import { apartments } from "@/lib/data";
import Link from "next/link";

interface RelatedListingsProps {
  currentId: string;
}

export function RelatedListings({ currentId }: RelatedListingsProps) {
  // Filter out the current apartment and take the first 3
  const related = apartments.filter((a) => a.id !== currentId).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-7xl space-y-6 px-3 sm:px-4 md:mt-20 md:space-y-10 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-6">
        <div className="space-y-2 md:space-y-3">
          <Badge className="border-none bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-blue-600 md:px-4 md:py-1.5 md:text-[10px] md:tracking-widest">
            Танд санал болгох
          </Badge>
          <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 md:text-5xl md:tracking-tighter">
            Ойролцоох <span className="text-blue-600">зарууд</span>
          </h3>
          <p className="max-w-md text-sm font-bold tracking-tight text-slate-400 md:text-base">
            Энэ байршилтай ойрхон болон ижил төрлийн бусад боломжууд
          </p>
        </div>

        <Button
          variant="ghost"
          className="group h-11 rounded-xl border border-[#eeebff] bg-white px-4 text-[10px] font-black uppercase tracking-wide text-[#2a00ff] transition-all hover:border-[#dcd3ff] hover:bg-[#fff9fd] md:h-14 md:rounded-3xl md:px-8 md:text-xs md:tracking-widest"
        >
          Бүх зарыг үзэх
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
        </Button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {related.map((item, i) => (
          <motion.div
            key={item.id}
            className="h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <ApartmentCard apartment={item} index={i} />
          </motion.div>
        ))}
      </div>

      {/* Optional: Bottom Banner for "Mon1" Premium feel */}
      <div className="relative mt-8 overflow-hidden rounded-4xl bg-[#1a0b3b] p-5 text-center text-white shadow-2xl md:mt-16 md:rounded-[3rem] md:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
        <h4 className="relative z-10 text-xl font-black italic uppercase tracking-tight md:text-3xl md:tracking-tighter">
          Өөрийн үл хөдлөх хөрөнгөө{" "}
          <span className="text-blue-500">үнэгүй</span> байршуулаарай
        </h4>
        <Link href="/add-property">
          <Button className="relative z-10 mt-4 h-11 rounded-xl bg-white px-5 text-[11px] font-black uppercase text-[#1a0b3b] hover:bg-blue-50 md:mt-8 md:h-16 md:rounded-2xl md:px-12 md:text-base">
            Зар нэмэх
          </Button>
        </Link>
      </div>
    </section>
  );
}
