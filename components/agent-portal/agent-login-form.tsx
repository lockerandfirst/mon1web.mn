"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAgent } from "@/lib/auth";

const AGENT_PORTAL_REDIRECT = encodeURIComponent("/agent-portal");

export function AgentLoginForm() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  if (!authLoaded || (isSignedIn && !userLoaded)) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[3rem] border border-slate-100 bg-white/70 p-8">
        <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  const hasAgentRole =
    isSignedIn && isAgent({ publicMetadata: user?.publicMetadata ?? null });

  if (isSignedIn && hasAgentRole) {
    return null;
  }

  if (isSignedIn && !hasAgentRole) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[#2a00ff]/15 blur-[100px] opacity-40" />
        <Card className="relative overflow-hidden rounded-4xl border border-white bg-white/70 p-1.5 text-slate-900 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] backdrop-blur-3xl md:rounded-[3rem] md:p-2">
          <CardHeader className="px-4 pt-4 md:px-10 md:pt-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a00ff] shadow-lg shadow-[#2a00ff]/25 md:mb-6 md:h-14 md:w-14 md:rounded-[1.2rem]">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="mb-2 text-xl font-black uppercase italic leading-tight tracking-tight md:text-3xl md:tracking-tighter">
              Агентын эрх
            </CardTitle>
            <p className="text-xs font-semibold leading-relaxed text-slate-500 md:text-sm">
              Та одоогоор агентын самбарын эрхгүй байна. Доорх хүсэлтийн маягтыг
              бөглөж, бидэнтэй холбогдоно уу.
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-5 md:px-10 md:pb-12">
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-[#2a00ff] text-sm font-black text-white shadow-lg shadow-[#2a00ff]/20 hover:bg-[#2400d9] md:h-14 md:rounded-2xl md:text-base"
            >
              <a href="#agent-apply">Агент болох хүсэлт бөглөх</a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[#2a00ff]/15 blur-[100px] opacity-40" />

      <Card className="relative overflow-hidden rounded-4xl border border-white bg-white/70 p-1.5 text-slate-900 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] backdrop-blur-3xl md:rounded-[3rem] md:p-2">
        <CardHeader className="px-4 pt-4 md:px-10 md:pt-10">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a00ff] shadow-lg shadow-[#2a00ff]/25 md:mb-6 md:h-14 md:w-14 md:rounded-[1.2rem]">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="mb-1 text-2xl font-black uppercase italic leading-none tracking-tight md:mb-2 md:text-4xl md:tracking-tighter">
            Нэвтрэх
          </CardTitle>
          <p className="text-[9px] font-black uppercase tracking-wide text-slate-400 md:text-[10px] md:tracking-widest">
            Агентын удирдлагын хэсэг
          </p>
        </CardHeader>

        <CardContent className="space-y-4 px-4 pb-5 md:space-y-6 md:px-10 md:pb-12">
          <div className="space-y-1.5 md:space-y-2">
            <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ажлын и-мэйл
            </Label>
            <Input
              readOnly
              className="h-11 cursor-default rounded-xl border-slate-100 bg-slate-50 text-sm font-semibold text-slate-900 md:h-14 md:rounded-2xl"
              placeholder="agent@mon1.mn"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Нууц код
            </Label>
            <Input
              readOnly
              type="password"
              className="h-11 cursor-default rounded-xl border-slate-100 bg-slate-50 text-sm font-semibold text-slate-900 md:h-14 md:rounded-2xl"
              placeholder="••••••••"
            />
          </div>

          <Button
            asChild
            className="group h-12 w-full rounded-xl bg-[#2a00ff] text-base font-black tracking-tight text-white shadow-xl shadow-[#2a00ff]/25 transition-all hover:bg-[#2400d9] md:h-16 md:rounded-2xl md:text-xl md:tracking-tighter"
          >
            <Link href={`/sign-in?redirect_url=${AGENT_PORTAL_REDIRECT}`}>
              <span className="flex items-center justify-center gap-2">
                НЭВТРЭХ
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
