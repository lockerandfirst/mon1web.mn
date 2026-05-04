"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import { buildCreateListingPayload } from "@/lib/backend-contract";
import { apiFetch, API_BASE_URL } from "@/lib/backend-api";
import { debug } from "@/lib/debug";
import {
  apartmentFromApiListing,
  listingSubmittedByFromApiRow,
} from "@/lib/portal/apartment-from-api-listing";
import { useVerifiedAgents } from "@/hooks/use-verified-agents";
import { usePropertyForm } from "@/hooks/use-property-form";
import { applyListingToForm } from "./editing";

import { PROPERTY_TYPE_OPTIONS } from "./constants";
import { FormStepper, StepNavigation } from "./form-shell";
import { SidebarPanel } from "./sidebar-panel";
import { SuccessState } from "./success-state";
import { BasicInfoStep } from "./steps/BasicInfoSteps";
import { FinalStep } from "./steps/FinalStep";
import { LocationStep } from "./steps/LocationStep";
import { Button } from "@/components/ui/button";

type AddPropertyFormProps = {
  onSuccess?: () => void;
  /** Legacy: `?edit=` query (add-property хуудас) */
  editListingId?: string | null;
  /** `/edit-listing/[id]` — зарын ID замаас шууд (query-ийн асуудлаас зайлсхийх) */
  listingIdToEdit?: string | null;
};

