import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FORM_STEPS } from "./constants";

export function FormStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="rounded-[3rem] border border-slate-50 mt-15 bg-white px-6 py-6 shadow-[0_45px_90px_-55px_rgba(42,0,255,0.45)] md:px-8">
      <div className="flex items-center justify-between gap-2">
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
  description?: string | undefined;
  children: ReactNode;
}) {
  return (
    <Card className="mt-0 w-full overflow-hidden rounded-[3.5rem] border border-slate-50 bg-white shadow-[0_50px_100px_-55px_rgba(42,0,255,0.5)]">
      <div className="bg-[linear-gradient(135deg,#1a0b3b_0%,#2a00ff_110%)] p-10 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9ce0]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-black uppercase italic leading-none tracking-tight md:text-5xl">
          {title} <span className="text-[#ff2bad]">{accent}</span>
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
  /** Синхрон давхар даралтыг шууд хаана (setState-ийн хүлээгдэхгүй) */
  const busyRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);

  const clearReleaseTimer = useCallback(() => {
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  }, []);

  const releaseAfterDelay = useCallback(() => {
    clearReleaseTimer();
    releaseTimerRef.current = window.setTimeout(() => {
      busyRef.current = false;
      setIsBusyUi(false);
      releaseTimerRef.current = null;
    }, 420);
  }, [clearReleaseTimer]);

  useEffect(() => {
    if (step === undefined) {
      return;
    }
    busyRef.current = false;
    setIsBusyUi(false);
    clearReleaseTimer();
  }, [step, clearReleaseTimer]);

  useEffect(() => {
    return () => {
      clearReleaseTimer();
    };
  }, [clearReleaseTimer]);

  const handleBack = () => {
    if (!onBack || busyRef.current) {
      return;
    }
    busyRef.current = true;
    setIsBusyUi(true);
    queueMicrotask(() => {
      try {
        onBack();
      } finally {
        releaseAfterDelay();
      }
    });
  };

  const handleNext = () => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setIsBusyUi(true);
    queueMicrotask(() => {
      try {
        onNext();
      } finally {
        releaseAfterDelay();
      }
    });
  };

  return (
    <div className="relative z-20 flex gap-4 pt-2">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={isBusyUi}
          className="group flex h-14 w-20 flex-col items-center justify-center gap-1 rounded-[1.8rem] border-2 border-slate-200 bg-white transition-all hover:border-[#2a00ff] hover:text-[#2a00ff] active:scale-95 md:h-18 md:w-24"
        >
          <ArrowLeft className="h-5 w-5 text-slate-700 transition-transform group-hover:-translate-x-1 group-hover:text-[#2a00ff]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#2a00ff]">
            Буцах
          </span>
        </Button>
      )}
      <Button
        type="button"
        onClick={handleNext}
        disabled={isBusyUi}
        className={cn(
          "rounded-[1.8rem] bg-[#2a00ff] text-base font-black uppercase tracking-[0.25em] text-white shadow-2xl shadow-[#2a00ff]/25 transition-all hover:-translate-y-1 hover:bg-[#ff3bad]",
          onBack ? "h-14 flex-1 md:h-18" : "h-14 w-full md:h-18",
          submit && "h-16 rounded-4xl text-lg tracking-[0.22em] md:h-20 md:text-xl",
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
