import { DistrictGrid } from "../selection-grids";

import { FieldCard } from "../inputs";

import { MapPin, Crosshair, Loader2, Navigation, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { FormSection } from "../form-shell";
const LocationPickerMap = dynamic(
  () => import("../location-picker-map").then((mod) => mod.LocationPickerMap),
  {
    ssr: false, // This tells Next.js NOT to load the map on the server
    loading: () => (
      <div className="h-72 w-full animate-pulse rounded-3xl bg-slate-100" />
    ),
  },
);

import { cn } from "@/lib/utils";

import { useEffect } from "react";
import dynamic from "next/dynamic";

export function LocationStep({
  formData,
  updateField,
  locationState,
}: any) {
  const {
    isLocating,
    locationMode,
    coordinates,
    currentCoordinates,
    locationDetail, // This is the address from the map
    isNearbyLoading,
    handleUseCurrentLocation,
    handleUsePinMode,
    handleMapPinChange,
  } = locationState;
  const nearbyTypeLabels: Record<string, string> = {
    school: "Сургууль",
    supermarket: "Дэлгүүр",
    bus: "Автобус",
    hospital: "Эмнэлэг",
  };

  // AUTO-SYNC: When the map finds a locationDetail, put it in the address field
  useEffect(() => {
    if (locationDetail) {
      updateField("address", locationDetail);
    }
  }, [locationDetail]);

  return (
    <div className="w-full">
      <FormSection
        eyebrow="Байршил"
        title="Хаана"
        accent="байрлаж байна?"
        description="Газрын зураг дээр байршлаа зааж өгснөөр харилцагчид олоход хялбар байх болно."
      >
        {/* 1. District Selection */}
        <DistrictGrid
          value={formData.district}
          onChange={(v) => updateField("district", v)}
        />

        {/* 2. Mode Selection */}
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className={cn(
              "h-auto min-h-18 items-start justify-start rounded-2xl border-2 px-4 py-3 text-left transition-all md:min-h-22 md:rounded-[1.6rem] md:px-5 md:py-4",
              locationMode === "auto"
                ? "border-[#2a00ff] bg-[#f0f2ff] text-[#1a0b3b]"
                : "border-slate-100 bg-white text-slate-500 hover:border-[#2a00ff]/30",
            )}
          >
            <div className="flex items-start gap-2.5 text-align-center text alig md:gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f0fb] text-[#2a00ff] md:h-11 md:w-11 md:rounded-2xl">
                {isLocating ? (
                  <Loader2 className="h-4 w-4 animate-spin md:h-5 md:w-5" />
                ) : (
                  <Crosshair className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] md:text-[11px] md:tracking-[0.2em]">
                  Миний байршил
                </p>
                <p className="text-xs font-semibold leading-4.5 md:text-sm md:leading-5">
                  Одоогийн байгаа газраа шууд оруулах.
                </p>
              </div>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleUsePinMode}
            className={cn(
              "h-auto min-h-18 items-start justify-start rounded-2xl border-2 px-4 py-3 text-left transition-all md:min-h-22 md:rounded-[1.6rem] md:px-5 md:py-4",
              locationMode === "pin"
                ? "border-[#2a00ff] bg-[#f0f2ff] text-[#1a0b3b]"
                : "border-slate-100 bg-white text-slate-500 hover:border-[#2a00ff]/30",
            )}
          >
            <div className="flex items-start gap-2.5 md:gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f0fb] text-[#2a00ff] md:h-11 md:w-11 md:rounded-2xl">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] md:text-[11px] md:tracking-[0.2em]">
                  Pin тавих
                </p>
                <p className="text-xs font-semibold leading-4.5 md:text-sm md:leading-5">
                  Газрын зураг дээр байршилаа заах.
                </p>
              </div>
            </div>
          </Button>
        </div>

        {/* 3. Map Section */}
        <div className="space-y-3 rounded-3xl border border-slate-100 bg-slate-50 p-3 md:space-y-4 md:rounded-4xl md:p-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
              Газрын зураг
            </p>
            <span className="text-[10px] font-bold text-slate-400">
              {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
            </span>
          </div>

          <LocationPickerMap
            coordinates={coordinates}
            currentCoordinates={currentCoordinates}
            onPinChange={handleMapPinChange}
          />

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm md:gap-3 md:rounded-2xl md:p-4">
            <Navigation className="h-4 w-4 text-[#2a00ff] md:h-5 md:w-5" />
            <p className="text-xs font-bold text-[#1a0b3b] md:text-sm">
              {locationDetail || "Map дээр pin-ээ байрлуулж хаяг авна уу."}
            </p>
          </div>
        </div>

        {/* 4. Detailed Address Field */}
        <FieldCard
          label="Дэлгэрэнгүй хаяг"
          icon={MapPin}
          iconColor="text-[#2a00ff]"
        >
          <Textarea
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Хотхон, байр, орц, давхар болон хаалганы дугаар..."
            className={cn(
              "min-h-24 rounded-xl border-none bg-slate-100/50 pl-12 pr-4 pt-3 text-sm font-bold text-[#1a0b3b] transition-all resize-none md:min-h-28 md:rounded-2xl md:pl-16 md:pr-6 md:pt-4 md:text-base",
              "outline-none focus:outline-none focus-visible:outline-none",
              "focus:ring-2 focus:ring-[#2a00ff] focus-visible:ring-2 focus-visible:ring-[#2a00ff]",
              "ring-offset-0 focus-visible:ring-offset-0",
            )}
          />
        </FieldCard>

        {/* 5. Auto nearby services (free OSM) */}
        <div className="space-y-3 rounded-3xl border border-slate-100 bg-[#fff9fd] p-3 md:rounded-4xl md:p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Ойр орчимд
            </p>
            {isNearbyLoading ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2a00ff]">
                <Loader2 className="h-3 w-3 animate-spin" />
                Уншиж байна...
              </span>
            ) : null}
          </div>

          {formData.nearbyServices.length === 0 ? (
            <p className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-xs font-semibold text-slate-500 md:rounded-2xl md:px-4 md:py-3 md:text-sm">
              GPS эсвэл pin сонговол ойролцоох сургууль, дэлгүүр, автобус, эмнэлгийг автоматаар авна.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {formData.nearbyServices.map((service: any, idx: number) => (
                <div
                  key={`${service.type}-${idx}`}
                  className="rounded-2xl border border-slate-100 bg-white p-3"
                >
                  <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
                    {nearbyTypeLabels[service.type] || service.type}
                  </p>
                  <p className="truncate text-sm font-black text-[#1a0b3b]">
                    {service.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] font-bold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#2a00ff]" />
                      {service.distance}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.walkTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </FormSection>
    </div>
  );
}
