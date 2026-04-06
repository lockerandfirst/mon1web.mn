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
        <section className="relative h-[calc(100vh-64px)] w-full flex items-center justify-center bg-zinc-950 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid gap-12 lg:grid-cols-2 items-center"
            >
              <div className="text-left">
                <motion.div
                  variants={itemVariants}
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-black text-primary uppercase tracking-[0.2em]"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Official Agent Network
                </motion.div>
                <motion.h1
                  variants={itemVariants}
                  className="mb-6 text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85]"
                >
                  Бизнесээ <br />{" "}
                  <span className="text-primary text-glow">Mon1.mn</span>-той{" "}
                  <br /> өргөжүүл.
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="max-w-md text-lg text-white/50 mb-8 leading-relaxed font-medium"
                >
                  Баталгаажсан агент болсноор эзэмшигчдийн шууд хүсэлтийг хүлээн
                  авч, AI тусламжтайгаар борлуулалтаа хурдасга.
                </motion.p>
                <motion.div variants={itemVariants} className="flex gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-2xl font-bold text-white tracking-tighter">
                      150+
                    </p>
                    <p className="text-[10px] uppercase text-white/40 font-bold">
                      Агентууд
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-2xl font-bold text-white tracking-tighter">
                      98%
                    </p>
                    <p className="text-[10px] uppercase text-white/40 font-bold">
                      Амжилт
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* SECURE LOGIN CARD - NO BLUR FOR STABILITY */}
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-10 pointer-events-none" />

                <Card
                  style={{ transform: "translateZ(0)" }} // GPU acceleration
                  className="relative border-white/10 bg-zinc-950 shadow-2xl rounded-[2.5rem] text-white overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

                  <CardHeader className="pt-10 px-10">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-2">
                      <span className="text-white not-italic">Нэвтрэх</span>
                    </CardTitle>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                      Шифрлэгдсэн нэвтрэх хэсэг
                    </p>
                  </CardHeader>
                  <CardContent className="px-10 pb-10 space-y-6">
                    <div className="space-y-2 group/input">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Ажлын и-мэйл
                      </Label>
                      <Input
                        className="h-14 bg-white/5 border-white/10 rounded-xl focus:bg-white/10 text-white placeholder:text-white/10 ring-0 focus-visible:ring-0"
                        placeholder="agent@mon1.mn"
                      />
                    </div>
                    <div className="space-y-2 group/input">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Нууц код
                      </Label>
                      <Input
                        type="password"
                        className="h-14 bg-white/5 border-white/10 rounded-xl focus:bg-white/10 text-white ring-0 focus-visible:ring-0"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button
                      asChild={isSignedIn}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-black tracking-tighter shadow-xl shadow-primary/20 group transition-all"
                    >
                      {isSignedIn ? (
                        <Link
                          href="/dashboard"
                          className="flex items-center justify-center gap-2"
                        >
                          Самбар руу орох{" "}
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <Link href="/sign-in?redirect_url=%2Fdashboard">
                          Нэвтэрч үргэлжлүүлэх
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
                  <CardTitle className="text-4xl font-black tracking-tighter uppercase mb-2">
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

              <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="font-black tracking-tight uppercase text-[10px] text-zinc-400">
                    Direct Support
                  </p>
                </div>
                <p className="text-2xl font-black text-zinc-950">
                  +976 7000 1234
                </p>
                <p className="text-primary font-bold underline text-sm mt-1">
                  agents@mon1.mn
                </p>
              </div>
            </motion.aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
