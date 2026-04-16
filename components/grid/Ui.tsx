"use client";

import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export {
  FormSection,
  FormStepper,
  StepNavigation,
} from "@/components/add-property/form-shell";
export {
  FieldCard,
  MetricCard,
  PlainField,
} from "@/components/add-property/inputs";
export { ChoiceRow } from "@/components/add-property/selection-grids";

export function AiTextarea({
  value,
  onChange,
  onOptimize,
  isProcessing,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onOptimize: () => void;
  isProcessing: boolean;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Зарын тайлбар
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 min-h-[15rem] rounded-[2rem] border-none bg-[#fff9fd] p-6 pr-32 text-base font-bold text-[#1a0b3b] resize-none focus:ring-8 focus:ring-[#2a00ff]/5"
      />
    </div>
  );
}

export function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-[#f8f6ff] p-4">
      <Icon className="h-5 w-5 text-[#2a00ff]" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[#1a0b3b]">{value}</p>
    </div>
  );
}

export function ChecklistRow({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[1.4rem] bg-white px-4 py-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          done ? "bg-[#2a00ff] text-white" : "bg-[#ffe5f5] text-[#ff9ce0]",
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <p
        className={cn(
          "text-sm font-black",
          done ? "text-[#1a0b3b]" : "text-[#c48ab6]",
        )}
      >
        {label}
      </p>
    </div>
  );
}
