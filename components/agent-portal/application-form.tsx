"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    primaryArea: "", // Added for more detail
    bio: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API logic
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <Card className="overflow-hidden rounded-4xl border-none bg-white shadow-xl md:rounded-[3rem] md:shadow-2xl">
      <CardHeader className="border-b border-[#2a00ff]/10 bg-[#f5f3ff] p-4 md:p-10">
        <CardTitle className="mb-1 text-2xl font-black italic tracking-tight text-[#2a00ff] uppercase md:mb-2 md:text-4xl md:tracking-tighter">
          Агент болох хүсэлт
        </CardTitle>
        <p className="text-sm font-bold italic text-[#2a00ff]/70 md:text-base">
          Бид тантай эргэн холбогдох болно.
        </p>
      </CardHeader>

      <CardContent className="p-4 md:p-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <FormField
                  label="Бүтэн нэр"
                  placeholder="Г. Бат-Эрдэнэ"
                  value={formData.fullName}
                  onChange={(v: string) => handleChange("fullName", v)}
                />
                <FormField
                  label="Утасны дугаар"
                  placeholder="9911----"
                  type="tel"
                  value={formData.phone}
                  onChange={(v: string) => handleChange("phone", v)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <FormField
                  label="И-мэйл хаяг"
                  placeholder="example@mail.mn"
                  type="email"
                  value={formData.email}
                  onChange={(v: string) => handleChange("email", v)}
                />
                <FormField
                  label="Ажиллах үндсэн бүс"
                  placeholder="ХУД, Зайсан гэх мэт..."
                  value={formData.primaryArea}
                  onChange={(v: string) => handleChange("primaryArea", v)}
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <Label className="ml-1 text-[9px] font-black uppercase tracking-wide text-[#2a00ff]/55 md:text-[10px] md:tracking-widest">
                  Уулзах хэлбэр
                </Label>
                <div className="flex h-11 items-center rounded-xl border border-blue-100 bg-blue-50 px-4 text-[11px] font-black italic uppercase text-blue-700 md:h-14 md:px-5 md:text-xs">
                  Биеэр уулзах (Go Meet Only)
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <Label className="ml-1 text-[9px] font-black uppercase tracking-wide text-[#2a00ff]/55 md:text-[10px] md:tracking-widest">
                  Туршлага болон нэмэлт мэдээлэл
                </Label>
                <Textarea
                  className="h-28 rounded-xl border-[#2a00ff]/15 bg-[#2a00ff]/6 p-3.5 text-sm font-bold text-[#2a00ff] transition-all placeholder:text-[#2a00ff]/35 focus:border-[#2a00ff]/25 focus:bg-white md:h-32 md:rounded-2xl md:p-6"
                  placeholder="Өөрийн туршлагаа товч бичнэ үү..."
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 md:pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2a00ff] text-sm font-black tracking-tight text-white shadow-lg shadow-[#2a00ff]/25 transition-all active:scale-[0.98] hover:bg-[#2300d9] md:h-20 md:gap-3 md:rounded-2xl md:text-xl md:tracking-tighter md:shadow-2xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin md:h-6 md:w-6" />
                      <span>УНШИЖ БАЙНА</span>
                    </>
                  ) : (
                    "ХҮСЭЛТ ИЛГЭЭХ"
                  )}
                </Button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

const FormField = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: any) => (
  <div className="space-y-1.5 md:space-y-2">
    <Label className="ml-1 text-[9px] font-black uppercase tracking-wide text-[#2a00ff]/55 md:text-[10px] md:tracking-widest">
      {label}
    </Label>
    <Input
      type={type}
      className="h-11 rounded-xl border-[#2a00ff]/15 bg-[#2a00ff]/6 px-4 text-sm font-black text-[#2a00ff] transition-all placeholder:text-[#2a00ff]/35 focus:border-[#2a00ff]/25 focus:bg-white md:h-14 md:px-5 md:text-base"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

const SuccessMessage = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="py-10 text-center md:py-20"
  >
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 md:mb-8 md:h-24 md:w-24">
      <CheckCircle2 className="h-8 w-8 text-blue-600 md:h-12 md:w-12" />
    </div>
    <h2 className="mb-2 text-3xl font-black italic tracking-tight text-[#2a00ff] uppercase md:mb-4 md:text-5xl md:tracking-tighter">
      Хүлээн авлаа
    </h2>
    <p className="mx-auto max-w-xs text-sm font-bold italic text-[#2a00ff]/70 md:text-lg">
      Бид таны мэдээллийг шалгаад тун удахгүй эргэн холбогдох болно.
    </p>
  </motion.div>
);
