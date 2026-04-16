"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, type Apartment } from "@/lib/data";

type Props = {
  apartment: Apartment | null;
  onClose: () => void;
};

export function MapSelectedApartmentCard({ apartment, onClose }: Props) {
  return (
    <AnimatePresence>
      {apartment && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="absolute bottom-10 left-6 right-6 z-40 md:left-auto md:right-10 md:w-95"
        >
          <div className="flex gap-4 rounded-[2.5rem] border border-white bg-white/90 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-2 border-white shadow-md">
              <img src={apartment.images[0]} className="h-full w-full object-cover" alt="Preview" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
              <div className="flex items-start justify-between">
                <Badge className="h-5 bg-blue-600 px-2 py-0 text-[9px] font-black">
                  TOP CHOICE
                </Badge>
                <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-slate-100">
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              <h3 className="my-1 truncate text-lg font-black uppercase italic leading-none tracking-tighter text-slate-900">
                {apartment.title}
              </h3>
              <p className="text-2xl font-black italic tracking-tighter text-blue-600">
                {formatPrice(apartment.price)}
              </p>
              <Link href={`/apartment/${apartment.id}`} className="mt-2">
                <Button className="group h-10 w-full rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-600">
                  Дэлгэрэнгүй
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
