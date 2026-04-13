"use client";

import { use, useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";

import { Header } from "@/components/header";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { ApartmentCard } from "@/components/apartment-card";

import { apartments, formatPrice, type Apartment } from "@/lib/data";

import { readMarketplaceListings } from "@/lib/marketplace";

import { getPropertyTypeLabel } from "@/lib/property-types";

import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Building,
  Phone,
  Calendar,
  Heart,
  Share2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  Info,
  School,
  Store,
  Coffee,
  Car,
  Building2,
  Landmark,
  LayoutGrid,
  CalendarDays,
  CheckCircle2,
  Mail,
  Clock3,
  Layers3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

const paymentMethodLabels = {
  cash: "Бэлэн төлбөр",

  mortgage: "Ипотекийн зээл",

  installment: "Хувь лизинг",
} as const;

const nearbyServiceMeta = {
  school: {
    icon: School,

    title: "Боловсрол",
  },

  supermarket: {
    icon: Store,

    title: "Дэлгүүр",
  },

  bus: {
    icon: Car,

    title: "Тээвэр",
  },

  hospital: {
    icon: Coffee,

    title: "Эмнэлэг",
  },
} as const;

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [apt, setApt] = useState<Apartment | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

  const [showAgentPhone, setShowAgentPhone] = useState(false);

  // CAROUSEL STATE

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const publishedMarketplaceListings = readMarketplaceListings().filter(
      (listing) => listing.workflowStatus === "published",
    );

    const found = [...publishedMarketplaceListings, ...apartments].find(
      (listing) => listing.id === resolvedParams.id,
    );

    setApt(found || null);
  }, [resolvedParams.id]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();

    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    setShowAgentPhone(false);
  }, [apt?.agent.id]);

  if (!apt)
    return (
      <div className="h-screen flex items-center justify-center font-bold">
        Уншиж байна...
      </div>
    );

  const images = apt.images || [];

  const photoCount = images.length;

  const relatedApartments = apartments

    .filter((a) => a.id !== apt.id)

    .slice(0, 3);

  const propertyTypeLabel = getPropertyTypeLabel(apt.propertyType);

  const commissioned = apt.commissionYear <= new Date().getFullYear();

  const nearbyGroups = Object.entries(
    apt.nearbyServices.reduce<Record<string, typeof apt.nearbyServices>>(
      (accumulator, service) => {
        if (!accumulator[service.type]) {
          accumulator[service.type] = [];
        }

        accumulator[service.type].push(service);

        return accumulator;
      },

      {},
    ),
  );

  const detailItems = [
    {
      icon: LayoutGrid,

      label: "Ангилал",

      value: propertyTypeLabel,
    },

    {
      icon: Landmark,

      label: "Төлбөрийн нөхцөл",

      value: paymentMethodLabels[apt.paymentMethod],
    },

    {
      icon: Building2,

      label: "Нийт давхар",

      value: `${apt.totalFloors} давхар`,
    },

    {
      icon: Layers3,

      label: "Ашиглалтанд орсон",

      value: `${apt.commissionYear} он`,
    },

    {
      icon: CheckCircle2,

      label: "Баталгаажуулалт",

      value: apt.verified ? "Баталгаажсан" : "Шалгаж байна",
    },

    {
      icon: Sparkles,

      label: "Онцлох эсэх",

      value: apt.featured ? "Онцлох зар" : "Энгийн зар",
    },

    {
      icon: CalendarDays,

      label: "Нийтлэгдсэн",

      value: new Date(apt.createdAt).toLocaleDateString("mn-MN"),
    },

    {
      icon: Bed,

      label: "Цонхны мэдээлэл",

      value: "Оруулаагүй",
    },
  ];

  // Navigation Logic

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();

    setCurrentIdx((prev) => (prev + 1) % photoCount);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();

    setCurrentIdx((prev) => (prev === 0 ? photoCount - 1 : prev - 1));
  };

  const handleContactClick = () => {
    if (!apt) {
      return;
    }

    if (isDesktop) {
      setShowAgentPhone((prev) => !prev);

      return;
    }

    window.location.href = `tel:${apt.agent.phone.replace(/\s+/g, "")}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-blue-100 pb-14">
      <Header />

      {/* --- 1. SINGLE IMAGE CAROUSEL GALLERY --- */}

      <section className="px-6 pt-5 max-w-350 mx-auto">
        <div
          onClick={() => setIsOpen(true)}
          className="relative group h-125 md:h-162.5 rounded-[3rem] overflow-hidden bg-slate-100 cursor-zoom-in shadow-2xl shadow-blue-900/5"
        >
          {/* Main Active Image */}

          <AnimatePresence mode="wait">
            <motion.img
              key={currentIdx}
              src={images[currentIdx]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
              alt={`View ${currentIdx + 1}`}
            />
          </AnimatePresence>

          {/* Overlay Gradient */}

          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Navigation Buttons */}

          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 pointer-events-none z-10">
            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl pointer-events-auto hover:bg-white text-blue-600 active:scale-90 transition-transform"
              onClick={prevImg}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl pointer-events-auto hover:bg-white text-blue-600 active:scale-90 transition-transform"
              onClick={nextImg}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>

          {/* Image Counter Badge */}

          <div className="absolute bottom-7 left-7 z-10 flex items-center gap-2.5">
            <Badge className="bg-white/90 backdrop-blur-md text-blue-600 px-5 py-2.5 text-[11px] font-black tracking-[0.2em] border-none shadow-lg rounded-xl">
              <Camera className="w-4 h-4 mr-2 inline" /> {currentIdx + 1} /{" "}
              {photoCount} ЗУРАГ
            </Badge>
          </div>

          {/* --- CENTERED PAGINATION DOTS (Fixed) --- */}

          <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2 bg-black/10 p-2.5 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 transition-all duration-300 rounded-full",

                  currentIdx === i
                    ? "w-10 bg-blue-500 shadow-md"
                    : "w-2 bg-white/60 hover:bg-white/90",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- 2. LIGHTBOX MODAL --- */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-white/98 backdrop-blur-3xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-4 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-110"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>

            <div className="absolute inset-x-8 flex justify-between pointer-events-none z-110">
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16 rounded-full bg-white shadow-2xl pointer-events-auto"
                onClick={prevImg}
              >
                <ChevronLeft className="w-10 h-10 text-blue-600" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16 rounded-full bg-white shadow-2xl pointer-events-auto"
                onClick={nextImg}
              >
                <ChevronRight className="w-10 h-10 text-blue-600" />
              </Button>
            </div>

            <motion.img
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[currentIdx]}
              className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. MAIN CONTENT --- */}

      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-1 gap-11 px-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-11">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full border-none bg-blue-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {propertyTypeLabel}
              </Badge>

              <Badge className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                {paymentMethodLabels[apt.paymentMethod]}
              </Badge>

              <Badge className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                {commissioned ? "Ашиглалтанд орсон" : "Захиалгаар"}
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              {apt.title}
            </h1>

            <div className="flex w-fit items-center gap-2.5 rounded-2xl border border-slate-100 bg-white px-5 py-3 text-slate-500 font-bold shadow-sm transition-shadow hover:shadow-md">
              <MapPin className="w-6 h-6 text-blue-600" /> {apt.address},{" "}
              {apt.district}
            </div>
          </div>

          {/* Specs Grid */}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <SpecCard icon={Bed} label="ӨРӨӨ" val={apt.rooms} />

            <SpecCard icon={Maximize2} label="ТАЛБАЙ" val={`${apt.sqm} м²`} />

            <SpecCard icon={Building} label="ДАВХАР" val={apt.floor} />

            <SpecCard icon={Bath} label="АРИУН ЦЭВЭР" val={apt.bathrooms} />
          </div>

          {/* DESCRIPTION */}

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
              <Info className="w-6 h-6 text-blue-600" /> Танилцуулга
            </h3>

            <p className="rounded-3xl border border-slate-100 bg-white p-6 text-lg font-medium leading-relaxed text-slate-600 shadow-sm">
              {apt.description}
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
              <Building2 className="w-6 h-6 text-blue-600" /> Дэлгэрэнгүй
              мэдээлэл
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {detailItems.map((item) => (
                <DetailRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
              <Sparkles className="w-6 h-6 text-blue-600" /> Онцлог, боломжууд
            </h3>

            <div className="flex flex-wrap gap-2.5 rounded-4xl border border-slate-100 bg-white p-5 shadow-sm">
              {apt.features.length > 0 ? (
                apt.features.map((feature) => (
                  <Badge
                    key={feature}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-wide text-slate-700"
                  >
                    {feature}
                  </Badge>
                ))
              ) : (
                <p className="text-sm font-medium text-slate-500">
                  Онцлог мэдээлэл оруулаагүй байна.
                </p>
              )}
            </div>
          </section>

          {/* NEAREST THINGS */}

          <section className="rounded-[3rem] border border-blue-100/50 bg-blue-50/40 p-7 space-y-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight flex-1">
                <MapPin className="w-6 h-6 text-blue-600" /> Ойр орчимд
              </h3>

              <Badge className="bg-white text-blue-600 border-blue-100 font-black px-4 py-1.5 shrink-0">
                500м дотор
              </Badge>
            </div>

            {nearbyGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {nearbyGroups.map(([type, services]) => {
                  const meta =
                    nearbyServiceMeta[type as keyof typeof nearbyServiceMeta] ??
                    nearbyServiceMeta.supermarket;

                  return (
                    <NearbyGroup
                      key={type}
                      icon={meta.icon}
                      title={meta.title}
                      items={services.map(
                        (service) =>
                          `${service.name} (${service.distance}, ${service.walkTime})`,
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-4xl border border-dashed border-blue-200 bg-white/80 p-6 text-sm font-medium text-slate-500">
                Ойр орчмын үйлчилгээний мэдээлэл одоогоор оруулаагүй байна.
              </div>
            )}
          </section>
        </div>

        {/* --- LIGHT SIDEBAR CARD --- */}

        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 space-y-4">
            <div className="relative overflow-hidden rounded-[3.5rem] border border-blue-100 bg-white p-7 shadow-2xl shadow-blue-500/10 group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 blur-[60px] rounded-full group-hover:bg-blue-100 transition-colors" />

              <p className="relative z-10 mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                Худалдах үнэ
              </p>

              <h2 className="relative z-10 mb-1 text-5xl font-black tracking-tighter text-slate-900">
                {formatPrice(apt.price)}
              </h2>

              <p className="relative z-10 mb-7 font-bold text-slate-400">
                {formatPrice(apt.pricePerSqm)} / м²
              </p>

              <div className="relative z-10 mb-6 grid grid-cols-2 gap-2.5">
                <SidebarInfo label="Өрөө" value={`${apt.rooms}`} />

                <SidebarInfo
                  label="Ариун цэврийн өрөө"
                  value={`${apt.bathrooms}`}
                />

                <SidebarInfo label="Талбай" value={`${apt.sqm} м²`} />

                <SidebarInfo
                  label="Давхар"
                  value={`${apt.floor}/${apt.totalFloors}`}
                />
              </div>

              <div className="relative z-10 space-y-3">
                <Button
                  type="button"
                  onClick={handleContactClick}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-black shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform"
                >
                  <>
                    <Phone className="w-5 h-5 mr-3" />

                    {isDesktop && showAgentPhone
                      ? apt.agent.phone
                      : "Холбогдох"}
                  </>
                </Button>

                {isDesktop && showAgentPhone && (
                  <p className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-700">
                    Дугаар харагдлаа. Гар утаснаас нээвэл шууд залгана.
                  </p>
                )}
              </div>
            </div>

            {/* Agent Info */}

            <Link
              href={`/agents/${apt.agent.id}`}
              className="block rounded-[2.5rem] transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 rounded-[2.5rem] border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <img
                  src={apt.agent.avatar}
                  className="w-14 h-14 rounded-2xl object-cover"
                  alt="Agent"
                />

                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-sm">
                    {apt.agent.name}
                  </h4>

                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">
                    ⭐ {apt.agent.rating} Үнэлгээ
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {apt.agent.company}
                  </p>

                  <div className="mt-2 space-y-1 text-[11px] font-medium text-slate-500">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-blue-600" />

                      {apt.agent.phone}
                    </p>

                    <p className="flex items-center gap-2 break-all">
                      <Mail className="h-3.5 w-3.5 text-blue-600" />

                      {apt.agent.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5 text-blue-600" />
                      {apt.agent.listingsCount} зар, {apt.agent.reviewCount}{" "}
                      сэтгэгдэл
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />

                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Профайл
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto mt-10 space-y-8 px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 font-black text-[10px] tracking-widest uppercase">
              Танд санал болгох
            </Badge>

            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              Ойролцоох <span className="text-blue-600">зарууд</span>
            </h3>

            <p className="text-slate-400 font-bold tracking-tight max-w-md">
              Энэ байршилтай ойрхон болон ижил төрлийн зарагдаж буй бусад
              боломжууд
            </p>
          </div>

          <Button
            variant="ghost"
            className="group relative flex items-center gap-2 px-8 h-14 font-black text-xs uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-blue-100"
          >
            Бүх зарыг үзэх
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
        </div>

        {/* Apartment Cards Grid */}

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {relatedApartments.map((relatedApt, i) => (
            <motion.div
              key={relatedApt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ApartmentCard apartment={relatedApt} index={i} />
            </motion.div>
          ))}
        </div>

        {/* Call to Action Banner (Optional - Extra Polish) */}
      </section>
    </div>
  );
}

// Helper Components

function SpecCard({ icon: Icon, label, val }: any) {
  return (
    <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-lg">
      <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-600">
        <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
      </div>

      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="text-xl font-black text-slate-900 tracking-tight">{val}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 rounded-4xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>

        <p className="text-base font-black tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function SidebarInfo({ label, value }: any) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function NearbyGroup({ icon: Icon, title, items }: any) {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-100/50 bg-white/50 p-5 shadow-inner transition-shadow hover:shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-50 bg-white shadow-sm">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      <div className="space-y-2">
        <h5 className="font-black text-slate-900 text-sm uppercase tracking-tight">
          {title}
        </h5>

        <div className="space-y-1">
          {items.map((item: string, i: number) => (
            <p
              key={i}
              className="text-xs text-slate-500 font-bold tracking-tight opacity-70 italic"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