export function AddPropertyForm({
  onSuccess,
  editListingId,
  listingIdToEdit,
}: AddPropertyFormProps = {}) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editQuery = searchParams.get("edit");
  /** Эхлээд замын `[id]`, дараа нь query, эцэст props (add-property `?edit=`). */
  const editId =
    (listingIdToEdit ?? editQuery ?? editListingId ?? "").trim() || null;
  const formTopRef = useRef<HTMLDivElement>(null);
  const hydratedRef = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentStep,
    setCurrentStep,
    formData,
    updateField,
    pricePerSqm,
    locationState,
  } = usePropertyForm();
  const { hydrateMapFromListing } = locationState;
  const { agents: verifiedAgents } = useVerifiedAgents(12);

  const propertyLabel = useMemo(
    () =>
      PROPERTY_TYPE_OPTIONS.find((item) => item.value === formData.propertyType)
        ?.label || "Сонгоогүй",
    [formData.propertyType],
  );

  const completionScore = useMemo(() => {
    const hasLocationPin =
      Boolean(formData.district) &&
      Boolean(formData.address.trim() || formData.location.trim());

    const checklist = [
      Boolean(formData.title.trim()),
      Boolean(formData.propertyType),
      Boolean(formData.price),
      Boolean(formData.sqm),
      hasLocationPin,
      Boolean(formData.floor),
      Boolean(formData.totalFloors),
      Boolean(formData.commissionYear),
      Boolean(formData.description.trim()),
      formData.images.length > 0,
    ];

    return Math.round(
      (checklist.filter(Boolean).length / checklist.length) * 100,
    );
  }, [formData]);

  const validateBeforeSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Зарын гарчгаа оруулна уу");
      return false;
    }

    if (!formData.propertyType || !formData.price || !formData.sqm) {
      toast.error("Төрөл, үнэ, талбайгаа бөглөнө үү");
      return false;
    }

    if (
      !formData.district ||
      (!formData.address.trim() && !formData.location.trim())
    ) {
      toast.error("Байршлын мэдээллээ гүйцээж өгнө үү");
      return false;
    }

    if (
      !formData.floor ||
      !formData.totalFloors ||
      !formData.commissionYear ||
      !formData.description.trim()
    ) {
      toast.error("Дэлгэрэнгүй мэдээллээ гүйцээж өгнө үү");
      return false;
    }

    const phoneDigits = formData.contactPhone.replace(/\D/g, "");
    if (phoneDigits.length < 8) {
      toast.error("Утасны дугаараа зөв оруулна уу");
      return false;
    }

    if (!formData.paymentFlexible && formData.paymentMethods.length === 0) {
      toast.error("Төлбөрийн нөхцөл сонгоно уу");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) {
      return;
    }
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const parseImageUrlsForApi = (imageUrls: string): string[] => {
      const out: string[] = [];
      const seen = new Set<string>();
      for (const line of imageUrls.split("\n")) {
        const s = line.trim();
        if (!s) continue;
        try {
          const u = new URL(s);
          if (u.protocol !== "http:" && u.protocol !== "https:") continue;
        } catch {
          continue;
        }
        if (seen.has(s)) continue;
        seen.add(s);
        out.push(s);
        if (out.length >= 64) break;
      }
      return out;
    };

    const { images: _images, ...listingFields } = formData;
    const nearbyTypeToSurroundingId: Record<string, string> = {
      school: "school",
      supermarket: "shop",
      bus: "bus",
      hospital: "hospital",
    };
    const autoSurroundings = formData.nearbyServices
      .map((item) => nearbyTypeToSurroundingId[item.type])
      .filter((item): item is string => Boolean(item));
    const requestPayload = buildCreateListingPayload({
      ...listingFields,
      surroundings:
        autoSurroundings.length > 0 ? autoSurroundings : formData.surroundings,
      nearbyServices: formData.nearbyServices,
      coordinates: locationState.coordinates,
      submittedBy: {
        name: user?.fullName || "Хэрэглэгч",
        email: user?.primaryEmailAddress?.emailAddress || "user@mon1.local",
        phone: formData.contactPhone.trim(),
      },
    });

    const token = await getToken();
    try {
      let targetListingId: string;

      if (editId) {
        // Edit горим — PATCH дээд дарааллаар ашиглаж зарыг шинэчилнэ.
        const patchBody = {
          title: requestPayload.title,
          propertyType: requestPayload.propertyType,
          price: requestPayload.price,
          paymentMethod: requestPayload.paymentMethod,
          pricePerSqm: requestPayload.pricePerSqm,
          sqm: requestPayload.sqm,
          rooms: requestPayload.rooms,
          bathrooms: requestPayload.bathrooms,
          floor: requestPayload.floor,
          totalFloors: requestPayload.totalFloors,
          commissionYear: requestPayload.commissionYear,
          location: requestPayload.location,
          district: requestPayload.district,
          address: requestPayload.address,
          description: requestPayload.description,
          features: requestPayload.features,
          nearbyServices: requestPayload.nearbyServices,
          coordinates: requestPayload.coordinates,
          serviceType: requestPayload.serviceType,
          contactPhone: formData.contactPhone.trim(),
          images: parseImageUrlsForApi(formData.imageUrls),
        };
        await apiFetch<{ success: boolean; data: { id: string } }>(
          `/api/listings/${encodeURIComponent(editId)}`,
          { method: "PATCH", token, body: patchBody },
        );
        targetListingId = editId;
      } else {
        const listingResponse = await apiFetch<{
          success: boolean;
          data: { id: string };
        }>("/api/listings", {
          method: "POST",
          token,
          body: requestPayload,
        });
        targetListingId = listingResponse.data.id;
      }

      if (formData.images.length > 0) {
        const multipart = new FormData();
        for (const file of formData.images.slice(0, 10)) {
          multipart.append("images", file);
        }

        const uploadResponse = await fetch(
          `${API_BASE_URL}/api/properties/${encodeURIComponent(targetListingId)}/images`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: multipart,
          },
        );

        if (!uploadResponse.ok) {
          const text = await uploadResponse.text();
          throw new Error(text || "Image upload failed");
        }
      }

      toast.success(
        editId ? "Зар амжилттай шинэчлэгдлээ" : "Амжилттай бүртгэгдлээ",
      );
      setShowSuccess(true);
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Сервертэй холбогдоход алдаа гарлаа";
      debug.error("add-property", "submit failed", { message });
      toast.error(message || "Зар илгээх үед алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
      requestAnimationFrame(() => {
        formTopRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [setCurrentStep],
  );

  useEffect(() => {
    hydratedRef.current = false;
  }, [editId]);

  useEffect(() => {
    if (!editId || hydratedRef.current) {
      return;
    }
    let cancelled = false;

    const hydrate = async () => {
      try {
        const res = await apiFetch<{
          success: boolean;
          data: Record<string, unknown>;
        }>(`/api/listings/${encodeURIComponent(editId)}`);
        if (cancelled || !res.data) return;
        const { apartment } = apartmentFromApiListing(res.data);
        const submittedBy = listingSubmittedByFromApiRow(res.data);
        const wf =
          res.data.workflow_status === "published"
            ? "published"
            : ("pending" as const);
        const sel =
          res.data.selected_agent_id == null
            ? null
            : String(res.data.selected_agent_id);
        hydratedRef.current = true;
        applyListingToForm(
          {
            ...apartment,
            workflowStatus: wf,
            selectedAgentId: sel,
            submittedBy: {
              name: submittedBy.name,
              email: submittedBy.email,
              phone: submittedBy.phone,
            },
          },
          updateField,
        );
        hydrateMapFromListing(apartment.coordinates);
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown";
        debug.warn("add-property", "edit hydration failed", { message });
        if (editId) {
          toast.error(
            "Зарын мэдээлэл ачаалж чадсангүй. ID-г шалгаад дахин оролдоно уу.",
          );
        }
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [editId, updateField, hydrateMapFromListing]);

  useEffect(() => {
    if (currentStep === 1) {
      return;
    }

    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  if (showSuccess) {
    return <SuccessState onGoHome={() => router.push("/home")} />;
  }

  const nextLabelByStep =
    currentStep === 3
      ? editId
        ? "Зар шинэчлэх"
        : "Зар нэмэх"
      : "Үргэлжлүүлэх";

  const handleNextStep = () => {
    if (currentStep === 1) {
      goToStep(2);
      return;
    }
    if (currentStep === 2) {
      goToStep(3);
      return;
    }
    void handleSubmit();
  };

  const handlePrevStep = () => {
    if (currentStep <= 1) {
      return;
    }
    goToStep(currentStep - 1);
  };

  const handleDebugFill = () => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    updateField("title", "Debug: Хан-Уулд 3 өрөө байр");
    updateField("propertyType", "apartment");
    updateField("district", "Хан-Уул");
    updateField("location", "Zaisan");
    updateField("address", "Хан-Уул, 15-р хороо, Зайсан");
    updateField("price", "420000000");
    updateField("paymentFlexible", false);
    updateField("paymentMethods", ["cash", "mortgage"]);
    updateField("sqm", "98");
    updateField("rooms", "3");
    updateField("bathrooms", "2");
    updateField("floor", "12");
    updateField("totalFloors", "16");
    updateField("commissionYear", "2021");
    updateField(
      "description",
      "Debug тест зар: орчин, төлбөрийн нөхцөл, байршил бөглөгдсөн.",
    );
    updateField("contactPhone", "99112233");
    updateField("serviceType", "agent");
    updateField("selectedAgentId", verifiedAgents[0]?.id ?? null);
    updateField("surroundings", ["school", "shop", "bus"]);
    updateField("features", ["Parking", "Elevator", "Security", "Balcony"]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            updateField={updateField}
            pricePerSqm={pricePerSqm}
          />
        );
      case 2:
        return (
          <LocationStep
            formData={formData}
            updateField={updateField}
            locationState={locationState}
          />
        );
      default:
        return <FinalStep formData={formData} updateField={updateField} />;
    }
  };

  return (
    <div
      ref={formTopRef}
      className="space-y-3 pb-0 md:mb-0 -mb-20 md:space-y-8 md:pb-20"
    >
      <Toaster position="top-center" richColors />
      {process.env.NODE_ENV === "development" ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl border-[#2a00ff]/20 text-xs font-black text-[#2a00ff]"
            onClick={handleDebugFill}
          >
            <FlaskConical className="mr-1.5 h-4 w-4" />
            Debug бөглөх
          </Button>
        </div>
      ) : null}
      <FormStepper currentStep={currentStep} />
      <div className="flex flex-col gap-5 md:gap-10 md:flex-row md:items-start">
        <div className="min-w-0 w-full md:flex-[1_1_70%]">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full min-w-0"
          >
            {renderStep()}
          </motion.div>
          <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] z-40 mt-4 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_-8px_30px_-12px_rgba(26,11,59,0.12)] backdrop-blur-md supports-backdrop-filter:bg-white/90 md:bottom-4 md:mt-6 md:rounded-4xl md:border-slate-100 md:p-3 md:shadow-xl">
            <StepNavigation
              step={currentStep}
              onBack={currentStep > 1 ? handlePrevStep : undefined}
              onNext={handleNextStep}
              nextLabel={isSubmitting ? "Түр хүлээнэ үү..." : nextLabelByStep}
              submit={currentStep === 3}
              pending={isSubmitting}
              nextDisabled={isSubmitting}
            />
          </div>
        </div>

        <SidebarPanel
          formData={formData}
          completionScore={completionScore}
          pricePerSqm={pricePerSqm}
          propertyLabel={propertyLabel}
        />
      </div>
    </div>
  );
}
