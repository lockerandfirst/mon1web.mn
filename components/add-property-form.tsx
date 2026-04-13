"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agents } from "@/lib/data";
import {
  createMarketplaceListing,
  readMarketplaceListings,
  writeMarketplaceListings,
} from "@/lib/marketplace";
import { PROPERTY_CATEGORIES } from "@/lib/property-types";
import {
  Building2,
  MapPin,
  DollarSign,
  Ruler,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  Sparkles,
  Send,
  CheckCircle2,
  School,
  ShoppingCart,
  Bus,
  LayoutGrid,
  Camera,
  Video,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export function AddPropertyForm() {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    district: "",
    price: "",
    sqm: "",
    rooms: "1",
    bathrooms: "1",
    floor: "",
    totalFloors: "",
    commissionYear: "2024",
    description: "",
    serviceType: null as "self" | "agent" | null,
    selectedAgentId: null as string | null, // <--- Add this line
    surroundings: [] as string[],
    roadAccess: "",
    images: [] as string[],
  });

  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const pricePerSqm = useMemo(() => {
    const p = parseFloat(formData.price);
    const s = parseFloat(formData.sqm);
    return p && s ? Math.round(p / s).toLocaleString() : null;
  }, [formData.price, formData.sqm]);

  const handleAiOptimize = async () => {
    if (!formData.description) return toast.error("Эхлээд тайлбар бичнэ үү");
    setIsAiProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const optimized = `✨ ОНЦЛОХ: ${formData.description}\n\n📍 Байршлын давуу тал: Ойр орчимд ${formData.surroundings.length} гаруй үйлчилгээний төвүүдтэй.`;
    updateField("description", optimized);
    setIsAiProcessing(false);
    toast.success("AI тайлбарыг шинэчиллээ");
  };

  const handleSubmit = () => {
    const fallbackAgent = agents.find((a) => a.verified) ?? agents[0];

    // Explicitly structure the input to match the required Type
    const nextListing = createMarketplaceListing(
      {
        ...formData,
        // Ensure this property is explicitly passed to satisfy the Type
        selectedAgentId: formData.selectedAgentId || null,
        submittedBy: {
          name: user?.fullName || "Хэрэглэгч",
          email: user?.primaryEmailAddress?.emailAddress || "user@mon1.local",
        },
      },
      fallbackAgent,
    );

    const currentListings = readMarketplaceListings();
    writeMarketplaceListings([nextListing, ...currentListings]);
    setShowSuccess(true);
  };

  if (showSuccess)
    return <SuccessState onReset={() => setShowSuccess(false)} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-20">
      <div className="lg:col-span-8 space-y-8">
        {/* --- STEP PROGRESS --- */}
        <div className="flex items-center justify-between px-8 bg-white py-6 rounded-[2.5rem] border border-[#eeebff] shadow-sm">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center font-black transition-all duration-500 ${currentStep >= s ? "bg-[#2a00ff] text-white" : "bg-[#fff9fd] text-[#ff9ce0]"}`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-8 md:w-16 h-0.5 ${currentStep > s ? "bg-[#2a00ff]" : "bg-[#eeebff]"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: MEDIA */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
                <div className="bg-[#1a0b3b] p-10 text-white">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                    Зураг оруулах
                  </h2>
                  <p className="text-[#ff9ce0] text-sm font-bold mt-1 italic">
                    Байрныхаа өнгө төрхийг харуулах чанартай зургууд оруулна уу.
                  </p>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 aspect-video rounded-[2.5rem] border-4 border-dashed border-[#eeebff] flex flex-col items-center justify-center bg-[#fff9fd] hover:border-[#2a00ff] transition-colors cursor-pointer group">
                      <Camera className="h-12 w-12 text-[#2a00ff] mb-4 group-hover:scale-110 transition-transform" />
                      <p className="font-black text-[#1a0b3b] uppercase">
                        Зураг нэмэх
                      </p>
                    </div>
                    <div className="h-full rounded-[2.5rem] border border-[#eeebff] p-6 bg-[#fff9fd] flex flex-col items-center justify-center text-center">
                      <Video className="h-8 w-8 text-[#ff3bad] mb-3" />
                      <p className="text-[10px] font-black uppercase text-[#1a0b3b]">
                        Видео холбоос
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="h-16 px-12 rounded-2xl bg-[#2a00ff] text-white font-black hover:bg-[#ff3bad] transition-all"
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
                <div className="bg-[#1a0b3b] p-10 text-white italic">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">
                    Үнэ ба Үзүүлэлт
                  </h2>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-[#ff9ce0] ml-2">
                        Өрөөний тоо
                      </Label>
                      <div className="flex gap-2">
                        {["1", "2", "3", "4", "5+"].map((num) => (
                          <button
                            key={num}
                            onClick={() => updateField("rooms", num)}
                            className={`flex-1 h-12 rounded-xl font-black transition-all ${formData.rooms === num ? "bg-[#2a00ff] text-white shadow-lg" : "bg-[#fff9fd] text-[#ff9ce0] border border-[#eeebff]"}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-[#ff9ce0] ml-2">
                        Ариун цэврийн өрөө
                      </Label>
                      <div className="flex gap-2">
                        {["1", "2", "3"].map((num) => (
                          <button
                            key={num}
                            onClick={() => updateField("bathrooms", num)}
                            className={`flex-1 h-12 rounded-xl font-black transition-all ${formData.bathrooms === num ? "bg-[#2a00ff] text-white shadow-lg" : "bg-[#fff9fd] text-[#ff9ce0] border border-[#eeebff]"}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-[#ff9ce0] ml-2">
                        Үнэ (₮)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff3bad] h-6 w-6" />
                        <Input
                          type="number"
                          className="h-16 pl-14 rounded-2xl bg-[#fff9fd] border-[#eeebff] text-2xl font-black text-[#1a0b3b]"
                          value={formData.price}
                          onChange={(e) => updateField("price", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-[#ff9ce0] ml-2">
                        Талбай (м²)
                      </Label>
                      <div className="relative">
                        <Ruler className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2a00ff] h-6 w-6" />
                        <Input
                          type="number"
                          className="h-16 pl-14 rounded-2xl bg-[#fff9fd] border-[#eeebff] text-2xl font-black text-[#1a0b3b]"
                          value={formData.sqm}
                          onChange={(e) => updateField("sqm", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(1)}
                      className="h-16 font-black text-[#ff9ce0]"
                    >
                      БУЦАХ
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="h-16 px-12 rounded-2xl bg-[#2a00ff] text-white font-black"
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
                <div className="bg-[#1a0b3b] p-10 text-white italic">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">
                    Байршил
                  </h2>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-[#ff9ce0]">
                        Дүүрэг
                      </Label>
                      <Select
                        value={formData.district}
                        onValueChange={(v) => updateField("district", v)}
                      >
                        <SelectTrigger className="h-14 rounded-xl bg-[#fff9fd] border-[#eeebff] font-bold text-[#1a0b3b]">
                          <SelectValue placeholder="Сонгох" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#eeebff]">
                          {["Хан-Уул", "Сүхбаатар", "Баянзүрх", "Баянгол"].map(
                            (d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-[#ff9ce0]">
                        Дэлгэрэнгүй хаяг
                      </Label>
                      <Input
                        className="h-14 rounded-xl bg-[#fff9fd] border-[#eeebff] font-bold text-[#1a0b3b]"
                        value={formData.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase text-[#ff9ce0]">
                      Ойр орчимд
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: "school", label: "Сургууль", icon: School },
                        { id: "bus", label: "Тээвэр", icon: Bus },
                        { id: "shop", label: "Дэлгүүр", icon: ShoppingCart },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            const cur = formData.surroundings;
                            updateField(
                              "surroundings",
                              cur.includes(item.id)
                                ? cur.filter((i) => i !== item.id)
                                : [...cur, item.id],
                            );
                          }}
                          className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-black text-[10px] uppercase transition-all ${formData.surroundings.includes(item.id) ? "border-[#2a00ff] bg-[#eeebff] text-[#2a00ff]" : "border-[#eeebff] text-[#ff9ce0]"}`}
                        >
                          <item.icon className="h-4 w-4" /> {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(2)}
                      className="h-16 font-black text-[#ff9ce0]"
                    >
                      БУЦАХ
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="h-16 px-12 rounded-2xl bg-[#2a00ff] text-white font-black"
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: SERVICE TYPE */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SelectionCard
                    active={formData.serviceType === "self"}
                    onClick={() => updateField("serviceType", "self")}
                    icon={User}
                    title="Би өөрөө зарна"
                    desc="Зараа шууд нийтэлж, манай системээр баталгаажуулна."
                  />
                  <SelectionCard
                    active={formData.serviceType === "agent"}
                    onClick={() => updateField("serviceType", "agent")}
                    icon={Users}
                    title="Агентаар заруулна"
                    desc="Мэргэжлийн агент таны өмнөөс борлуулалт хийнэ."
                    isPremium
                  />
                </div>
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-10">
                  <Label className="text-[10px] font-black uppercase text-[#ff9ce0] mb-4 block">
                    Тайлбар
                  </Label>
                  <div className="relative">
                    <Textarea
                      className="min-h-37.5 rounded-3xl bg-[#fff9fd] border-[#eeebff] p-6 font-bold text-[#1a0b3b]"
                      placeholder="Байрны давуу талуудыг бичнэ үү..."
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                    <Button
                      onClick={handleAiOptimize}
                      disabled={isAiProcessing}
                      className="absolute bottom-4 right-4 bg-[#1a0b3b] text-white font-black rounded-xl h-10 px-4 gap-2 text-[10px] hover:bg-[#2a00ff]"
                    >
                      <Sparkles
                        className={`h-3 w-3 ${isAiProcessing ? "animate-spin" : ""}`}
                      />{" "}
                      AI ЗАСАХ
                    </Button>
                  </div>
                </Card>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(3)}
                    className="h-16 font-black text-[#ff9ce0]"
                  >
                    БУЦАХ
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="h-20 px-20 rounded-3xl bg-[#2a00ff] hover:bg-[#ff3bad] text-white font-black text-xl shadow-2xl"
                  >
                    ЗАР НЭМЭХ <Send className="ml-3 h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
        <Card className="border-none shadow-2xl rounded-[3rem] bg-[#1a0b3b] text-white p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2a00ff]/20 blur-3xl rounded-full" />
          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
            <Zap className="h-6 w-6 text-[#ff3bad]" /> Зарын чанар
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase text-[#ff9ce0]">
                Оноо:
              </span>
              <span className="text-4xl font-black text-[#2a00ff]">85%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#2a00ff]" style={{ width: "85%" }} />
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function SelectionCard({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
  isPremium,
}: any) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer rounded-[3rem] border-4 transition-all duration-500 p-8 text-center group ${active ? "border-[#2a00ff] bg-[#eeebff] shadow-xl" : "border-[#eeebff] bg-white hover:border-[#ff9ce0]/30"}`}
    >
      <div
        className={`h-20 w-20 rounded-4xl flex items-center justify-center mx-auto mb-6 transition-all ${active ? "bg-[#2a00ff] text-white scale-110" : "bg-[#fff9fd] text-[#ff9ce0]"}`}
      >
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-black text-[#1a0b3b] mb-2 uppercase italic tracking-tighter">
        {title}
      </h3>
      <p className="text-[#ff9ce0] text-xs font-bold">{desc}</p>
      {isPremium && (
        <Badge className="mt-4 bg-[#1a0b3b] text-[#2a00ff] font-black rounded-full px-4 py-1 italic text-[9px] uppercase">
          Recommended
        </Badge>
      )}
    </Card>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-32 w-32 bg-[#2a00ff]/10 rounded-[3.5rem] flex items-center justify-center mb-10 shadow-2xl">
        <CheckCircle2 className="h-16 w-16 text-[#2a00ff]" />
      </div>
      <h2 className="text-5xl font-black text-[#1a0b3b] tracking-tighter mb-6 italic uppercase">
        Амжилттай!
      </h2>
      <p className="text-[#ff9ce0] font-bold max-w-md text-xl mb-12 italic leading-relaxed">
        Таны зар амжилттай бүртгэгдлээ. Бид тун удахгүй баталгаажуулах болно.
      </p>
      <Button
        onClick={onReset}
        className="h-20 px-16 rounded-4xl bg-[#1a0b3b] text-white font-black text-xl hover:bg-[#2a00ff] transition-all uppercase italic"
      >
        Шинэ зар нэмэх
      </Button>
    </div>
  );
}
