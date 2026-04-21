"use client";

import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import { agents } from "@/lib/data";
import { buildCreateListingPayload } from "@/lib/backend-contract";
import {
  createMarketplaceListingFromPayload,
  readMarketplaceListings,
  writeMarketplaceListings,
} from "@/lib/marketplace";
import { usePropertyForm } from "@/hooks/use-property-form";
import { applyListingToForm, upsertEditedListing } from "./editing";

import { FORM_STEPS, PROPERTY_TYPE_OPTIONS } from "./constants";
import { FormStepper, StepNavigation } from "./form-shell";
import { SidebarPanel } from "./sidebar-panel";
import { SuccessState } from "./success-state";
import { BasicInfoStep } from "./steps/BasicInfoSteps";
import { FinalStep } from "./steps/FinalStep";
import { LocationStep } from "./steps/LocationStep";

type AddPropertyFormProps = {
  onSuccess?: () => void;
  editListingId?: string | null;
};

export function AddPropertyForm({
  onSuccess,
  editListingId,
}: AddPropertyFormProps = {}) {
  const { user } = useUser();
  const router = useRouter();
  const formTopRef = useRef<HTMLDivElement>(null);
  const hydratedRef = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    currentStep,
    setCurrentStep,
    formData,
    updateField,
    pricePerSqm,
    locationState,
  } = usePropertyForm();

  const propertyLabel = useMemo(
    () =>
      PROPERTY_TYPE_OPTIONS.find((item) => item.value === formData.propertyType)
        ?.label || "Сонгоогүй",
    [formData.propertyType],
  );

  const selectedAgent = useMemo(
    () =>
      formData.selectedAgentId
        ? (agents.find((agent) => agent.id === formData.selectedAgentId) ??
          null)
        : null,
    [formData.selectedAgentId],
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

  const handleSubmit = () => {
    if (!validateBeforeSubmit()) {
      return;
    }

    const fallbackAgent =
      selectedAgent || agents.find((agent) => agent.verified) || agents[0];

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
      submittedBy: {
        name: user?.fullName || "Хэрэглэгч",
        email: user?.primaryEmailAddress?.emailAddress || "user@mon1.local",
        phone: formData.contactPhone.trim(),
      },
    });

    const nextListing = createMarketplaceListingFromPayload(
      requestPayload,
      fallbackAgent,
    );

    const currentListings = readMarketplaceListings();
    const nextState = upsertEditedListing(
      editListingId,
      nextListing,
      currentListings,
    );
    writeMarketplaceListings(nextState.listings);
    toast.success(
      nextState.didEdit
        ? "Зар амжилттай шинэчлэгдлээ"
        : "Амжилттай бүртгэгдлээ",
    );
    setShowSuccess(true);
    onSuccess?.();
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
    if (!editListingId || hydratedRef.current) {
      return;
    }
    const listing = readMarketplaceListings().find(
      (item) => item.id === editListingId,
    );
    if (!listing) {
      return;
    }
    hydratedRef.current = true;
    applyListingToForm(listing, updateField);
  }, [editListingId, updateField]);

  useEffect(() => {
    if (currentStep === 1) {
      return;
    }

    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  if (showSuccess) {
    return <SuccessState onGoHome={() => router.push("/home")} />;
  }

  const stepMeta = FORM_STEPS[currentStep - 1];

  const nextLabelByStep =
    currentStep === 3
      ? editListingId
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
    handleSubmit();
  };

  const handlePrevStep = () => {
    if (currentStep <= 1) {
      return;
    }
    goToStep(currentStep - 1);
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
    <div ref={formTopRef} className="space-y-4 pb-0 md:space-y-8 md:pb-20">
      <Toaster position="top-center" richColors />
      <div className="flex flex-col gap-1 md:gap-1.5">
        <FormStepper currentStep={currentStep} />
        {stepMeta ? (
          <p className="line-clamp-1 text-center text-[10px] font-bold text-slate-500 md:hidden">
            <span className="text-[#2a00ff]">Одоо:</span> {stepMeta.label}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-5 md:gap-10 md:flex-row md:items-start">
        <div className="min-w-0 w-full md:flex-[1_1_70%]">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full min-w-0"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
          <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] z-40 mt-4 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_-8px_30px_-12px_rgba(26,11,59,0.12)] backdrop-blur-md supports-backdrop-filter:bg-white/90 md:bottom-4 md:mt-6 md:rounded-4xl md:border-slate-100 md:p-3 md:shadow-xl">
            <StepNavigation
              step={currentStep}
              onBack={currentStep > 1 ? handlePrevStep : undefined}
              onNext={handleNextStep}
              nextLabel={nextLabelByStep}
              submit={currentStep === 3}
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
