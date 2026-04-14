"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AgentLoginForm() {
  const { isSignedIn } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      {/* Glow Effect */}
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
              className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white text-slate-900 font-semibold"
              placeholder="agent@mon1.mn"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Нууц код
            </Label>
            <Input
              type="password"
              className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white text-slate-900 font-semibold"
              placeholder="••••••••"
            />
          </div>

          <Button
            asChild
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-black tracking-tighter shadow-xl shadow-blue-600/20 group transition-all"
          >
            <Link
              href={
                isSignedIn ? "/dashboard" : "/sign-in?redirect_url=%2Fdashboard"
              }
            >
              {isSignedIn ? (
                <span className="flex items-center gap-2">
                  САМБАР РУУ ОРОХ{" "}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              ) : (
                "НЭВТРЭХ"
              )}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
