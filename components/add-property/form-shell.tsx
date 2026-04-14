import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FORM_STEPS } from "./constants";

export function FormStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="rounded-[3rem] border border-slate-50 bg-white px-6 py-6 shadow-[0_45px_90px_-55px_rgba(42,0,255,0.45)] md:px-8">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {FORM_STEPS.map((item) => (
          <div key={item.step} className="flex min-w-fit items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl border font-black shadow-sm transition-all",
                currentStep >= item.step
                  ? "rotate-3 border-[#2a00ff] bg-[#2a00ff] text-white"
                  : "border-[#ffe3f5] bg-[#fff7fc] text-[#ff9ce0]",
              )}
            >
              {currentStep > item.step ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                `0${item.step}`
              )}
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Алхам
              </span>
              <span
                className={cn(
                  "text-xs font-black uppercase tracking-[0.2em]",
                  currentStep >= item.step
                    ? "text-[#2a00ff]"
                    : "text-[#ff9ce0]",
                )}
              >
                {item.label}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                {item.hint}
              </span>
            </div>
            {item.step < FORM_STEPS.length && (
              <div className="mx-1 h-0.5 w-10 bg-[#f4ecff] md:w-20" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSection({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[3.5rem] border border-slate-50 bg-white shadow-[0_50px_100px_-55px_rgba(42,0,255,0.5)]">
      <div className="bg-[linear-gradient(135deg,#1a0b3b_0%,#2a00ff_110%)] p-10 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9ce0]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-black uppercase italic leading-none tracking-tight md:text-5xl">
          {title} <span className="text-[#ff9ce0]">{accent}</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/75">
          {description}
        </p>
      </div>
      <CardContent className="space-y-8 p-10">{children}</CardContent>
    </Card>
  );
}

export function StepNavigation({
  onBack,
  onNext,
  nextLabel,
  submit,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  submit?: boolean;
}) {
  return (
    <div className="flex gap-4 pt-2">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-[4.5rem] w-24 rounded-[1.8rem] border-2 border-slate-100 bg-white text-slate-400 transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <Button
        type="button"
        onClick={onNext}
        className={cn(
          "rounded-[1.8rem] bg-[#2a00ff] text-base font-black uppercase tracking-[0.25em] text-white shadow-2xl shadow-[#2a00ff]/25 transition-all hover:-translate-y-1 hover:bg-[#ff3bad]",
          onBack ? "h-[4.5rem] flex-1" : "h-[4.5rem] w-full",
          submit && "h-20 rounded-4xl text-xl tracking-[0.22em]",
        )}
      >
        {nextLabel}
        {submit ? (
          <Send className="ml-3 h-6 w-6" />
        ) : (
          <ArrowRight className="ml-3 h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
