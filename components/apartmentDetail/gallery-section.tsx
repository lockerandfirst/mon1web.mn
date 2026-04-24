"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  LISTING_IMAGE_FALLBACK,
  coalesceImageSrc,
  fallbackLogoClassName,
  isAppLogoFallbackUrl,
} from "@/lib/image-fallbacks";
import { cn } from "@/lib/utils";

export function GallerySection({ images }: { images: string[] }) {
  const slides = useMemo(
    () => (images.length > 0 ? images : [LISTING_IMAGE_FALLBACK]),
    [images],
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slideFailed, setSlideFailed] = useState(false);

  useEffect(() => {
    setSlideFailed(false);
  }, [currentIdx, slides]);

  const next = () => setCurrentIdx((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrentIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const activeSrc = slideFailed
    ? LISTING_IMAGE_FALLBACK
    : coalesceImageSrc(slides[currentIdx], "listing");

  return (
    <section className="mx-auto max-w-[1400px] px-3 pt-2 sm:px-4 md:px-6 md:pt-4">
      <div
        className="group relative h-[280px] overflow-hidden rounded-4xl bg-slate-100 shadow-xl shadow-blue-900/5 md:h-[650px] md:rounded-[3rem] md:shadow-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={activeSrc}
            onError={() => setSlideFailed(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "h-full w-full",
              isAppLogoFallbackUrl(activeSrc)
                ? fallbackLogoClassName("listing")
                : "object-cover",
            )}
          />
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 justify-between transition-all md:inset-x-8 md:opacity-0 md:group-hover:opacity-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            variant="ghost"
            className="h-9 w-9 rounded-full bg-white/90 pointer-events-auto active:scale-90 md:h-14 md:w-14"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            variant="ghost"
            className="h-9 w-9 rounded-full bg-white/90 pointer-events-auto active:scale-90 md:h-14 md:w-14"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-[#2a00ff]/25 p-1.5 backdrop-blur-md md:bottom-7 md:gap-2 md:p-2.5">
          {slides.map((_, i) => (
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
