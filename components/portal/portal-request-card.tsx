"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Banknote,
  Bed,
  Square,
  Heart,
  User,
  Home,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyRequest } from "@/lib/buy-requests";
import { getPropertyTypeLabel } from "@/lib/property-types";
import { cn } from "@/lib/utils";

export const PortalRequestCard = memo(
  ({
    request,
    index = 0,
    className,
  }: {
    request: BuyRequest;
    index?: number;
    className?: string;
  }) => {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const typeLabel = getPropertyTypeLabel(request.propertyType);
    const budgetLabel =
      request.propertyType === "barter" && request.budget <= 0
        ? "Бартер"
        : `${request.budget.toLocaleString("mn-MN")}₮`;

    const handleCardClick = () => {
      router.push("/buy-request");
    };

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsFavorite(!isFavorite);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={cn("h-full w-full cursor-pointer", className)}
        onClick={handleCardClick}
      >
        <Card className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2.5rem] border-slate-100 bg-white pt-0 pb-1 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ffc6e7]/20">
          <div className="relative aspect-16/10 overflow-hidden bg-slate-50">
            <AnimatePresence mode="wait">
              <motion.img
                key={request.image}
                src={request.image}
                alt=""
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.9 }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              <div className="h-1 w-4 rounded-full bg-[#2a00ff]" />
            </div>

            <div className="absolute bottom-4 left-4 z-20">
              <div className="rounded-2xl border border-white/10 bg-[#2a00ff]/90 px-4 py-2 shadow-2xl backdrop-blur-md">
                <p className="text-lg font-black leading-none tracking-tighter text-white">
                  {budgetLabel}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Төсөв
                </p>
              </div>
            </div>

            <div className="absolute top-4 left-4 z-20 flex gap-1.5">
              <Badge className="border-none bg-[#ff3bad] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg hover:bg-[#ff3bad]">
                Авна
              </Badge>
            </div>

            <Button
              type="button"
              onClick={handleFavorite}
              className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full border-white/20 bg-white/10 backdrop-blur-md transition-all hover:bg-white"
              variant="outline"
              size="icon"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isFavorite
                    ? "fill-[#ff3bad] text-[#ff3bad]"
                    : "text-white group-hover:text-[#ff3bad]",
                )}
              />
            </Button>
          </div>

          <CardContent className="flex flex-1 flex-col p-5">
            <h3 className="mb-2 line-clamp-2 text-lg font-black uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-[#2a00ff]">
              {request.title}
            </h3>

            <div className="mb-5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ff3bad]" />
              <span className="truncate font-black">
                {request.district}
                {request.location ? `, ${request.location}` : ""}
              </span>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-0 overflow-hidden rounded-2xl border-y border-slate-100 bg-[#fff9fd] py-4 md:grid-cols-4">
              <div className="flex flex-col items-center border-b border-r border-slate-200 md:border-b-0">
                <Banknote className="mb-1 h-4 w-4 text-[#2a00ff]" />
                <span className="px-1 text-center text-[10px] font-black uppercase tracking-tighter text-slate-900">
                  {budgetLabel}
                </span>
              </div>
              <div className="flex flex-col items-center border-b border-slate-200 md:border-b-0 md:border-r">
                <Bed className="mb-1 h-4 w-4 text-[#2a00ff]" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900">
                  {request.rooms} өрөө
                </span>
              </div>
              <div className="flex flex-col items-center border-r border-slate-200">
                <Square className="mb-1 h-4 w-4 text-[#2a00ff]" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900">
                  {request.sqm}м²
                </span>
              </div>
              <div className="flex flex-col items-center px-1">
                <Home className="mb-1 h-4 w-4 shrink-0 text-[#2a00ff]" />
                <span className="line-clamp-2 text-center text-[10px] font-black uppercase leading-tight tracking-tighter text-slate-900">
                  {typeLabel}
                </span>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-[#eef0ff] shadow-sm">
                  <User className="h-4 w-4 text-[#2a00ff]" />
                </div>
                <div className="flex min-w-0 flex-col leading-none">
                  <span className="truncate text-xs font-black uppercase tracking-tight text-slate-900">
                    {request.submittedBy.name}
                  </span>
                  <span className="mt-1 truncate text-[10px] font-bold text-slate-400">
                    Хүсэгч
                  </span>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                className="h-10 rounded-xl bg-[#2a00ff] px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#2a00ff]/20 transition-all hover:bg-[#ff3bad]"
              >
                Үзэх
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);

PortalRequestCard.displayName = "PortalRequestCard";
