"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Router ашиглавал илүү цэвэрхэн
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
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
  apartment: Apartment;
  index?: number;
  variant?: "default" | "compact";
}

export const ApartmentCard = memo(
  ({ apartment, index = 0, variant = "default" }: ApartmentCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const router = useRouter();

    const handleCardClick = () => {
      router.push(`/apartment/${apartment.id}`);
    };

    const nextImg = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Карт дарагдахыг зогсооно
      if (apartment.images?.length)
        setCurrentImg((prev) => (prev + 1) % apartment.images.length);
    };

    const prevImg = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Карт дарагдахыг зогсооно
      if (apartment.images?.length)
        setCurrentImg(
          (prev) =>
            (prev - 1 + apartment.images.length) % apartment.images.length,
        );
    };

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Карт дарагдахыг зогсооно
      setIsFavorite(!isFavorite);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={cn(
          "cursor-pointer",
          variant === "compact" && "lg:[&>div]:flex lg:[&>div]:items-stretch",
        )} // Гар гарч ирэх
        onClick={handleCardClick}
      >
        <Card
          className={cn(
            "group relative overflow-hidden pt-0 pb-1 border-border/40 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 rounded-[2.5rem]",
            variant === "compact" &&
              "lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-0",
          )}
        >
          {/* --- IMAGE SECTION --- */}
          <div
            className={cn(
              "relative aspect-16/10 overflow-hidden bg-zinc-100",
              variant === "compact" && "lg:aspect-auto lg:h-full lg:min-h-70",
            )}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={apartment.images?.[currentImg] || "/placeholder.jpg"}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.9 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
              {apartment.images?.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === currentImg ? "w-4 bg-primary" : "w-1 bg-white/50",
                  )}
                />
              ))}
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
                <p className="text-lg font-black text-white tracking-tighter leading-none">
                  {formatPrice(apartment.price)}
                </p>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">
                  {formatPrice(apartment.pricePerSqm)}/м²
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            {apartment.images && apartment.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <Button
                  onClick={prevImg}
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/90 border-none shadow-md hover:bg-white transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={nextImg}
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/90 border-none shadow-md hover:bg-white transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-1.5 z-20">
              {apartment.featured && (
                <Badge className="bg-primary border-none shadow-lg text-[10px] font-black px-2.5 py-1 uppercase tracking-wider">
                  ОНЦЛОХ
                </Badge>
              )}
              {apartment.verified && (
                <Badge className="bg-zinc-900/90 border-none shadow-lg gap-1 text-[10px] font-black px-2.5 py-1 backdrop-blur-md uppercase tracking-wider">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" />{" "}
                  Баталгаажсан
                </Badge>
              )}
            </div>

            {/* Favorite Toggle */}
            <Button
              onClick={handleFavorite}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white transition-all z-20"
              variant="outline"
              size="icon"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isFavorite
                    ? "fill-primary text-primary"
                    : "text-white group-hover:text-zinc-900",
                )}
              />
            </Button>
          </div>

          {/* --- CONTENT SECTION --- */}
          <CardContent
            className={cn(
              "p-5",
              variant === "compact" &&
                "lg:p-7 lg:flex lg:flex-col lg:justify-between",
            )}
          >
            <h3 className="text-lg font-black text-zinc-900 leading-tight line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight mb-2">
              {apartment.title}
            </h3>

            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-5 font-bold uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate font-black">
                {apartment.location}, {apartment.district}
              </span>
            </div>

            {/* COMPACT INFO GRID */}
            <div className="grid grid-cols-4 gap-0 py-4 border-y border-zinc-100 mb-5 bg-zinc-50/50 rounded-2xl overflow-hidden">
              <div className="flex flex-col items-center border-r border-zinc-200">
                <Bed className="h-4 w-4 text-zinc-400 mb-1" />
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">
                  {apartment.rooms} өрөө
                </span>
              </div>
              <div className="flex flex-col items-center border-r border-zinc-200">
                <Bath className="h-4 w-4 text-zinc-400 mb-1" />
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">
                  {apartment.bathrooms} угаалга
                </span>
              </div>
              <div className="flex flex-col items-center border-r border-zinc-200">
                <Square className="h-4 w-4 text-zinc-400 mb-1" />
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">
                  {apartment.sqm}м²
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Hash className="h-4 w-4 text-zinc-400 mb-1" />
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">
                  {apartment.floor || "6"}-р д.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9">
                  <img
                    src={apartment.agent.avatar}
                    className="h-full w-full rounded-full border border-zinc-200 object-cover shadow-sm"
                    alt="Agent"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">
                    {apartment.agent.name}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] text-zinc-400 font-black">
                      {apartment.agent.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Энэ товчлуур одоо зүгээр Visual үүрэгтэй болсон эсвэл дарахад мөн адил ажиллана */}
              <Button
                size="sm"
                className="h-10 rounded-xl font-black text-[10px] px-6 bg-zinc-950 hover:bg-primary transition-all uppercase tracking-widest shadow-lg shadow-black/5"
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

ApartmentCard.displayName = "ApartmentCard";
