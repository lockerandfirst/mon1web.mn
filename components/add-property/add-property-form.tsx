"use client";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, MapPin, Ruler } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildCreateListingPayload } from "@/lib/backend-contract";
import { agents } from "@/lib/data";
import {
  createMarketplaceListingFromPayload,
  readMarketplaceListings,
  writeMarketplaceListings,
} from "@/lib/marketplace";
import {
  AGENT_OPTIONS,
  DEFAULT_FORM,
  FEATURE_GUIDE,
  PROPERTY_TYPE_OPTIONS,
} from "./constants";
import { FormSection, FormStepper, StepNavigation } from "./form-shell";
import { FieldCard, MetricCard, PlainField } from "./inputs";
import {
  ChoiceRow,
  DistrictGrid,
  PropertyTypeGrid,
  SurroundingsGrid,
} from "./selection-grids";
import { ServicePicker } from "./service-picker";
import { SidebarPanel } from "./sidebar-panel";
import { SuccessState } from "./success-state";
import type { FormData } from "./types";

export function AddPropertyForm() {
  const { user } = useUser();
  const formTopRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const pricePerSqm = useMemo(() => {
    const p = Number(formData.price);
    const s = Number(formData.sqm);
    return p > 0 && s > 0 ? Math.round(p / s).toLocaleString() : null;
  }, [formData.price, formData.sqm]);

  const propertyLabel = useMemo(() => {
    const property = PROPERTY_TYPE_OPTIONS.find(
      (item) => item.value === formData.propertyType,
    );
    return property?.label || "Сонгоогүй";
  }, [formData.propertyType]);

  const selectedAgent = useMemo(
    () =>
      AGENT_OPTIONS.find((agent) => agent.id === formData.selectedAgentId) ??
      null,
    [formData.selectedAgentId],
  );

  const completionScore = useMemo(() => {
    const checklist = [
      Boolean(formData.propertyType),
      Boolean(formData.price),
      Boolean(formData.sqm),
      Boolean(formData.district),
      Boolean(formData.location),
      Boolean(formData.floor),
      Boolean(formData.totalFloors),
      Boolean(formData.description.trim()),
    ];
    const done = checklist.filter(Boolean).length;
    return Math.round((done / checklist.length) * 100);
  }, [formData]);

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setCurrentStep(1);
    setShowSuccess(false);
    setIsAiProcessing(false);
  };

  const validateStep = (step: number) => {
    if (
      step === 1 &&
      (!formData.propertyType || !formData.price || !formData.sqm)
    ) {
      toast.error("Төрөл, үнэ, талбайгаа бөглөнө үү");
      return false;
    }

    if (step === 2 && (!formData.district || !formData.location)) {
      toast.error("Байршлын мэдээллээ гүйцээж өгнө үү");
      return false;
    }

    if (
      step === 3 &&
      (!formData.floor || !formData.totalFloors || !formData.description.trim())
    ) {
      toast.error("Дэлгэрэнгүй мэдээллээ гүйцээж өгнө үү");
      return false;
    }

    if (
      step === 3 &&
      formData.serviceType === "agent" &&
      !formData.selectedAgentId
    ) {
      toast.error("Агент сонгоно уу");
      return false;
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  useEffect(() => {
    if (currentStep === 1) {
      return;
    }

    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  const handleAiOptimize = async () => {
    if (!formData.description.trim()) {
      toast.error("Эхлээд тайлбар бичнэ үү");
      return;
    }

    setIsAiProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const locationText = [formData.district, formData.location]
      .filter(Boolean)
      .join(", ");
    const nearbyText =
      formData.surroundings.length > 0
        ? `Ойр орчимд ${formData.surroundings.length} төрлийн үйлчилгээтэй.`
        : "Ойр орчны давуу талыг онцолж болно.";

    updateField(
      "description",
      `✨ Онцлох санал: ${formData.description.trim()}\n\n📍 Байршил: ${locationText || "Байршлаа нэмж өгнө үү"}.\n${nearbyText}`,
    );
    setIsAiProcessing(false);
    toast.success("Тайлбарыг илүү дэлгэрэнгүй болголоо");
  };

  const handleSubmit = () => {
    if (!validateStep(3)) {
      return;
    }

    const fallbackAgent =
      selectedAgent || agents.find((agent) => agent.verified) || agents[0];

    const requestPayload = buildCreateListingPayload({
      ...formData,
      submittedBy: {
        name: user?.fullName || "Хэрэглэгч",
        email: user?.primaryEmailAddress?.emailAddress || "user@mon1.local",
      },
    });

    const nextListing = createMarketplaceListingFromPayload(
      requestPayload,
      fallbackAgent,
    );

    const currentListings = readMarketplaceListings();
    writeMarketplaceListings([nextListing, ...currentListings]);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return <SuccessState onReset={resetForm} />;
  }

  return (
    <div ref={formTopRef} className="space-y-8 pb-20">
      <Toaster position="top-center" richColors />
      <FormStepper currentStep={currentStep} />

      <div className="flex gap-10">
        <div className="min-w-0 space-y-8 md:col-span-7 lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
              >
                <FormSection
                  eyebrow="Үндсэн Мэдээлэл"
                  title="Зарын"
                  accent="сууриа"
                  description="Эхний алхам дээр төрлөө сонгоод үндсэн тоон мэдээллээ бөглө. Buy request шиг шууд ойлгогдох том сонголтуудтай болголоо."
                >
                  <PropertyTypeGrid
                    value={formData.propertyType}
                    onChange={(value) => updateField("propertyType", value)}
                  />

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <ChoiceRow
                      label="Өрөөний тоо"
                      activeValue={formData.rooms}
                      color="blue"
                      options={["1", "2", "3", "4", "5+"]}
                      onChange={(value) => updateField("rooms", value)}
                    />
                    <ChoiceRow
                      label="Ариун цэврийн өрөө"
                      activeValue={formData.bathrooms}
                      color="pink"
                      options={["1", "2", "3"]}
                      onChange={(value) => updateField("bathrooms", value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FieldCard
                      label="Үнэ (₮)"
                      icon={DollarSign}
                      iconColor="text-[#ff3bad]"
                    >
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateField("price", e.target.value)}
                        placeholder="үнэ"
                        className="h-18 rounded-[1.8rem] border-none bg-[#f8f6ff] pl-14 text-2xl font-black text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5"
                      />
                    </FieldCard>

                    <FieldCard
                      label="Талбай (м²)"
                      icon={Ruler}
                      iconColor="text-[#2a00ff]"
                    >
                      <Input
                        type="number"
                        value={formData.sqm}
                        onChange={(e) => updateField("sqm", e.target.value)}
                        placeholder="метр квадрат"
                        className="h-18 rounded-[1.8rem] border-none bg-[#f8f6ff] pl-14 text-2xl font-black text-[#1a0b3b] focus:ring-8 focus:ring-[#ff2bad]/5"
                      />
                    </FieldCard>
                  </div>

                  {pricePerSqm && (
                    <MetricCard
                      label="Нэг м² үнэ"
                      value={pricePerSqm}
                      suffix="₮ / м²"
                    />
                  )}

                  <StepNavigation onNext={goNext} nextLabel="Байршил руу" />
                </FormSection>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
              >
                <FormSection
                  eyebrow="Байршил"
                  title="Хаана"
                  accent="байрлаж байна?"
                  description="Дүүрэг, хаяг, ойр орчмын мэдээлэл нь зарыг илүү бодит, илүү итгэлтэй харагдуулна."
                >
                  <DistrictGrid
                    value={formData.district}
                    onChange={(value) => updateField("district", value)}
                  />

                  <FieldCard
                    label="Дэлгэрэнгүй хаяг"
                    icon={MapPin}
                    iconColor="text-[#ff3bad]"
                  >
                    <Input
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Зайсан, River Garden, Academy..."
                      className="h-18 rounded-[1.8rem] border-none bg-[#f8f6ff] pl-14 text-lg font-bold text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5"
                    />
                  </FieldCard>

                  <SurroundingsGrid
                    value={formData.surroundings}
                    onToggle={(id) => {
                      const current = formData.surroundings;
                      updateField(
                        "surroundings",
                        current.includes(id)
                          ? current.filter((item) => item !== id)
                          : [...current, id],
                      );
                    }}
                  />

                  <StepNavigation
                    onBack={() => setCurrentStep(1)}
                    onNext={goNext}
                    nextLabel="Нийтлэх хэсэг"
                  />
                </FormSection>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <FormSection
                  eyebrow="Нийтлэх"
                  title="Илүү"
                  accent="дэлгэрэнгүй болгоё"
                  description="Сүүлийн алхамыг илүү ажил хэрэгч болголоо. Давхар, барилгын мэдээлэл, тайлбар, нийтлэх аргаа эндээс шийднэ."
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <PlainField
                      label="Хэдэн давхарт вэ?"
                      value={formData.floor}
                      placeholder="8"
                      onChange={(value) => updateField("floor", value)}
                    />
                    <PlainField
                      label="Нийт хэдэн давхар вэ?"
                      value={formData.totalFloors}
                      placeholder="16"
                      onChange={(value) => updateField("totalFloors", value)}
                    />
                  </div>

                  <div className="rounded-4xl border border-[#ebe3ff] bg-[#f8f6ff] p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
                      Тайлбарт оруулах санал
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {FEATURE_GUIDE.map((item) => (
                        <div
                          key={item}
                          className="rounded-[1.25rem] bg-white px-4 py-3 text-sm font-semibold text-[#6d4d84]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Байрны давуу тал, нар үзэлт, засвар, зогсоол, сургууль болон үйлчилгээний төвийн ойр байдал зэргийг дэлгэрэнгүй бичнэ үү..."
                      className="min-h-[15rem] rounded-[2rem] border-none bg-[#fff9fd] p-6 pr-32 text-base font-bold text-[#1a0b3b] resize-none focus:ring-8 focus:ring-[#2a00ff]/5"
                    />
                    <Button
                      type="button"
                      onClick={handleAiOptimize}
                      disabled={isAiProcessing}
                      className="absolute bottom-4 right-4 h-11 rounded-xl bg-[#1a0b3b] px-4 text-[10px] font-black uppercase tracking-[0.18em] text-white hover:bg-[#2a00ff]"
                    >
                      AI засах
                    </Button>
                  </div>

                  <ServicePicker
                    serviceType={formData.serviceType}
                    selectedAgentId={formData.selectedAgentId}
                    onServiceChange={(value) => {
                      updateField("serviceType", value);
                      if (value === "self") {
                        updateField("selectedAgentId", null);
                      }
                    }}
                    onAgentSelect={(value) =>
                      updateField("selectedAgentId", value)
                    }
                  />

                  <StepNavigation
                    onBack={() => setCurrentStep(2)}
                    onNext={handleSubmit}
                    nextLabel="Зар нэмэх"
                    submit
                  />
                </FormSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SidebarPanel
          completionScore={completionScore}
          formData={formData}
          pricePerSqm={pricePerSqm}
          propertyLabel={propertyLabel}
          selectedAgentName={
            formData.serviceType === "agent"
              ? selectedAgent?.name || "Сонгоогүй"
              : "Өөрөө нийтэлнэ"
          }
        />
      </div>
    </div>
  );
}
