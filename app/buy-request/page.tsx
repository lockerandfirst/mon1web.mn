"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Banknote,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  Building,
  Building2,
  Warehouse,
  TreePine,
  Factory,
  Landmark,
  Map,
  Phone,
  Sparkles,
} from "lucide-react";

import { LISTING_PROPERTY_CATEGORIES } from "@/lib/property-types";
import {
  createBuyRequestFromPayload,
  readBuyRequests,
  writeBuyRequests,
} from "@/lib/buy-requests";
import { buildCreateBuyRequestPayload } from "@/lib/backend-contract";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  apartment: Home,
  "new-apartment": Building,
  house: TreePine,
  office: Building2,
  industrial: Factory,
  land: Map,
  barter: HandshakeIcon,
  rent: Banknote,
  garage: Warehouse,
};

function HandshakeIcon(props: any) {
  return <Landmark {...props} />;
}

const DISTRICTS = ["ХУД", "БЗД", "СХД", "БГД", "СБД", "ЧД"];

export default function BuyRequestPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const [formData, setFormData] = useState({
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

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

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
      const nextRequest = createBuyRequestFromPayload(requestPayload);

      const currentRequests = readBuyRequests();
      writeBuyRequests([nextRequest, ...currentRequests]);
      setStatus("success");
    });
  };

  if (status === "success") {
    return <SuccessUI onHome={() => router.push("/home")} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="container mx-auto px-2.5 py-5 md:px-4 md:py-12 lg:py-12">
        <div className="mx-auto mt-11 max-w-4xl md:mt-13">
          <div className="mb-6 mt-11 rounded-3xl border border-slate-50 bg-white px-2.5 py-3 shadow-[0_45px_90px_-55px_rgba(42,0,255,0.45)] md:mb-16 md:mt-14 md:rounded-[3rem] md:px-7 md:py-5">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="flex min-w-fit items-center gap-1 md:min-w-0 md:flex-1 md:gap-3"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black shadow-sm transition-all md:h-10 md:w-10 md:rounded-xl md:text-sm",
                    step >= num
                      ? "rotate-3 border-[#2a00ff] bg-[#2a00ff] text-white"
                      : "border-[#ffe3f5] bg-[#fff7fc] text-[#ff9ce0]",
                  )}
                >
                  {step > num ? (
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    `0${num}`
                  )}
                </div>
                <div className="hidden min-w-0 flex-col md:flex">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Алхам
                  </span>
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.2em]",
                      step >= num ? "text-[#2a00ff]" : "text-[#ff9ce0]",
                    )}
                  >
                    {num === 1
                      ? "Төрөл"
                      : num === 2
                        ? isBarterRequest
                          ? "Бартер"
                          : "Санхүү"
                        : "Дэлгэрэнгүй"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    {num === 1 ? "Сонголт" : num === 2 ? "Байршил" : "Нийтлэх"}
                  </span>
                </div>
                {num < 3 && (
                  <div className="mx-0.5 h-0.5 w-6 bg-[#f4ecff] md:mx-1 md:w-20" />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl border border-slate-50 bg-white p-3 shadow-[0_50px_100px_-30px_rgba(42,0,255,0.08)] md:rounded-[4rem] md:p-16"
          >
            {step === 1 && (
              <div className="space-y-5 md:space-y-12">
                <div className="space-y-2 text-center md:space-y-4">
                  <h2 className="text-[22px] font-black uppercase leading-none tracking-tight italic text-slate-900 md:text-6xl md:tracking-tighter">
                    Та ямар <span className="text-[#2a00ff]">үл хөдлөх</span>
                    <br />
                    хайж байна вэ?
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-1.5 md:grid-cols-4 md:gap-4">
                  {LISTING_PROPERTY_CATEGORIES.map((cat) => {
                    const Icon = ICON_MAP[cat.value] || Landmark;
                    const isActive = formData.propertyType === cat.value;

                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateField("propertyType", cat.value)}
                        className={cn(
                          "group relative flex min-h-20 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 p-1.5 transition-all duration-300 md:min-h-44 md:gap-4 md:rounded-[2.5rem] md:p-8",
                          isActive
                            ? "scale-105 border-[#2a00ff] bg-[#2a00ff]/5 shadow-xl shadow-[#2a00ff]/10"
                            : "border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="buy-request-category-badge"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 28,
                            }}
                            style={{ backgroundColor: "#ff2bad", opacity: 1 }}
                            className="pointer-events-none absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff2bad]! opacity-100! text-white shadow-[0_12px_30px_-12px_rgba(255,43,173,0.95)] md:right-3 md:top-3 md:h-11 md:w-11"
                          >
                            <span className="absolute inset-0 rounded-full bg-linear-to-br from-[#ffb7e3] via-[#ff72c7] to-[#ff2bad]" />
                            <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-white/60" />
                            <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-white/75" />
                            <Sparkles className="relative z-10 h-2 w-2 fill-current md:h-4 md:w-4" />
                          </motion.span>
                        )}

                        <div className="pointer-events-none absolute inset-x-6 bottom-4 h-8 rounded-full bg-[#ff2bad]/8 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                        <Icon
                          className={cn(
                            "relative z-1 h-5 w-5 transition-transform group-hover:scale-110 md:h-10 md:w-10",
                            isActive ? "text-[#2a00ff]" : "text-slate-300",
                          )}
                        />
                        <span
                          className={cn(
                            "relative z-1 text-center text-[7px] font-black uppercase tracking-[0.04em] md:text-[10px] md:tracking-[0.15em]",
                            isActive ? "text-[#2a00ff]" : "text-slate-500",
                          )}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-auto max-w-md space-y-2.5 md:space-y-3">
                  <label className="ml-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 md:space-y-12">
                <div className="space-y-2 text-center md:space-y-4">
                  <h2 className="text-[22px] font-black uppercase leading-none tracking-tight italic text-slate-900 md:text-6xl md:tracking-tighter">
                    {isBarterRequest ? (
                      <>
                        Байршил & <span className="text-[#ff2bad]">Бартер</span>
                      </>
                    ) : (
                      <>
                        Байршил & <span className="text-[#ff2bad]">Төсөв</span>
                      </>
                    )}
                  </h2>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
                    {DISTRICTS.map((district) => (
                      <button
                        key={district}
                        type="button"
                        onClick={() => updateField("district", district)}
                        className={cn(
                          "h-10 rounded-xl border-2 text-[10px] font-black uppercase tracking-wide transition-all md:h-16 md:rounded-3xl md:text-base md:tracking-widest",
                          formData.district === district
                            ? "scale-105 border-[#ff2bad] bg-[#ff2bad]/5 text-[#ff2bad] shadow-lg shadow-[#ff2bad]/10"
                            : "border-slate-50 bg-slate-50 text-slate-400",
                        )}
                      >
                        {district}
                      </button>
                    ))}
                  </div>

                  <div className="mx-auto max-w-xl space-y-2.5 md:space-y-3">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Байршил / Хороолол
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Зайсан, Яармаг, 120 мянгат..."
                    className="h-11 rounded-xl border-none bg-slate-50 px-4 text-sm font-bold md:h-16 md:rounded-3xl md:px-8 md:text-xl"
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
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 md:space-y-12">
                <div className="text-center">
                  <h2 className="text-[22px] font-black uppercase tracking-tight italic text-slate-900 md:text-6xl md:tracking-tighter">
                    {isBarterRequest ? (
                      <>
                        Бартерын <span className="text-[#2a00ff]">нөхцөл</span>
                      </>
                    ) : (
                      <>
                        Нэмэлт <span className="text-[#2a00ff]">хүсэлт</span>
                      </>
                    )}
                  </h2>
                </div>

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
                    <div className="grid grid-cols-2 gap-2.5 md:gap-6">
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
              </div>
            )}

            <div className="mt-6 flex gap-2.5 md:mt-16 md:gap-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex h-10 w-12 items-center justify-center rounded-xl border-2 border-slate-100 bg-white transition-all hover:bg-slate-50 active:scale-90 md:h-20 md:w-24 md:rounded-4xl"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-400 md:h-8 md:w-8" />
                </button>
              )}

              <Button
                onClick={step === 3 ? handleSubmit : nextStep}
                disabled={isPending || !isLoaded}
                className="h-10 flex-1 rounded-xl bg-[#2a00ff] text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-[#2a00ff]/30 transition-all hover:-translate-y-1 hover:bg-[#ff2bad] active:translate-y-0 disabled:opacity-50 md:h-20 md:rounded-4xl md:text-base md:tracking-[0.25em]"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin md:h-8 md:w-8" />
                ) : (
                  <>
                    {step === 3 ? "Хүсэлт илгээх" : "Дараах алхам"}
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5 md:ml-3 md:h-5 md:w-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SuccessUI({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="mx-auto flex h-40 w-40 rotate-12 items-center justify-center rounded-[3rem] bg-green-50 text-green-500">
          <CheckCircle2 className="h-20 w-20" />
        </div>
        <h2 className="mt-12 text-6xl font-black uppercase leading-none tracking-tighter italic">
          Амжилттай <br /> <span className="text-[#2a00ff]">бүртгэгдлээ!</span>
        </h2>
        <Button
          onClick={onHome}
          className="mt-16 h-20 w-full max-w-sm rounded-4xl bg-[#2a00ff] font-black uppercase tracking-widest text-white shadow-2xl"
        >
          Нүүр хуудас руу
        </Button>
      </motion.div>
    </div>
  );
}
