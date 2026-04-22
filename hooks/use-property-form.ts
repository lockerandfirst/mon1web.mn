import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { DEFAULT_FORM } from "@/components/add-property/constants";
import type { FormData } from "@/components/add-property/types";
import { inferDistrictFromNominatim } from "@/lib/infer-ub-district";
import { fetchNearbyServicesFromOsm } from "@/lib/free-nearby-services";

const DEFAULT_COORDINATES = {
  lat: 47.9188,
  lng: 106.9176,
};

type Coordinates = {
  lat: number;
  lng: number;
};

export function usePropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMode, setLocationMode] = useState<"auto" | "pin" | "manual">(
    "manual",
  );
  const [locationHint, setLocationHint] = useState(
    "Байршлаа асаагаад GPS-аар авч болно...",
  );
  const [coordinates, setCoordinates] =
    useState<Coordinates>(DEFAULT_COORDINATES);
  const [currentCoordinates, setCurrentCoordinates] =
    useState<Coordinates | null>(null);
  const [locationDetail, setLocationDetail] = useState<string | null>(null);
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const resolveLocationDetails = useCallback(
    async (nextCoordinates: Coordinates) => {
      setLocationHint("Fetching address...");

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nextCoordinates.lat}&lon=${nextCoordinates.lng}&accept-language=mn,en&zoom=18&addressdetails=1`,
          { headers: { Accept: "application/json" } },
        );

        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        let rawFullAddress = data.display_name || "";

        // --- SCRIPT FILTER ---
        // This Regex targets the Traditional Mongolian Unicode block (U+1800 - U+18AF)
        // and replaces it with nothing, then cleans up extra commas/spaces.
        const mongolianScriptRegex = /[\u1800-\u18AF]+/g;

        const cleanAddress = rawFullAddress
          .replace(mongolianScriptRegex, "") // Remove Hudum script
          .replace(/,\s*,/g, ",") // Remove double commas left behind
          .replace(/^\s*,|,\s*$/g, "") // Trim leading/trailing commas
          .trim();

        const inferredDistrict = inferDistrictFromNominatim(data);
        if (inferredDistrict) {
          updateField("district", inferredDistrict);
        }

        // 1. Хаяг болон «байршил» текст — GPS координатыг энд битгий оруул (зөвхөн coordinates талбарт явна).
        updateField("address", cleanAddress || "Байршил олдсонгүй");
        updateField("location", (cleanAddress || "").trim());

        // 2. Update the UI state
        setLocationDetail(cleanAddress);
        setLocationHint("Location updated");
      } catch (error) {
        console.error("Resolve failed", error);
        updateField("location", "");
        setLocationHint("Could not retrieve address.");
      }
    },
    [updateField],
  );

  const resolveNearbyServices = useCallback(
    async (nextCoordinates: Coordinates) => {
      setIsNearbyLoading(true);
      try {
        const nearby = await fetchNearbyServicesFromOsm(nextCoordinates);
        updateField("nearbyServices", nearby);
      } catch (error) {
        console.error("Nearby services fetch failed", error);
        updateField("nearbyServices", []);
      } finally {
        setIsNearbyLoading(false);
      }
    },
    [updateField],
  );
  const handleAiOptimize = async () => {
    if (!formData.description.trim()) {
      toast.error("Эхлээд тайлбар бичнэ үү");
      return;
    }
    setIsAiProcessing(true);
    // Mocking AI call
    await new Promise((res) => setTimeout(res, 1200));
    const locationText = [formData.district, formData.location]
      .filter(Boolean)
      .join(", ");
    const optimized = `✨ Онцлох санал: ${formData.description.trim()}\n\n📍 Байршил: ${locationText || "Байршлаа нэмж өгнө үү"}.\nОйр орчны болон байрны давуу талаа үргэлжлүүлэн тодруулж болно.`;
    updateField("description", optimized);
    setIsAiProcessing(false);
    toast.success("Тайлбарыг заслаа");
  };

  const pricePerSqm = useMemo(() => {
    const p = Number(formData.price);
    const s = Number(formData.sqm);
    return p > 0 && s > 0 ? Math.round(p / s).toLocaleString() : null;
  }, [formData.price, formData.sqm]);

  const handleUseCurrentLocation = () => {
    setLocationMode("auto");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("GPS авах боломжгүй");
      return;
    }

    setIsLocating(true);
    setLocationHint("Browser дээр location access зөвшөөрнө үү.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const nextCoordinates = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        setCurrentCoordinates(nextCoordinates);
        setCoordinates(nextCoordinates);
        setIsLocating(false);
        await Promise.all([
          resolveLocationDetails(nextCoordinates),
          resolveNearbyServices(nextCoordinates),
        ]);
        toast.success("GPS байршил тогтоолоо");
      },
      () => {
        setIsLocating(false);
        setLocationHint("GPS уншиж чадсангүй. Pin эсвэл гараар бичээрэй.");
        toast.error("Байршил авах зөвшөөрөл хэрэгтэй байна");
      },
    );
  };

  const handleUsePinMode = () => {
    setLocationMode("pin");
    setLocationHint("Map дээр pin-ээ чирч яг барилга дээрээ тавина уу.");
  };

  const handleUseManualMode = () => {
    setLocationMode("manual");
    setLocationHint("Хаяг, орц, давхар, landmark-aa гараар бичиж болно.");
  };

  const handleMapPinChange = useCallback(
    async (nextCoordinates: Coordinates) => {
      setCoordinates(nextCoordinates);
      setLocationMode("pin");
      setLocationHint("Pin шинэчлэгдлээ. Байршлын мэдээллийг шалгаж байна...");
      await Promise.all([
        resolveLocationDetails(nextCoordinates),
        resolveNearbyServices(nextCoordinates),
      ]);
    },
    [resolveLocationDetails, resolveNearbyServices],
  );

  return {
    currentStep,
    setCurrentStep,
    formData,
    updateField,
    pricePerSqm,
    isAiProcessing,
    setIsAiProcessing,
    locationState: {
      isLocating,
      locationMode,
      setLocationMode,
      coordinates,
      currentCoordinates,
      locationDetail,
      isNearbyLoading,
      locationHint,
      setLocationHint,
      handleUseCurrentLocation,
      handleUsePinMode,
      handleUseManualMode,
      handleMapPinChange,
    },
    handleAiOptimize,
  };
}
