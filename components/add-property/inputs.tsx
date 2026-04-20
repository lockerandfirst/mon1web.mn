import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FieldCard({
  label,
  icon: Icon,
  iconColor,
  children,
}: {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5 md:space-y-3">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className={cn(
            "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 md:left-5 md:h-6 md:w-6",
            iconColor,
          )}
        />
        {children}
      </div>
    </div>
  );
}

export function PlainField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2.5 md:space-y-3">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-none bg-[#f8f6ff] px-4 text-sm font-bold text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5 md:h-16 md:rounded-[1.6rem] md:px-6 md:text-base"
      />
    </div>
  );
}

export function MetricCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(42,0,255,0.06),rgba(255,43,173,0.12))] px-4 py-3.5 md:rounded-4xl md:px-6 md:py-5">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff3bad]">
        {label}
      </p>
      <div className="mt-1.5 flex items-end gap-2 md:mt-2">
        <span className="text-2xl font-black tracking-tight text-[#2a00ff] md:text-3xl">
          {value}
        </span>
        <span className="pb-0.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 md:pb-1 md:text-sm md:tracking-[0.2em]">
          {suffix}
        </span>
      </div>
    </div>
  );
}
