import { DistrictGrid, SurroundingsGrid } from "../selection-grids";

import { FieldCard } from "../inputs";

import { MapPin, Crosshair, Loader2, Navigation } from "lucide-react";

import { Input } from "@/components/ui/input";

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
    handleUseCurrentLocation,
    handleUsePinMode,
    handleMapPinChange,
  } = locationState;

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
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className={cn(
              "h-auto min-h-24 items-start justify-start rounded-[1.8rem] border-2 px-6 py-5 text-left transition-all",
              locationMode === "auto"
                ? "border-[#2a00ff] bg-[#f0f2ff] text-[#1a0b3b]"
                : "border-slate-100 bg-white text-slate-500 hover:border-[#2a00ff]/30",
            )}
          >
            <div className="flex items-start gap-4 text-align-center text alig">
              <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3f0fb] text-[#2a00ff]">
                {isLocating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Crosshair className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">
                  Миний байршил
                </p>
                <p className="text-sm font-semibold leading-5">
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
              "h-auto min-h-24 items-start justify-start rounded-[1.8rem] border-2 px-6 py-5 text-left transition-all",
              locationMode === "pin"
                ? "border-[#2a00ff] bg-[#f0f2ff] text-[#1a0b3b]"
                : "border-slate-100 bg-white text-slate-500 hover:border-[#2a00ff]/30",
            )}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3f0fb] text-[#2a00ff]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">
                  Pin тавих
                </p>
                <p className="text-sm font-semibold leading-5">
                  Газрын зураг дээр байршилаа заах.
                </p>
              </div>
            </div>
          </Button>
        </div>

        {/* 3. Map Section */}
        <div className="space-y-4 rounded-4xl border border-slate-100 bg-slate-50 p-4 ">
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

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <Navigation className="h-5 w-5 text-[#2a00ff]" />
            <p className="text-sm font-bold text-[#1a0b3b]">
              {locationDetail || "Map дээр pin-ээ байрлуулж хаяг авна уу."}
            </p>
          </div>
        </div>

        {/* 4. Single Detailed Address Field */}
        <FieldCard
          label="Дэлгэрэнгүй хаяг"
          icon={MapPin}
          iconColor="text-[#2a00ff]"
        >
          <Input
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Хотхон, байр, орц, давхар болон хаалганы дугаар..."
            className={cn(
              "h-16 rounded-2xl border-none bg-slate-100/50 pl-20 pr-6 text-lg font-bold text-[#1a0b3b] transition-all",
              "outline-none focus:outline-none focus-visible:outline-none",
              "focus:ring-2 focus:ring-[#2a00ff] focus-visible:ring-2 focus-visible:ring-[#2a00ff]",
              "ring-offset-0 focus-visible:ring-offset-0",
            )}
          />
        </FieldCard>

        {/* 5. Surroundings */}
        <SurroundingsGrid
          value={formData.surroundings}
          onToggle={(id) => {
            const cur = formData.surroundings;
            updateField(
              "surroundings",
              cur.includes(id)
                ? cur.filter((i: any) => i !== id)
                : [...cur, id],
            );
          }}
        />

      </FormSection>
    </div>
  );
}
