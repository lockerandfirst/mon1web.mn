"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, User, Phone, Mail, MapPin } from "lucide-react";
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
    <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
      <CardHeader className="bg-slate-50 border-b p-10">
        <CardTitle className="text-4xl font-black text-[#2a00ff] tracking-tighter uppercase mb-2 italic">
          Агент болох хүсэлт
        </CardTitle>
        <p className="text-slate-500 font-bold italic">
          Бид тантай эргэн холбогдох болно.
        </p>
      </CardHeader>

      <CardContent className="p-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
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

              <div className="grid gap-6 md:grid-cols-2">
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

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Уулзах хэлбэр
                </Label>
                <div className="h-14 flex items-center px-5 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-black text-xs uppercase italic">
                  Биеэр уулзах (Go Meet Only)
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Туршлага болон нэмэлт мэдээлэл
                </Label>
                <Textarea
                  className="bg-slate-50 border-slate-200 rounded-2xl p-6 h-32 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="Өөрийн туршлагаа товч бичнэ үү..."
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                {/* FIXED VISIBILITY: Using slate-900 with clear white text and high-contrast shadow */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-20 bg-slate-900 text-white hover:bg-blue-600 rounded-2xl text-xl font-black tracking-tighter shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-6 w-6" />
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
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
      {label}
    </Label>
    <Input
      type={type}
      className="h-14 bg-slate-50 border-slate-200 rounded-xl focus:bg-white font-black px-5 text-slate-900 placeholder:text-slate-300 transition-all"
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
    className="text-center py-20"
  >
    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
      <CheckCircle2 className="h-12 w-12 text-blue-600" />
    </div>
    <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic text-slate-900">
      Хүлээн авлаа
    </h2>
    <p className="text-slate-500 text-lg font-bold italic max-w-xs mx-auto">
      Бид таны мэдээллийг шалгаад тун удахгүй эргэн холбогдох болно.
    </p>
  </motion.div>
);
