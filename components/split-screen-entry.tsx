"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Home,
  Briefcase,
  Sparkles,
  ArrowRight,
  Trophy,
  MousePointer2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function SplitScreenEntry() {
  const router = useRouter();
  const [hoveredSide, setHoveredSide] = useState<"user" | "agent" | null>(null);
  const [typedText, setTypedText] = useState("");

  const fullText = "Сайн байна уу? Танд тохирох байрыг олоход тусалъя.";

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  const handleRoleSelect = (role: "user" | "agent") => {
    localStorage.setItem("mon1_role", role);
    router.push(role === "user" ? "/home" : "/agent-portal");
  };

  const getWidths = () => {
    if (hoveredSide === "user") return { user: "80%", agent: "20%" };
    if (hoveredSide === "agent") return { user: "20%", agent: "80%" };
    return { user: "60%", agent: "40%" };
  };

  const { user: userWidth, agent: agentWidth } = getWidths();

  // Animation Variants for Split Text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="h-screen w-screen flex overflow-hidden bg-[#2a00ff] font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* --- USER SIDE --- */}
      <motion.div
        className="relative h-full cursor-pointer group border-r border-white/5"
        animate={{ width: userWidth }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        onMouseEnter={() => setHoveredSide("user")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => handleRoleSelect("user")}
      >
        <div className="absolute inset-0 bg-[#2a00ff]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-all duration-[3s]"
          >
            <source
              src="https://videos.pexels.com/video-files/3773486/3773486-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-[#2a00ff]/25 via-[#2a00ff]/45 to-[#2a00ff]/95" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-24">
          <AnimatePresence mode="wait">
            {(!hoveredSide || hoveredSide === "user") && (
              <motion.div
                key="user-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-2xl origin-left"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="p-3 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white/40 font-medium tracking-[0.2em] uppercase text-xs">
                    Хэрэглэгч
                  </span>
                </motion.div>

                {/* --- SPLIT TEXT ANIMATION --- */}
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tighter leading-[0.9] flex flex-col">
                  <motion.span variants={itemVariants}>
                    Мөрөөдлийн <span className="text-primary">гэрээ</span>
                  </motion.span>
                  <motion.span variants={itemVariants}>
                    эндээс олоорой.
                  </motion.span>
                </h1>

                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-4 bg-white/3 backdrop-blur-md border border-white/10 p-4 rounded-2xl mb-12"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#2a00ff] rounded-full" />
                  </div>
                  <p className="text-white/90 text-sm font-medium pr-4">
                    {typedText}
                    <span className="animate-pulse">_</span>
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center gap-6"
                >
                  <Button
                    size="lg"
                    className="h-16 px-12 min-w-70 rounded-2xl bg-white text-[#2a00ff] hover:bg-white/90 transition-all group/btn shadow-xl"
                  >
                    <span className="text-xl font-extrabold uppercase tracking-tight">
                      Байр хайх
                    </span>
                    <ArrowRight className="ml-3 h-6 w-6 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>

                  <div className="hidden lg:flex gap-8 border-l border-white/10 pl-8">
                    <div>
                      <p className="text-2xl font-bold text-white">2.5k+</p>
                      <p className="text-white/40 text-[10px] uppercase font-bold">
                        Идэвхтэй зар
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- AGENT SIDE --- */}
      <motion.div
        className="relative h-full cursor-pointer group"
        animate={{ width: agentWidth }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        onMouseEnter={() => setHoveredSide("agent")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => handleRoleSelect("agent")}
      >
        <div className="absolute inset-0 bg-[#2a00ff]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-20">
          <AnimatePresence mode="wait">
            {(!hoveredSide || hoveredSide === "agent") && (
              <motion.div
                key="agent-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-md origin-right"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="p-3 bg-primary/20 backdrop-blur-2xl rounded-2xl border border-primary/20">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-primary font-medium tracking-[0.2em] uppercase text-xs">
                    Агент портал
                  </span>
                </motion.div>

                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tighter leading-none flex flex-col">
                  <motion.span variants={itemVariants}>Бизнесээ</motion.span>
                  <motion.span
                    variants={itemVariants}
                    className="text-primary/80"
                  >
                    өргөжүүл.
                  </motion.span>
                </h2>

                <motion.ul variants={itemVariants} className="space-y-4 mb-12">
                  <li className="flex items-center gap-3 text-white/50 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-primary" />{" "}
                    Баталгаажсан эрхтэй бүртгэл
                  </li>
                  <li className="flex items-center gap-3 text-white/50 text-sm font-medium">
                    <Trophy className="h-4 w-4 text-primary" /> Тэргүүлэгч агент
                  </li>
                </motion.ul>

                <motion.div variants={itemVariants}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-12 min-w-55 rounded-2xl border-white/10 bg-white/5 hover:bg-white text-white transition-all group/btn"
                  >
                    <span className="text-lg font-bold uppercase">
                      Агентаар нэвтрэх
                    </span>
                    <MousePointer2 className="ml-3 h-4 w-4 group-hover/btn:-translate-y-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modern Center Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
        <div className="h-32 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
      </div>
    </motion.div>
  );
}
