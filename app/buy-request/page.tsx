"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";

import {
  FormSection,
  FormStepper,
  StepNavigation,
} from "@/components/add-property/form-shell";
import {
  DistrictGrid,
  PropertyTypeGrid,
} from "@/components/add-property/selection-grids";
import { LISTING_PROPERTY_CATEGORIES } from "@/lib/property-types";
import { buildCreateBuyRequestPayload } from "@/lib/backend-contract";
import { apiFetch } from "@/lib/backend-api";
import { debug } from "@/lib/debug";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function BuyRequestPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "apartment",
    district: "",
    location: "",
    budget: "",
    rooms: "2",
    sqm: "",
    contactPhone: "",
    notes: "",
    barterOffer: "",
    barterTarget: "",
    cashDifference: "",
  });

  const isBarterRequest = formData.propertyType === "barter";
  const isLandRequest = formData.propertyType === "land";

  const nextLabel = step === 3 ? "Хүсэлт илгээх" : "Үргэлжлүүлэх";

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    startTransition(async () => {
      const requestPayload = buildCreateBuyRequestPayload({
        ...formData,
        submittedBy: {
          name: user.fullName || "Хэрэглэгч",
          email: user.primaryEmailAddress?.emailAddress || "user@mon1.local",
        },
      });
      try {
        const token = await getToken();
        await apiFetch("/api/buy-requests", {
          method: "POST",
          token,
          body: requestPayload,
        });
        setStatus("success");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Сервертэй холбогдоход алдаа гарлаа.";
        debug.error("buy-request", "submit failed", { message });
        setErrorMessage(message);
        setStatus("error");
      }
    });
  };

  if (status === "success") {
    return <SuccessUI onHome={() => router.push("/home")} />;
  }

  if (status === "error") {
    return (
      <ErrorUI
        message={errorMessage}
        onRetry={() => {
          setStatus("idle");
          setErrorMessage("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="container mx-auto px-3 pb-[max(0rem,env(safe-area-inset-bottom,0px)+5rem)] pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] sm:px-4 md:px-4 md:pb-12 md:pt-10 lg:py-12">
        <div className="mx-auto max-w-4xl space-y-3 md:space-y-6 md:mt-2">
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <p className="w-full text-[9px] font-black uppercase tracking-wide text-slate-400 md:hidden">
              Худалдан авах хүсэлт
            </p>
            <FormStepper
              currentStep={step}
              ariaLabel="Худалдан авах хүсэлтийн алхмууд"
            />
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full min-w-0"
          >
            {step === 1 && (
              <FormSection
                eyebrow="Хүсэлт"
                title="Ямар үл хөдлөх"
                accent="хайж байна вэ?"
                description="Гарчиг, төрөл, холбогдох утсаа оруулна уу."
              >
                <div className="mx-auto max-w-2xl space-y-2.5 md:space-y-3">
                  <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Хүсэлтийн гарчиг
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Жишээ: Хан-Уулд 3 өрөө байр авна"
                    className="h-11 rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-900 transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:h-16 md:rounded-3xl md:px-8 md:text-xl"
                  />
                </div>
                <PropertyTypeGrid
                  value={formData.propertyType}
                  onChange={(v) => updateField("propertyType", v)}
                  options={LISTING_PROPERTY_CATEGORIES}
                  badgeLayoutId="buy-request-type-badge"
                />
                <div className="mx-auto max-w-md space-y-2.5 md:space-y-3">
                  <label className="ml-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <Phone className="h-3 w-3" /> Холбогдох утас
                  </label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) =>
                      updateField("contactPhone", e.target.value)
                    }
                    placeholder="99XX-XXXX"
                    className="h-11 rounded-xl border-none bg-slate-50 px-4 text-center text-sm font-bold text-slate-900 transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:h-16 md:rounded-3xl md:px-8 md:text-xl"
                  />
                </div>
              </FormSection>
            )}

            {step === 2 && (
              <FormSection
                eyebrow="Байршил"
                title="Байршил &"
                accent={isBarterRequest ? "Бартер" : "Төсөв"}
                description="Дүүргээ сонгоод хороолол, төсөв эсвэл бартерын нөхцлөө тодорхойлно уу."
              >
                <div className="space-y-5 md:space-y-6">
                  <DistrictGrid
                    value={formData.district}
                    onChange={(v) => updateField("district", v)}
                  />

                  <div className="space-y-3 md:space-y-4">
                    <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Хороолол эсвэл орчин
                    </Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Зайсан, Яармаг, 120 мянгат..."
                      className="h-12 rounded-2xl border-none bg-slate-50 px-4 text-sm font-bold text-[#1a0b3b] transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:h-16 md:rounded-3xl md:px-8 md:text-xl"
                    />
                  </div>
                </div>

                {isBarterRequest ? (
                  <div className="grid gap-4 pt-2 md:grid-cols-2 md:gap-6 md:pt-4">
                    <div className="space-y-3">
                      <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Та юу санал болгож байна?
                      </label>
                      <Textarea
                        value={formData.barterOffer}
                        onChange={(e) =>
                          updateField("barterOffer", e.target.value)
                        }
                        placeholder="Жишээ: Prius 50, зуслангийн газар, cash нэмнэ..."
                        className="min-h-32 rounded-2xl border-none bg-slate-50 p-3.5 text-sm font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:min-h-45 md:rounded-4xl md:p-6 md:text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Юу сонирхож байна?
                      </label>
                      <Textarea
                        value={formData.barterTarget}
                        onChange={(e) =>
                          updateField("barterTarget", e.target.value)
                        }
                        placeholder="Жишээ: 2 өрөө байр, Хан-Уул дүүрэг, сургууль ойр..."
                        className="min-h-32 rounded-2xl border-none bg-slate-50 p-3.5 text-sm font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:min-h-45 md:rounded-4xl md:p-6 md:text-base"
                      />
                    </div>
                    <div className="md:col-span-2 max-w-md">
                      <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Зөрүү мөнгө байвал
                      </label>
                      <Input
                        value={formData.cashDifference}
                        onChange={(e) =>
                          updateField("cashDifference", e.target.value)
                        }
                        placeholder="Жишээ: 50 сая хүртэл cash нэмнэ"
                        className="mt-2 h-11 rounded-xl border-none bg-slate-50 px-4 text-sm font-bold md:mt-3 md:h-16 md:rounded-3xl md:px-8 md:text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-3 md:space-y-6 md:pt-6">
                    <div className="text-center">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Таны төсөв
                      </label>
                      <div className="flex h-12 items-center justify-center md:h-20">
                        <AnimatePresence mode="wait">
                          {formData.budget ? (
                            <motion.div
                              key="amount"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-baseline gap-3"
                            >
                              <span className="text-2xl font-black tracking-tight text-[#2a00ff] md:text-7xl md:tracking-tighter">
                                {Number(formData.budget).toLocaleString(
                                  "en-US",
                                )}
                              </span>
                              <span className="text-base font-black text-slate-300 md:text-2xl">
                                ₮
                              </span>
                            </motion.div>
                          ) : (
                            <span className="text-2xl font-black tracking-tight text-slate-100 md:text-7xl md:tracking-tighter">
                              0
                            </span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="relative mx-auto max-w-md">
                      <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => updateField("budget", e.target.value)}
                        placeholder="Дүнгээ бичнэ үү..."
                        className="h-12 rounded-2xl border-none bg-slate-100/50 px-4 text-center text-sm font-bold transition-all placeholder:text-slate-300 focus:ring-8 focus:ring-[#2a00ff]/5 md:h-20 md:rounded-4xl md:px-8 md:text-xl"
                      />
                      {formData.budget &&
                        Number(formData.budget) >= 1000000 && (
                          <div className="mt-4 flex justify-center">
                            <div className="rounded-xl bg-[#ff2bad]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#ff2bad] md:rounded-2xl md:px-6 md:py-2 md:text-xs md:tracking-widest">
                              {Number(formData.budget) >= 1000000000
                                ? `${(Number(formData.budget) / 1000000000).toFixed(1)} Тэрбум`
                                : `${(Number(formData.budget) / 1000000).toFixed(0)} Сая`}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </FormSection>
            )}

            {step === 3 && (
              <FormSection
                eyebrow="Нийтлэх"
                title={isBarterRequest ? "Бартерын" : "Нэмэлт"}
                accent={isBarterRequest ? "нөхцөл" : "хүсэлт"}
                description="Өрөө, талбай, нэмэлт тайлбараа бичиж хүсэлтээ илгээнэ үү."
              >
                {isBarterRequest ? (
                  <div className="space-y-4 md:space-y-6">
                    <div className="rounded-2xl bg-[#f8f6ff] p-3.5 md:rounded-[2.5rem] md:p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
                        Бартерын тайлбар
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
                        Солих нөхцөл, зөвшөөрөх сонголт, яаралтай эсэх, нэмэлт
                        cash, хүлээн зөвшөөрөх байршлаа энд тодорхой бичээрэй.
                      </p>
                    </div>

                    <Textarea
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Жишээ: River Garden, Zaisan орчим 2-3 өрөө сонирхоно. Машин + cash хувилбар боломжтой. Яаралтай..."
                      className="min-h-32 rounded-2xl border-none bg-slate-50 p-3.5 text-sm font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:min-h-55 md:rounded-[2.5rem] md:p-8 md:text-lg"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        "grid gap-2.5 md:gap-6",
                        isLandRequest ? "grid-cols-1" : "grid-cols-2",
                      )}
                    >
                      {!isLandRequest ? (
                        <div className="space-y-3">
                          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Өрөөний тоо
                          </label>
                          <Input
                            value={formData.rooms}
                            onChange={(e) => updateField("rooms", e.target.value)}
                            className="h-11 rounded-xl border-none bg-slate-50 px-3.5 text-sm font-bold md:h-16 md:rounded-3xl md:px-8 md:text-xl"
                          />
                        </div>
                      ) : null}
                      <div className="space-y-3">
                        <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Талбай (м²)
                        </label>
                        <Input
                          value={formData.sqm}
                          onChange={(e) => updateField("sqm", e.target.value)}
                          className="h-11 rounded-xl border-none bg-slate-50 px-3.5 text-sm font-bold md:h-16 md:rounded-3xl md:px-8 md:text-xl"
                        />
                      </div>
                    </div>

                    <Textarea
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Жишээ: Цонх урагшаа харсан, сургууль болон цэцэрлэгтэй ойр..."
                      className="min-h-32 rounded-2xl border-none bg-slate-50 p-3.5 text-sm font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5 md:min-h-50 md:rounded-[2.5rem] md:p-8 md:text-lg"
                    />
                  </>
                )}
              </FormSection>
            )}
          </motion.div>

          <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] z-40 mt-4 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_-8px_30px_-12px_rgba(26,11,59,0.12)] backdrop-blur-md supports-backdrop-filter:bg-white/90 md:bottom-4 md:mt-6 md:rounded-4xl md:border-slate-100 md:p-3 md:shadow-xl">
            <StepNavigation
              step={step}
              onBack={step > 1 ? prevStep : undefined}
              onNext={() => {
                if (step === 3) {
                  handleSubmit();
                } else {
                  nextStep();
                }
              }}
              nextLabel={nextLabel}
              submit={step === 3}
              nextDisabled={!isLoaded}
              pending={isPending}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ErrorUI({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8 text-center sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-4xl bg-rose-50 text-[#ff3bad] sm:h-32 sm:w-32 sm:rounded-[3rem]">
          <Phone className="h-10 w-10 sm:h-14 sm:w-14" />
        </div>
        <h2 className="mt-8 text-2xl font-black uppercase leading-tight tracking-tight italic sm:mt-10 sm:text-4xl sm:leading-none sm:tracking-tighter">
          Алдаа гарлаа
        </h2>
        <p className="mt-3 text-sm font-semibold text-slate-500">
          {message || "Хүсэлтийг илгээхэд асуудал гарлаа. Дахин оролдоно уу."}
        </p>
        <Button
          onClick={onRetry}
          className="mt-6 h-12 w-full rounded-2xl bg-[#2a00ff] text-sm font-black uppercase tracking-wider text-white shadow-lg sm:mt-8 sm:h-14"
        >
          Дахин оролдох
        </Button>
      </div>
    </div>
  );
}

function SuccessUI({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8 text-center sm:px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        <div className="mx-auto flex h-24 w-24 rotate-12 items-center justify-center rounded-4xl bg-green-50 text-green-500 sm:h-40 sm:w-40 sm:rounded-[3rem]">
          <CheckCircle2 className="h-12 w-12 sm:h-20 sm:w-20" />
        </div>
        <h2 className="mt-8 text-3xl font-black uppercase leading-tight tracking-tight italic sm:mt-12 sm:text-6xl sm:leading-none sm:tracking-tighter">
          Амжилттай <br /> <span className="text-[#2a00ff]">бүртгэгдлээ!</span>
        </h2>
        <Button
          onClick={onHome}
          className="mt-8 h-14 w-full rounded-3xl bg-[#2a00ff] text-sm font-black uppercase tracking-wider text-white shadow-xl sm:mt-16 sm:h-20 sm:max-w-sm sm:rounded-4xl sm:text-base sm:tracking-widest sm:shadow-2xl"
        >
          Нүүр хуудас руу
        </Button>
      </motion.div>
    </div>
  );
}
