"use client";

import { memo, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  BadgeCheck,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Hash,
} from "lucide-react";
import { Apartment, formatPrice } from "@/lib/data";
import { useFavorites } from "@/hooks/use-favorites";
import {
  LISTING_IMAGE_FALLBACK,
  coalesceImageSrc,
  fallbackLogoClassName,
  isAppLogoFallbackUrl,
} from "@/lib/image-fallbacks";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
  apartment: Apartment;
  index?: number;
  variant?: "default" | "compact";
  /** When true, skip the root entrance motion (parent handles stagger / AnimatePresence). */
  skipEntranceMotion?: boolean;
  agentDisplayMode?: "agent" | "user";
  onCardClick?: (apartment: Apartment) => void;
  /** Card-ийн үндсэн даралт өөр зам руу явна; товчийг тусад нь барихад ашиглана */
  onActionClick?: (apartment: Apartment) => void;
  actionLabel?: string;
}

export const ApartmentCard = memo(
  ({
    apartment,
    index = 0,
    variant = "default",
    skipEntranceMotion = false,
    agentDisplayMode = "agent",
    onCardClick,
    onActionClick,
    actionLabel = "Үзэх",
  }: ApartmentCardProps) => {
    const [currentImg, setCurrentImg] = useState(0);
    const [listingImgFailed, setListingImgFailed] = useState(false);
    const { isSignedIn } = useUser();
    const router = useRouter();
    const favorites = useFavorites();
    const isFavorite = favorites.isFavorite(apartment.id);

    useEffect(() => {
      setListingImgFailed(false);
    }, [currentImg, apartment.id, apartment.images]);

    const listingSlideSrc = listingImgFailed
      ? LISTING_IMAGE_FALLBACK
      : coalesceImageSrc(apartment.images?.[currentImg], "listing");

    const handleCardClick = () => {
      if (onCardClick) {
        onCardClick(apartment);
        return;
      }
      router.push(`/apartment/${apartment.id}`);
    };

    const nextImg = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (apartment.images?.length)
        setCurrentImg((prev) => (prev + 1) % apartment.images.length);
    };

    const prevImg = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (apartment.images?.length)
        setCurrentImg(
          (prev) =>
            (prev - 1 + apartment.images.length) % apartment.images.length,
        );
    };

    const handleFavorite = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }
      await favorites.toggle(apartment.id);
    };

    const rootClassName = cn(
      "h-full w-full cursor-pointer",
      variant === "compact" && "lg:[&>div]:flex lg:[&>div]:items-stretch",
    );

    const card = (
        <Card
          className={cn(
            "group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border-slate-100 bg-white pt-0 pb-1 shadow-sm transition-all duration-500",
            "max-md:shadow-md max-md:ring-1 max-md:ring-slate-100/80",
            "md:rounded-[2.5rem] md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:shadow-[#ffc6e7]/20",
            variant === "compact" &&
              "lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-0",
          )}
        >
          {/* --- IMAGE SECTION --- */}
          <div className="relative aspect-2/1 overflow-hidden bg-slate-50 max-sm:aspect-[2.2/1] md:aspect-16/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={listingSlideSrc}
                onError={() => setListingImgFailed(true)}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.9 }}
                className={cn(
                  "h-full w-full",
                  isAppLogoFallbackUrl(listingSlideSrc)
                    ? fallbackLogoClassName("listing")
                    : "object-cover",
                )}
              />
            </AnimatePresence>

            {/* Pagination Indicators */}
            <div className="absolute bottom-1.5 left-1/2 z-20 flex -translate-x-1/2 gap-0.5 pointer-events-none max-md:scale-90 md:bottom-4 md:gap-1.5 md:scale-100">
              {apartment.images?.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === currentImg
                      ? "w-3 md:w-4 bg-[#2a00ff]"
                      : "w-1 bg-white/50",
                  )}
                />
              ))}
            </div>

            <div className="absolute bottom-2 left-2 z-20 max-md:max-w-[58%] md:bottom-4 md:left-4">
              <div className="rounded-lg border border-white/10 bg-[#2a00ff]/90 px-2 py-1 shadow-xl backdrop-blur-md md:rounded-2xl md:px-4 md:py-2 md:shadow-2xl">
                <p className="text-sm font-black leading-none tracking-tight text-white md:text-lg md:tracking-tighter">
                  {formatPrice(apartment.price)}
                </p>
                <p className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-widest text-white/70 md:mt-1 md:block">
                  {formatPrice(apartment.pricePerSqm)}/м²
                </p>
              </div>
            </div>

            {/* Navigation Arrows - Only Desktop */}
            {apartment.images && apartment.images.length > 1 && (
              <div className="hidden md:flex absolute inset-0 items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <Button
                  onClick={prevImg}
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/90 border-none shadow-md hover:bg-white text-[#2a00ff] transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={nextImg}
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/90 border-none shadow-md hover:bg-white text-[#2a00ff] transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-1.5 z-20">
              {apartment.featured && (
                <Badge className="bg-[#ff3bad] hover:bg-[#ff3bad] border-none shadow-lg text-[9px] font-black uppercase tracking-wide text-white md:text-[10px] md:tracking-wider md:px-2.5 md:py-1 px-2 py-0.5">
                  ОНЦЛОХ
                </Badge>
              )}
              {apartment.verified && (
                <Badge className="bg-white/90 text-[#2a00ff] border-none shadow-lg gap-1 text-[9px] font-black uppercase tracking-wide backdrop-blur-md md:text-[10px] md:tracking-wider md:px-2.5 md:py-1 px-2 py-0.5">
                  <BadgeCheck className="h-3 w-3 md:h-3.5 md:w-3.5 fill-[#2a00ff] text-white" />{" "}
                  Verified
                </Badge>
              )}
            </div>

            <Button
              onClick={handleFavorite}
              className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full border-white/20 bg-white/10 backdrop-blur-md transition-all hover:bg-white md:top-4 md:right-4 md:h-10 md:w-10"
              variant="outline"
              size="icon"
            >
              <Heart
                className={cn(
                  "h-4 w-4 md:h-5 md:w-5 transition-colors",
                  isFavorite
                    ? "fill-[#ff3bad] text-[#ff3bad]"
                    : "text-white group-hover:text-[#ff3bad]",
                )}
              />
            </Button>
          </div>

          {/* --- CONTENT SECTION --- */}
          <CardContent className="flex min-w-0 flex-1 flex-col px-3 py-2.5 md:p-5">
            <h3 className="mb-0.5 line-clamp-2 text-[15px] font-black uppercase leading-[1.15] tracking-normal text-slate-900 transition-colors group-hover:text-[#2a00ff] md:mb-2 md:line-clamp-1 md:text-lg md:mt-0 -mt-4 md:leading-tight md:tracking-tight">
              {apartment.title}
            </h3>

            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase leading-snug tracking-wide text-slate-400 md:mb-5 md:gap-1 md:text-[11px] md:tracking-wider">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ff3bad] md:h-4 md:w-4" />
              <span className="min-w-0 truncate font-black md:truncate">
                {apartment.location}, {apartment.district}
              </span>
            </div>

            {/* SPECS — max-md: tight grid; md+: original column borders */}
            <div className="mb-2 grid grid-cols-4 items-stretch divide-x divide-slate-200/90 overflow-hidden rounded-xl border border-slate-100/90 bg-[#fff9fd] py-1 md:mb-5 md:divide-x-0 md:rounded-2xl md:border-none md:bg-[#fff9fd] md:py-4 md:px-0">
              {/* Room */}
              <div className="flex min-w-0 flex-col items-center justify-center gap-0 px-0.5 py-0.5 text-center md:flex-col md:gap-0.5 md:border-r md:border-slate-200 md:px-1 md:py-0">
                <Bed className="h-3 w-3 shrink-0 text-[#2a00ff] md:h-4 md:w-4" />
                <span className="text-[10px] font-black uppercase leading-tight text-slate-900 md:text-[10px]">
                  {apartment.rooms}
                  <span className="hidden md:ml-0.5 md:inline">өрөө</span>
                </span>
              </div>

              {/* Bath */}
              <div className="flex min-w-0 flex-col items-center justify-center gap-0 px-0.5 py-0.5 text-center md:flex-col md:gap-0.5 md:border-r md:border-slate-200 md:px-1 md:py-0">
                <Bath className="h-3 w-3 shrink-0 text-[#2a00ff] md:h-4 md:w-4" />
                <span className="text-[10px] font-black uppercase leading-tight text-slate-900 md:text-[10px]">
                  {apartment.bathrooms}
                  <span className="hidden md:ml-0.5 md:inline">угаалга</span>
                </span>
              </div>

              {/* Sqm */}
              <div className="flex min-w-0 flex-col items-center justify-center gap-0 px-0.5 py-0.5 text-center md:flex-col md:gap-0.5 md:border-r md:border-slate-200 md:px-1 md:py-0">
                <Square className="h-3 w-3 shrink-0 text-[#2a00ff] md:h-4 md:w-4" />
                <span className="text-[10px] font-black uppercase leading-tight text-slate-900 md:text-[10px]">
                  {apartment.sqm}м²
                </span>
              </div>

              {/* Floor */}
              <div className="flex min-w-0 flex-col items-center justify-center gap-0 px-0.5 py-0.5 text-center md:flex-col md:gap-0.5 md:px-1 md:py-0">
                <Hash className="h-3 w-3 shrink-0 text-[#2a00ff] md:h-4 md:w-4" />
                <span className="text-[10px] font-black uppercase leading-tight text-slate-900 md:text-[10px]">
                  {apartment.floor || "6"}
                  <span className="hidden md:inline">-р д.</span>
                </span>
              </div>
            </div>

            {/* FOOTER SECTION */}
            <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5 pt-0.5 md:gap-4 md:pt-0">
              <div className="flex min-w-0 flex-1 items-center gap-1.5 md:max-w-none md:flex-none md:gap-3">
                <div className="relative h-8 w-8 shrink-0 md:h-9 md:w-9">
                  <SafeImage
                    src={apartment.agent.avatar}
                    variant="avatar"
                    className="h-full w-full rounded-full border border-slate-200 object-cover shadow-sm"
                    alt={
                      agentDisplayMode === "user"
                        ? apartment.agent.name || "Хэрэглэгч"
                        : "Агент"
                    }
                  />
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-[#2a00ff] md:h-2.5 md:w-2.5" />
                </div>
                {agentDisplayMode === "agent" ? (
                  <div className="flex min-w-0 flex-col leading-none">
                    <span className="truncate text-[11px] font-black uppercase tracking-tight text-slate-900 md:text-xs">
                      {apartment.agent.name.trim()
                        ? apartment.agent.name.split(" ")[0]
                        : "Агент"}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1 md:mt-1">
                      <Star className="h-2 w-2 fill-[#ff3bad] text-[#ff3bad] md:h-2.5 md:w-2.5" />
                      <span className="text-[10px] font-black text-slate-400 md:text-[10px]">
                        {apartment.agent.rating}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-w-0 flex-col leading-none">
                    <span className="truncate text-[11px] font-black uppercase tracking-tight text-slate-900 md:text-xs">
                      {apartment.agent.name.trim() || "Хэрэглэгч"}
                    </span>
                    <span className="mt-0.5 truncate text-[10px] font-semibold text-slate-400 md:mt-1">
                      Зар оруулагч
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                size="sm"
                className="h-8 max-md:min-w-15 shrink-0 rounded-lg bg-[#2a00ff] px-3 text-[10px] font-black uppercase tracking-wide text-white shadow-md transition-all hover:bg-[#ff3bad] md:h-10 md:rounded-xl md:px-6 md:text-[10px] md:tracking-widest md:shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(apartment);
                    return;
                  }
                  if (onCardClick) {
                    onCardClick(apartment);
                    return;
                  }
                  router.push(`/apartment/${apartment.id}`);
                }}
              >
                {actionLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
    );

    if (skipEntranceMotion) {
      return (
        <div className={rootClassName} onClick={handleCardClick}>
          {card}
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0 }}
        className={rootClassName}
        onClick={handleCardClick}
      >
        {card}
      </motion.div>
    );
  },
);
ApartmentCard.displayName = "ApartmentCard";
