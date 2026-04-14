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
import { Header } from "@/components/header";
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
      <Header />

      <main className="container mx-auto px-4 py-12 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 flex items-center justify-between px-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border font-black shadow-sm transition-all",
                    step >= num
                      ? "rotate-3 border-[#2a00ff] bg-[#2a00ff] text-white"
                      : "border-slate-100 bg-white text-slate-300",
                  )}
                >
                  {step > num ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    `0${num}`
                  )}
                </div>
                <div className="hidden flex-col md:flex">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Алхам
                  </span>
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-widest",
                      step >= num ? "text-[#2a00ff]" : "text-slate-300",
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
                </div>
                {num < 3 && (
                  <div className="mx-2 h-0.5 w-12 bg-slate-100 md:w-24" />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-[4rem] border border-slate-50 bg-white p-10 shadow-[0_50px_100px_-30px_rgba(42,0,255,0.08)] md:p-16"
          >
            {step === 1 && (
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl font-black uppercase leading-none tracking-tighter italic text-slate-900 md:text-6xl">
                    Та ямар <span className="text-[#2a00ff]">үл хөдлөх</span>
                    <br />
                    хайж байна вэ?
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {LISTING_PROPERTY_CATEGORIES.map((cat) => {
                    const Icon = ICON_MAP[cat.value] || Landmark;
                    const isActive = formData.propertyType === cat.value;

                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateField("propertyType", cat.value)}
                        className={cn(
                          "group relative flex min-h-44 flex-col items-center justify-center gap-4 overflow-hidden rounded-[2.5rem] border-2 p-8 transition-all duration-300",
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
                            className="pointer-events-none absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#ffb7e3] via-[#ff72c7] to-[#ff2bad] text-white shadow-[0_12px_30px_-12px_rgba(255,43,173,0.95)]"
                          >
                            <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-white/60" />
                            <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-white/75" />
                            <Sparkles className="h-4 w-4 fill-current" />
                          </motion.span>
                        )}

                        <div className="pointer-events-none absolute inset-x-6 bottom-4 h-8 rounded-full bg-[#ff2bad]/8 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                        <Icon
                          className={cn(
                            "relative z-1 h-10 w-10 transition-transform group-hover:scale-110",
                            isActive ? "text-[#2a00ff]" : "text-slate-300",
                          )}
                        />
                        <span
                          className={cn(
                            "relative z-1 text-center text-[10px] font-black uppercase tracking-[0.15em]",
                            isActive ? "text-[#2a00ff]" : "text-slate-500",
                          )}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-auto max-w-md space-y-3">
                  <label className="ml-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Phone className="h-3 w-3" /> Холбогдох утас
                  </label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) =>
                      updateField("contactPhone", e.target.value)
                    }
                    placeholder="99XX-XXXX"
                    className="h-16 rounded-3xl border-none bg-slate-50 px-8 text-center text-xl font-bold text-slate-900 transition-all focus:ring-8 focus:ring-[#2a00ff]/5"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl font-black uppercase leading-none tracking-tighter italic text-slate-900 md:text-6xl">
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

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {DISTRICTS.map((district) => (
                      <button
                        key={district}
                        type="button"
                        onClick={() => updateField("district", district)}
                        className={cn(
                          "h-16 rounded-3xl border-2 font-black uppercase tracking-widest transition-all",
                          formData.district === district
                            ? "scale-105 border-[#ff2bad] bg-[#ff2bad]/5 text-[#ff2bad] shadow-lg shadow-[#ff2bad]/10"
                            : "border-slate-50 bg-slate-50 text-slate-400",
                        )}
                      >
                        {district}
                      </button>
                    ))}
                  </div>

                  <div className="mx-auto max-w-xl space-y-3">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Байршил / Хороолол
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Зайсан, Яармаг, 120 мянгат..."
                      className="h-16 rounded-3xl border-none bg-slate-50 px-8 text-xl font-bold"
                    />
                  </div>
                </div>

                {isBarterRequest ? (
                  <div className="grid gap-6 pt-4 md:grid-cols-2">
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
                        className="min-h-45 rounded-4xl border-none bg-slate-50 p-6 text-base font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5"
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
                        className="min-h-45 rounded-4xl border-none bg-slate-50 p-6 text-base font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5"
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
                        className="mt-3 h-16 rounded-3xl border-none bg-slate-50 px-8 text-lg font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pt-6">
                    <div className="text-center">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Таны төсөв
                      </label>
                      <div className="flex h-20 items-center justify-center">
                        <AnimatePresence mode="wait">
                          {formData.budget ? (
                            <motion.div
                              key="amount"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-baseline gap-3"
                            >
                              <span className="text-5xl font-black tracking-tighter text-[#2a00ff] md:text-7xl">
                                {Number(formData.budget).toLocaleString(
                                  "en-US",
                                )}
                              </span>
                              <span className="text-2xl font-black text-slate-300">
                                ₮
                              </span>
                            </motion.div>
                          ) : (
                            <span className="text-5xl font-black tracking-tighter text-slate-100 md:text-7xl">
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
                        className="h-20 rounded-4xl border-none bg-slate-100/50 px-8 text-center text-xl font-bold transition-all placeholder:text-slate-300 focus:ring-8 focus:ring-[#2a00ff]/5"
                      />
                      {formData.budget &&
                        Number(formData.budget) >= 1000000 && (
                          <div className="mt-4 flex justify-center">
                            <div className="rounded-2xl bg-[#ff2bad]/10 px-6 py-2 text-xs font-black uppercase tracking-widest text-[#ff2bad]">
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
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 md:text-6xl">
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
                  <div className="space-y-6">
                    <div className="rounded-[2.5rem] bg-[#f8f6ff] p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
                        Бартерын тайлбар
                      </p>
                      <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                        Солих нөхцөл, зөвшөөрөх сонголт, яаралтай эсэх, нэмэлт
                        cash, хүлээн зөвшөөрөх байршлаа энд тодорхой бичээрэй.
                      </p>
                    </div>

                    <Textarea
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Жишээ: River Garden, Zaisan орчим 2-3 өрөө сонирхоно. Машин + cash хувилбар боломжтой. Яаралтай..."
                      className="min-h-55 rounded-[2.5rem] border-none bg-slate-50 p-8 text-lg font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Өрөөний тоо
                        </label>
                        <Input
                          value={formData.rooms}
                          onChange={(e) => updateField("rooms", e.target.value)}
                          className="h-16 rounded-3xl border-none bg-slate-50 px-8 text-xl font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Талбай (м²)
                        </label>
                        <Input
                          value={formData.sqm}
                          onChange={(e) => updateField("sqm", e.target.value)}
                          className="h-16 rounded-3xl border-none bg-slate-50 px-8 text-xl font-bold"
                        />
                      </div>
                    </div>

                    <Textarea
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Жишээ: Цонх урагшаа харсан, сургууль болон цэцэрлэгтэй ойр..."
                      className="min-h-50 rounded-[2.5rem] border-none bg-slate-50 p-8 text-lg font-medium resize-none transition-all focus:ring-8 focus:ring-[#2a00ff]/5"
                    />
                  </>
                )}
              </div>
            )}

            <div className="mt-16 flex gap-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex h-20 w-24 items-center justify-center rounded-4xl border-2 border-slate-100 bg-white transition-all hover:bg-slate-50 active:scale-90"
                >
                  <ChevronLeft className="h-8 w-8 text-slate-400" />
                </button>
              )}

              <Button
                onClick={step === 3 ? handleSubmit : nextStep}
                disabled={isPending || !isLoaded}
                className="h-20 flex-1 rounded-4xl bg-[#2a00ff] text-base font-black uppercase tracking-[0.25em] text-white shadow-2xl shadow-[#2a00ff]/30 transition-all hover:-translate-y-1 hover:bg-[#ff2bad] active:translate-y-0 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    {step === 3 ? "Хүсэлт илгээх" : "Дараах алхам"}
                    <ChevronRight className="ml-3 h-5 w-5" />
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
