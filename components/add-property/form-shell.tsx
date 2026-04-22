import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FORM_STEPS } from "./constants";

export type FormStepDefinition = {
  step: number;
  label: string;
  /** Shown on mobile under the stepper; hidden on desktop when using compact stepper. */
  hint?: string;
};

export function FormStepper({
  currentStep,
  steps,
  ariaLabel = "Зар нэмэх алхмууд",
}: {
  currentStep: number;
  steps?: readonly FormStepDefinition[];
  ariaLabel?: string;
}) {
  const items = steps ?? FORM_STEPS;
  const maxStep = items.length;

  return (
    <div
      className={cn(
        "mx-auto mt-1 w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white/95 px-1 py-1 shadow-sm sm:max-w-7xl md:mt-10 md:rounded-3xl md:border-slate-200/80 md:px-4 md:py-3 md:shadow-sm",
      )}
      role="navigation"
      aria-label={ariaLabel}
    >
      {/* Гар утас: сегмент + шошго — алхмууд тод харагдана */}
      <div
        className="flex gap-0.5 rounded-xl bg-slate-100/95 p-0.5 md:hidden"
        role="list"
      >
        {items.map((item) => {
          const done = currentStep > item.step;
          const active = currentStep === item.step;
          return (
            <div
              key={item.step}
              role="listitem"
              aria-current={active ? "step" : undefined}
              aria-label={`Алхам ${item.step}: ${item.label}`}
              className={cn(
                "flex min-h-10 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 transition-all duration-200",
                active &&
                  "bg-white text-[#2a00ff] shadow-sm ring-1 ring-slate-200/60",
                done &&
                  !active &&
                  "text-[#2a00ff] [&>span:last-child]:text-[#ff3bad]/90",
                !done && !active && "text-slate-400",
              )}
            >
              <span className="flex h-5 items-center text-[11px] font-black tabular-nums leading-none">
                {done && !active ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  item.step
                )}
              </span>
              <span className="max-w-full truncate text-[8px] font-bold uppercase leading-none tracking-wide">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop: төвд байрлана; зураас зөвхөн алхмуудын хооронд (3-ын дараа хоосон зайгүй) */}
      <div className="mx-auto hidden w-full max-w-7xl flex-wrap items-center justify-between gap-y-2 md:flex">
        {items.map((item, idx) => (
          <div key={item.step} className="flex items-center">
            <div className="flex shrink-0 items-center gap-2 px-0.5">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-black shadow-sm transition-all",
                  currentStep >= item.step
                    ? "border-[#2a00ff] bg-[#2a00ff] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-400",
                )}
              >
                {currentStep > item.step ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                ) : (
                  item.step
                )}
              </div>
              <span
                className={cn(
                  "max-w-22 truncate text-xs font-bold tracking-tight sm:max-w-none",
                  currentStep >= item.step
                    ? "text-[#2a00ff]"
                    : "text-slate-400",
                )}
              >
                {item.label}
              </span>
            </div>
            {idx < maxStep - 1 ? (
              <div
                className="mx-2 h-px w-9 shrink-0 bg-slate-200/90 sm:mx-3 sm:w-20"
                aria-hidden
              />
            ) : null}
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
      <CardContent className="space-y-5 p-3 md:space-y-6 md:p-7">
        {children}
      </CardContent>
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
  nextDisabled,
  pending,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  submit?: boolean;
  step?: number;
  nextDisabled?: boolean;
  pending?: boolean;
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
        disabled={isBusyUi || Boolean(nextDisabled) || Boolean(pending)}
        className={cn(
          "rounded-xl bg-[#2a00ff] text-[11px] font-black uppercase tracking-widest text-white shadow-2xl shadow-[#2a00ff]/25 transition-all hover:-translate-y-1 hover:bg-[#ff3bad] md:rounded-[1.4rem] md:text-sm md:tracking-[0.2em]",
          onBack ? "h-10 flex-1 md:h-14" : "h-10 w-full md:h-14",
          submit &&
            "h-11 rounded-2xl text-[11px] tracking-widest md:h-16 md:rounded-3xl md:text-base md:tracking-[0.18em]",
        )}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin md:h-6 md:w-6" />
        ) : (
          <>
            {nextLabel}
            {submit ? (
              <Send className="ml-2 h-4 w-4 md:ml-3 md:h-6 md:w-6" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
            )}
          </>
        )}
      </Button>
    </div>
  );
}
