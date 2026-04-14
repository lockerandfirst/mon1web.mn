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
    <section className="max-w-7xl mx-auto mt-20 space-y-10 px-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-3">
          <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 font-black text-[10px] tracking-widest uppercase">
            Танд санал болгох
          </Badge>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Ойролцоох <span className="text-blue-600">зарууд</span>
          </h3>
          <p className="text-slate-400 font-bold tracking-tight max-w-md">
            Энэ байршилтай ойрхон болон ижил төрлийн бусад боломжууд
          </p>
        </div>

        <Button
          variant="ghost"
          className="group flex items-center gap-3 px-8 h-16 font-black text-xs uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-[1.5rem] border border-transparent hover:border-blue-100 transition-all"
        >
          Бүх зарыг үзэх
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
        </Button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {related.map((item, i) => (
          <motion.div
            key={item.id}
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
      <div className="relative mt-16 overflow-hidden rounded-[3rem] bg-[#1a0b3b] p-12 text-center text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
        <h4 className="relative z-10 text-3xl font-black italic uppercase tracking-tighter">
          Өөрийн үл хөдлөх хөрөнгөө{" "}
          <span className="text-blue-500">үнэгүй</span> байршуулаарай
        </h4>
        <Link href="/add-property">
          <Button className="relative z-10 mt-8 h-16 px-12 rounded-2xl bg-white text-[#1a0b3b] font-black uppercase hover:bg-blue-50">
            Зар нэмэх
          </Button>
        </Link>
      </div>
    </section>
  );
}
