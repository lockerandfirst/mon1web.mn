"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApartmentCard } from "@/components/apartment-card";
import { ListingCardSkeleton } from "@/components/skeletons";
import type { Apartment } from "@/lib/data";
import { apiFetch } from "@/lib/backend-api";
import { debug } from "@/lib/debug";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";
import {
  listingsSkeletonExitTransition,
  listingsStaggerContainerVariants as containerVariants,
  listingsStaggerItemVariants as itemVariants,
} from "@/components/listings/listings-stagger-variants";

interface RelatedListingsProps {
  currentId: string;
}

const FETCH_LIMIT = 12;
const DISPLAY_LIMIT = 3;

export function RelatedListings({ currentId }: RelatedListingsProps) {
  const [related, setRelated] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch<{
          success: boolean;
          data: Record<string, unknown>[];
        }>(`/api/listings?status=published&limit=${FETCH_LIMIT}`);
        if (cancelled) return;
        const mapped = (response.data ?? [])
          .map((row) => apartmentFromApiListing(row).apartment)
          .filter((row) => row.id !== currentId)
          .slice(0, DISPLAY_LIMIT);
        setRelated(mapped);
      } catch (error) {
        debug.error("RelatedListings", "fetch failed", {
          message: error instanceof Error ? error.message : "unknown",
        });
        if (!cancelled) setRelated([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [currentId]);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-7xl space-y-6 px-3 sm:px-4 md:mt-20 md:space-y-10 md:px-6">
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

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="related-loading"
              className="contents"
              initial={false}
              exit={{ opacity: 0 }}
              transition={listingsSkeletonExitTransition}
            >
              {Array.from({ length: DISPLAY_LIMIT }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="related-data"
              className="contents"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {related.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="h-full min-h-0 min-w-0"
                  variants={itemVariants}
                >
                  <ApartmentCard
                    apartment={item}
                    index={i}
                    skipEntranceMotion
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-4xl bg-[#2a00ff] p-5 text-center text-white shadow-2xl md:mt-16 md:rounded-[3rem] md:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
        <h4 className="relative z-10 text-xl font-black italic uppercase tracking-tight md:text-3xl md:tracking-tighter">
          Өөрийн үл хөдлөх хөрөнгөө{" "}
          <span className="text-[#ff3bad]">үнэгүй</span> байршуулаарай
        </h4>
        <Link href="/add-property">
          <Button className="relative z-10 mt-4 h-11 rounded-xl bg-white px-5 text-[11px] font-black uppercase text-[#2a00ff] hover:bg-blue-50 md:mt-8 md:h-16 md:rounded-2xl md:px-12 md:text-base">
            Зар нэмэх
          </Button>
        </Link>
      </div>
    </section>
  );
}
