"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
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
          className="absolute bottom-[max(6.5rem,env(safe-area-inset-bottom,0px)+4.5rem)] left-3 right-3 z-40 md:bottom-10 md:left-auto md:right-10 md:w-95"
        >
          <div className="flex gap-3 rounded-3xl border border-white bg-white/90 p-3 shadow-2xl backdrop-blur-2xl max-md:gap-3 max-md:rounded-3xl max-md:p-3 md:gap-4 md:rounded-[2.5rem] md:p-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-md max-md:h-20 max-md:w-20 md:h-28 md:w-28 md:rounded-3xl">
              <SafeImage
                src={apartment.images[0]}
                variant="listing"
                className="h-full w-full object-cover"
                alt=""
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 md:py-1">
              <div className="flex items-start justify-between">
                {apartment.featured ? (
                  <Badge className="h-4 gap-1 bg-[#ff3bad] px-1.5 py-0 text-[8px] font-black text-white max-md:h-4 md:h-5 md:px-2 md:text-[9px]">
                    <Star className="h-2.5 w-2.5 fill-white text-white" />
                    Онцлох
                  </Badge>
                ) : (
                  <Badge className="h-4 bg-blue-600 px-1.5 py-0 text-[8px] font-black max-md:h-4 md:h-5 md:px-2 md:text-[9px]">
                    TOP CHOICE
                  </Badge>
                )}
                <button type="button" onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-slate-100">
                  <X className="h-3.5 w-3.5 text-slate-400 md:h-4 md:w-4" />
                </button>
              </div>
              <h3 className="my-0.5 truncate text-sm font-black uppercase italic leading-tight tracking-tighter text-slate-900 max-md:text-sm md:my-1 md:text-lg">
                {apartment.title}
              </h3>
              <p className="text-lg font-black italic tracking-tighter text-blue-600 max-md:text-lg md:text-2xl">
                {formatPrice(apartment.price)}
              </p>
              <Link href={`/apartment/${apartment.id}`} className="mt-1.5 md:mt-2">
                <Button className="group h-9 w-full rounded-lg bg-slate-900 text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-600 max-md:h-9 md:h-10 md:rounded-xl md:text-[10px]">
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
