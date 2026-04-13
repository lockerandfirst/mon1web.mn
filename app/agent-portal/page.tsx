"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Phone, Sparkles, ArrowRight, Lock } from "lucide-react";

export default function AgentPortalPage() {
  const { isSignedIn } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    agency: "",
    licenseNumber: "",
    experience: "",
    areas: "",
    meetingPreference: "",
    notes: "",
    accessCode: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary/10 flex flex-col">
      <Header />

      <main className="flex-1 overflow-hidden">
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[90vh] w-full flex items-center justify-center bg-slate-50 overflow-hidden pt-20 pb-20">
          {/* Background Pattern: Цэвэрхэн, цэлгэр харагдуулах үүднээс */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')",
              }}
            />
            {/* Gradient Overlay: Цэнхэр туяатай цагаан эффект */}
            <div className="absolute inset-0 bg-linear-to-tr from-blue-50/80 via-white to-white" />
            {/* Decorative Circles: Хэт хар харагдуулахгүй туслах гэрлүүд */}
            <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-blue-100/50 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-primary/5 blur-[120px] rounded-full" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid gap-16 lg:grid-cols-2 items-center"
            >
              <div className="text-left">
                <motion.div
                  variants={itemVariants}
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-600/10 border border-blue-600/20 px-4 py-2 text-xs font-black text-blue-600 uppercase tracking-[0.2em]"
                >
                  <Sparkles className="h-4 w-4" />
                  Official Agent Network
                </motion.div>
                <motion.h1
                  variants={itemVariants}
                  className="mb-6 text-6xl lg:text-8xl font-bold text-slate-900 tracking-tighter leading-[0.85] non-italic"
                >
                  Бизнесээ <br />
                  <div className="mt-2 not-italic flex items-baseline">
                    {/* Gradient Container for Mon1.mn */}
                    <div className="bg-linear-to-r from-[#ff3bad] to-[#2a00ff] bg-clip-text text-transparent font-black tracking-tighter">
                      <span className="text-[96px]">M</span>
                      <span className="text-[70px]">on</span>
                      <span className="text-[96px]">1</span>
                      <span className="text-[70px]">.mn</span>
                    </div>

                    {/* Regular text for -той */}
                    <span className="text-slate-900 font-bold text-[96px] ml-2">
                      -той
                    </span>
                  </div>
                  өргөжүүл.
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="max-w-md text-lg text-slate-500 mb-8 leading-relaxed font-semibold italic"
                >
                  Баталгаажсан агент болсноор эзэмшигчдийн шууд хүсэлтийг хүлээн
                  авч, борлуулалтаа хурдасга.
                </motion.p>

                <motion.div variants={itemVariants} className="flex gap-4">
                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
                      150+
                    </p>
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">
                      Агентууд
                    </p>
                  </div>
                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
                      98%
                    </p>
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">
                      Сэтгэл ханамж
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* --- LOGIN CARD: WHITE GLASSMORPHISM --- */}
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full opacity-20 pointer-events-none" />

                <Card className="relative border-white bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3rem] text-slate-900 overflow-hidden p-2">
                  <CardHeader className="pt-10 px-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-[1.2rem] flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">
                      Нэвтрэх
                    </CardTitle>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      Агентын удирдлагын хэсэг
                    </p>
                  </CardHeader>

                  <CardContent className="px-10 pb-12 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Ажлын и-мэйл
                      </Label>
                      <Input
                        className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white text-slate-900 placeholder:text-slate-300 ring-0 focus-visible:ring-2 focus-visible:ring-blue-600/10 transition-all font-semibold"
                        placeholder="agent@mon1.mn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Нууц код
                      </Label>
                      <Input
                        type="password"
                        className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white text-slate-900 ring-0 focus-visible:ring-2 focus-visible:ring-blue-600/10 transition-all font-semibold"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button
                      asChild={isSignedIn}
                      className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-black tracking-tighter shadow-xl shadow-blue-600/20 group transition-all"
                    >
                      {isSignedIn ? (
                        <Link
                          href="/dashboard"
                          className="flex items-center justify-center gap-2"
                        >
                          САМБАР РУУ ОРОХ{" "}
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <Link href="/sign-in?redirect_url=%2Fdashboard">
                          НЭВТРЭХ
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- APPLICATION FORM --- */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-2xl shadow-black/5 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-zinc-50 border-b border-zinc-100 p-10">
                  <CardTitle className="text-4xl font-black text-[#2a00ff] tracking-tighter uppercase mb-2">
                    Агент болох хүсэлт
                  </CardTitle>
                  <p className="text-zinc-500 font-medium">
                    Мэдээллээ үлдээнэ үү.
                  </p>
                </CardHeader>
                <CardContent className="p-10">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-16"
                      >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="h-10 w-10 text-primary animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">
                          Илгээгдлээ!
                        </h2>
                        <p className="text-zinc-500 max-w-sm mx-auto font-medium italic">
                          24 цагийн дотор эргэн холбогдох болно.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Бүтэн нэр
                          </Label>
                          <Input
                            className="h-14 bg-zinc-50 border-zinc-200 rounded-xl"
                            placeholder="Г. Бат-Эрдэнэ"
                            value={formData.fullName}
                            onChange={(e) =>
                              updateField("fullName", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Утасны дугаар
                          </Label>
                          <Input
                            className="h-14 bg-zinc-50 border-zinc-200 rounded-xl"
                            placeholder="+976 9911 ----"
                            value={formData.phone}
                            onChange={(e) =>
                              updateField("phone", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Ажиллах бүс / Дүүрэг
                          </Label>
                          <Input
                            className="h-14 bg-zinc-50 border-zinc-200 rounded-xl"
                            placeholder="ХУД, Зайсан, СБД..."
                            value={formData.areas}
                            onChange={(e) =>
                              updateField("areas", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Туршлага
                          </Label>
                          <Textarea
                            className="bg-zinc-50 border-zinc-200 rounded-xl p-5"
                            placeholder="Танилцуулгаа үлдээнэ үү..."
                            rows={5}
                            value={formData.notes}
                            onChange={(e) =>
                              updateField("notes", e.target.value)
                            }
                          />
                        </div>
                        <div className="md:col-span-2 pt-4">
                          <Button
                            disabled={isLoading}
                            className="w-full h-16 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-xl font-black tracking-tight"
                            onClick={handleSubmit}
                          >
                            {isLoading ? "УНШИЖ БАЙНА..." : "ХҮСЭЛТ ИЛГЭЭХ"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* SIDEBAR STEPS */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="p-10 rounded-[2.5rem] bg-primary text-white shadow-2xl relative overflow-hidden">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-8">
                  Алхмууд
                </h3>
                <div className="space-y-10 relative z-10">
                  {[
                    { t: "Хүсэлт", d: "Мэдээллээ илгээх" },
                    { t: "Уулзалт", d: "Баталгаажуулалт хийх" },
                    { t: "Нэвтрэх", d: "Эрхээ идэвхжүүлэх" },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-5 items-start">
                      <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-black text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg leading-none mb-1 uppercase tracking-tight">
                          {s.t}
                        </p>
                        <p className="text-white/60 text-sm">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                {" "}
                <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <p className="font-black tracking-tight uppercase text-[10px] text-zinc-400">
                      Direct Support
                    </p>
                  </div>
                  <p className="text-2xl font-black text-zinc-950 flex flex-col">
                    <span>+976 94948873,</span>
                  </p>
                  <p className="text-primary font-bold underline text-sm mt-1">
                    agents@mon1.mn
                  </p>{" "}
                </div>{" "}
                <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <p className="font-black tracking-tight uppercase text-[10px] text-zinc-400">
                      Direct Support
                    </p>
                  </div>
                  <p className="text-2xl font-black text-zinc-950 flex flex-col">
                    <span>+976 94498873</span>
                  </p>
                  <p className="text-primary font-bold underline text-sm mt-1">
                    agents@mon1.mn
                  </p>{" "}
                </div>
              </div>
            </motion.aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
