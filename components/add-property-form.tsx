"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
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
import {
  Building2,
  MapPin,
  DollarSign,
  Ruler,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  Star,
  BadgeCheck,
  Sparkles,
  Send,
  CheckCircle2,
  Camera,
  MessageCircle,
} from "lucide-react";

interface FormData {
  propertyType: string;
  location: string;
  district: string;
  price: string;
  sqm: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  description: string;
  serviceType: "self" | "agent" | null;
  selectedAgentId: string | null;
  images: string[];
}

const propertyTypes = [
  { value: "apartment", label: "Орон сууц" },
  { value: "house", label: "Хашаа байшин" },
  { value: "office", label: "Оффис" },
  { value: "land", label: "Газар" },
];

const districts = [
  "Сүхбаатар",
  "Баянзүрх",
  "Хан-Уул",
  "Чингэлтэй",
  "Сонгинохайрхан",
  "Баянгол",
];

export function AddPropertyForm() {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    location: "",
    district: "",
    price: "",
    sqm: "",
    rooms: "",
    floor: "",
    totalFloors: "",
    description: "",
    serviceType: null,
    selectedAgentId: null,
    images: [],
  });
  const [aiMessage, setAiMessage] = useState(
    "Сайн байна уу! Би таны зарын мэдээллийг илүү сонирхолтой болгож, засварлаж өгч чадна.",
  );
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateFormData = (
    field: keyof FormData,
    value: string | string[] | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAiHelp = () => {
    setIsAiTyping(true);
    setTimeout(() => {
      if (formData.description) {
        setAiMessage(
          `Таны "${formData.description.slice(0, 30)}..." тайлбарыг илүү мэргэжлийн түвшинд засварлаж байна. Тун удахгүй бэлэн болно!`,
        );
      } else {
        setAiMessage(
          "Эхлээд байрны мэдээллээ оруулаарай. Би танд тохирох тайлбар бичихэд тусална!",
        );
      }
      setIsAiTyping(false);
    }, 1500);
  };

  const handleSubmit = () => {
    const fallbackAgent = agents.find((agent) => agent.verified) ?? agents[0];
    const nextListing = createMarketplaceListing(
      {
        district: formData.district,
        location: formData.location,
        price: formData.price,
        sqm: formData.sqm,
        rooms: formData.rooms,
        floor: formData.floor,
        totalFloors: formData.totalFloors,
        description: formData.description,
        propertyType: formData.propertyType,
        selectedAgentId: formData.selectedAgentId,
        submittedBy: {
          name: user?.fullName || user?.firstName || "Mon1 хэрэглэгч",
          email: user?.primaryEmailAddress?.emailAddress || "user@mon1.local",
        },
      },
      fallbackAgent,
    );

    const currentListings = readMarketplaceListings();
    writeMarketplaceListings([nextListing, ...currentListings]);
    setShowSuccess(true);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid =
    formData.propertyType &&
    formData.location &&
    formData.district &&
    formData.price &&
    formData.sqm;

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Амжилттай илгээгдлээ!
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          {formData.serviceType === "agent"
            ? "Таны байрны хүсэлт агентын портал руу илгээгдлээ. Агент хүлээн авмагц үндсэн сайтад нийтлэгдэнэ."
            : "Таны байрны мэдээлэл агентын хяналтад очлоо. Агент зөвшөөрсний дараа үндсэн сайтад нийтлэгдэнэ."}
        </p>
        <Button
          className="mt-8"
          onClick={() => {
            setShowSuccess(false);
            setCurrentStep(1);
            setFormData({
              propertyType: "",
              location: "",
              district: "",
              price: "",
              sqm: "",
              rooms: "",
              floor: "",
              totalFloors: "",
              description: "",
              serviceType: null,
              selectedAgentId: null,
              images: [],
            });
          }}
        >
          Шинэ зар нэмэх
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all
                ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }
              `}
              >
                {step}
              </div>
              <span
                className={`ml-3 text-sm font-medium hidden sm:block ${
                  currentStep >= step
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step === 1 && "Үндсэн мэдээлэл"}
                {step === 2 && "Шийдвэр"}
                {step === 3 && "Дуусгах"}
              </span>
              {step < 3 && (
                <div
                  className={`w-12 sm:w-24 h-0.5 mx-4 ${
                    currentStep > step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Үндсэн мэдээлэл
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Байрны үндсэн мэдээллийг оруулна уу
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Type */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Байрны төрөл
                      </Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) =>
                          updateFormData("propertyType", value)
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Сонгох..." />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Дүүрэг
                      </Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) =>
                          updateFormData("district", value)
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Сонгох..." />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Байршил / Хаяг
                      </Label>
                      <Input
                        placeholder="Жишээ: Зайсан, Royal Town..."
                        value={formData.location}
                        onChange={(e) =>
                          updateFormData("location", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        Үнэ (MNT)
                      </Label>
                      <Input
                        type="number"
                        placeholder="280,000,000"
                        value={formData.price}
                        onChange={(e) =>
                          updateFormData("price", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>

                    {/* Square Meters */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        Талбай (м²)
                      </Label>
                      <Input
                        type="number"
                        placeholder="80"
                        value={formData.sqm}
                        onChange={(e) => updateFormData("sqm", e.target.value)}
                        className="h-12"
                      />
                    </div>

                    {/* Rooms */}
                    <div className="space-y-2">
                      <Label>Өрөөний тоо</Label>
                      <Select
                        value={formData.rooms}
                        onValueChange={(value) =>
                          updateFormData("rooms", value)
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Сонгох..." />
                        </SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4", "5+"].map((num) => (
                            <SelectItem key={num} value={num}>
                              {num} өрөө
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Floor */}
                    <div className="space-y-2">
                      <Label>Давхар</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="12"
                          value={formData.floor}
                          onChange={(e) =>
                            updateFormData("floor", e.target.value)
                          }
                          className="h-12"
                        />
                        <span className="flex items-center text-muted-foreground">
                          /
                        </span>
                        <Input
                          type="number"
                          placeholder="16"
                          value={formData.totalFloors}
                          onChange={(e) =>
                            updateFormData("totalFloors", e.target.value)
                          }
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={nextStep}
                      disabled={!isStep1Valid}
                      className="gap-2"
                      size="lg"
                    >
                      Үргэлжлүүлэх
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: The Choice */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Шийдвэр
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Зараа хэрхэн оруулах вэ?
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Self Service Option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all border-2 ${
                          formData.serviceType === "self"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => updateFormData("serviceType", "self")}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <User className="h-8 w-8 text-foreground" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            Би өөрөө зарна
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Эхлээд хүсэлтээ илгээнэ, дараа нь агент хүсвэл
                            нийтэлнэ
                          </p>
                          <Badge variant="secondary" className="bg-muted">
                            Хяналтаар орно
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Agent Service Option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all border-2 ${
                          formData.serviceType === "agent"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => updateFormData("serviceType", "agent")}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            Агенттай хамтарна
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Мэргэжлийн агент таны зарыг удирдана
                          </p>
                          <Badge className="bg-primary text-primary-foreground">
                            Санал болгох
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Agent Selection */}
                  <AnimatePresence>
                    {formData.serviceType === "agent" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Агент сонгох
                        </h3>
                        <div className="space-y-3">
                          {agents
                            .filter((a) => a.verified)
                            .map((agent) => (
                              <Card
                                key={agent.id}
                                className={`cursor-pointer transition-all border-2 ${
                                  formData.selectedAgentId === agent.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                onClick={() =>
                                  updateFormData("selectedAgentId", agent.id)
                                }
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={agent.avatar}
                                      alt={agent.name}
                                      className="w-14 h-14 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-foreground">
                                          {agent.name}
                                        </h4>
                                        {agent.verified && (
                                          <BadgeCheck className="h-4 w-4 text-primary" />
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {agent.company}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                                        <span className="text-sm font-medium">
                                          {agent.rating}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          ({agent.reviewCount})
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="secondary">
                                        {agent.listingsCount} зар
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Буцах
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={
                        !formData.serviceType ||
                        (formData.serviceType === "agent" &&
                          !formData.selectedAgentId)
                      }
                      className="gap-2"
                      size="lg"
                    >
                      Үргэлжлүүлэх
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {formData.serviceType === "self"
                      ? "Зургаа оруулах"
                      : "Хүсэлт илгээх"}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    {formData.serviceType === "self"
                      ? "Зураг болон дэлгэрэнгүй тайлбар оруулна уу"
                      : "Агент руу хүсэлт илгээхэд бэлэн"}
                  </p>

                  {formData.serviceType === "self" && (
                    <div className="space-y-6 mb-8">
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>Зураг</Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Зураг сонгох эсвэл энд чирэх
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PNG, JPG (max. 10MB)
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label>Дэлгэрэнгүй тайлбар</Label>
                        <Textarea
                          placeholder="Байрны онцлог, давуу талууд..."
                          value={formData.description}
                          onChange={(e) =>
                            updateFormData("description", e.target.value)
                          }
                          rows={5}
                        />
                      </div>
                    </div>
                  )}

                  {formData.serviceType === "agent" &&
                    formData.selectedAgentId && (
                      <div className="bg-muted/50 rounded-xl p-6 mb-8">
                        <p className="text-sm text-muted-foreground mb-4">
                          Сонгосон агент:
                        </p>
                        {(() => {
                          const agent = agents.find(
                            (a) => a.id === formData.selectedAgentId,
                          );
                          if (!agent) return null;
                          return (
                            <div className="flex items-center gap-4">
                              <img
                                src={agent.avatar}
                                alt={agent.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground text-lg">
                                    {agent.name}
                                  </h4>
                                  <BadgeCheck className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-muted-foreground">
                                  {agent.company}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Буцах
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2" size="lg">
                      <Send className="h-4 w-4" />
                      {formData.serviceType === "self"
                        ? "Зар нэмэх"
                        : "Агент руу хүсэлт илгээх"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="lg:col-span-1">
        <Card className="border-border sticky top-24">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mon1.mn AI</h3>
                <p className="text-sm text-muted-foreground">Таны туслагч</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">
                  {isAiTyping ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Бодож байна...</span>
                    </span>
                  ) : (
                    aiMessage
                  )}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAiHelp}
              disabled={isAiTyping}
            >
              <Sparkles className="h-4 w-4" />
              AI тусламж авах
            </Button>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">
                AI чадвар:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Зарын тайлбар засварлах
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Үнийн санал өгөх
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Зургийн чанар шалгах
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
