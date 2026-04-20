import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FORM_STEPS } from "./constants";

export function FormStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-11 rounded-3xl border border-slate-50 bg-white px-2.5 py-3 shadow-[0_45px_90px_-55px_rgba(42,0,255,0.45)] md:mt-14 md:rounded-[3rem] md:px-7 md:py-5">
      <div className="mx-auto flex w-fit items-center justify-center gap-1 md:w-full md:justify-between md:gap-2">
        {FORM_STEPS.map((item) => (
          <div key={item.step} className="flex min-w-fit items-center gap-1 md:min-w-0 md:flex-1 md:gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black shadow-sm transition-all md:h-10 md:w-10 md:rounded-xl md:text-sm",
                currentStep >= item.step
                  ? "rotate-3 border-[#2a00ff] bg-[#2a00ff] text-white"
                  : "border-[#ffe3f5] bg-[#fff7fc] text-[#ff9ce0]",
              )}
            >
              {currentStep > item.step ? (
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                `0${item.step}`
              )}
            </div>
            <div className="hidden min-w-0 flex-col md:flex">
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
              <div className="mx-0.5 h-0.5 w-6 bg-[#f4ecff] md:mx-1 md:w-20" />
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
  description?: string | undefined;
  children: ReactNode;
}) {
  return (
    <Card className="mt-0 w-full overflow-hidden rounded-3xl border border-slate-50 bg-white shadow-[0_50px_100px_-55px_rgba(42,0,255,0.5)] md:rounded-[3.5rem]">
      <div className="bg-[linear-gradient(135deg,#1a0b3b_0%,#2a00ff_110%)] p-4 text-white md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9ce0]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-black uppercase italic leading-none tracking-tight md:mt-3 md:text-4xl">
          {title} <span className="text-[#ff2bad]">{accent}</span>
        </h2>
        <p className="mt-2.5 max-w-2xl text-[11px] font-semibold leading-5 text-white/75 md:mt-4 md:text-xs md:leading-5">
          {description}
        </p>
      </div>
      <CardContent className="space-y-5 p-3 md:space-y-6 md:p-7">{children}</CardContent>
    </Card>
  );
}

export function StepNavigation({
  onBack,
  onNext,
  nextLabel,
  submit,
  /** Алхам солигдох бүрт түгжээ цэвэрлэгдэнэ */
  step,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  submit?: boolean;
  step?: number;
}) {
  const [isBusyUi, setIsBusyUi] = useState(false);
  // Mobile дээр зарим үед хурдан давхар даралт алхам солилтыг алгасгадаг тул
  // богино lock ашиглаж нэг товшилтыг найдвартай болгоно.
  const isLockedRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);

  const clearReleaseTimer = () => {
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (step === undefined) {
      return;
    }
    isLockedRef.current = false;
    setIsBusyUi(false);
    clearReleaseTimer();
  }, [step]);

  useEffect(() => {
    return () => {
      clearReleaseTimer();
    };
  }, []);

  const handleBack = () => {
    if (!onBack || isLockedRef.current) {
      return;
    }
    isLockedRef.current = true;
    setIsBusyUi(true);
    onBack();
    releaseTimerRef.current = window.setTimeout(() => {
      isLockedRef.current = false;
      setIsBusyUi(false);
      releaseTimerRef.current = null;
    }, 280);
  };

  const handleNext = () => {
    if (isLockedRef.current) {
      return;
    }
    isLockedRef.current = true;
    setIsBusyUi(true);
    onNext();
    releaseTimerRef.current = window.setTimeout(() => {
      isLockedRef.current = false;
      setIsBusyUi(false);
      releaseTimerRef.current = null;
    }, 280);
  };

  return (
    <div className="relative z-20 flex gap-2 pt-0.5 md:gap-4 md:pt-2">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={isBusyUi}
          className="group flex h-10 w-14 flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-slate-200 bg-white transition-all hover:border-[#2a00ff] hover:text-[#2a00ff] active:scale-95 md:h-18 md:w-24 md:gap-1 md:rounded-[1.8rem]"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-700 transition-transform group-hover:-translate-x-1 group-hover:text-[#2a00ff] md:h-5 md:w-5" />
          <span className="text-[8px] font-black uppercase tracking-wide text-slate-500 group-hover:text-[#2a00ff] md:text-[10px] md:tracking-widest">
            Буцах
          </span>
        </Button>
      )}
      <Button
        type="button"
        onClick={handleNext}
        disabled={isBusyUi}
        className={cn(
          "rounded-xl bg-[#2a00ff] text-[11px] font-black uppercase tracking-widest text-white shadow-2xl shadow-[#2a00ff]/25 transition-all hover:-translate-y-1 hover:bg-[#ff3bad] md:rounded-[1.4rem] md:text-sm md:tracking-[0.2em]",
          onBack ? "h-10 flex-1 md:h-14" : "h-10 w-full md:h-14",
          submit && "h-11 rounded-2xl text-[11px] tracking-widest md:h-16 md:rounded-3xl md:text-base md:tracking-[0.18em]",
        )}
      >
        {nextLabel}
        {submit ? (
          <Send className="ml-2 h-4 w-4 md:ml-3 md:h-6 md:w-6" />
        ) : (
          <ArrowRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
        )}
      </Button>
    </div>
  );
}
