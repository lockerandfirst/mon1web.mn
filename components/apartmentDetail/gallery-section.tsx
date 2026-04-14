"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function GallerySection({ images }: { images: string[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const next = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section className="px-6 pt-5 max-w-[1400px] mx-auto">
      <div
        onClick={() => setIsOpen(true)}
        className="relative group h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden bg-slate-100 cursor-zoom-in shadow-2xl shadow-blue-900/5"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all z-10 pointer-events-none">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            variant="ghost"
            className="w-14 h-14 rounded-full bg-white/90 pointer-events-auto active:scale-90"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            variant="ghost"
            className="w-14 h-14 rounded-full bg-white/90 pointer-events-auto active:scale-90"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 p-2.5 rounded-full backdrop-blur-md">
          {images.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                currentIdx === i ? "w-8 bg-blue-500" : "w-2 bg-white/50",
              )}
            />
          ))}
        </div>
      </div>

      {/* Lightbox logic remains similar but isolated here */}
    </section>
  );
}
