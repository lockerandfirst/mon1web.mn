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
    <div className="space-y-3">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className={cn(
            "absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2",
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
    <div className="space-y-3">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-16 rounded-[1.6rem] border-none bg-[#f8f6ff] px-6 font-bold text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5"
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
    <div className="rounded-4xl bg-[linear-gradient(135deg,rgba(42,0,255,0.06),rgba(255,43,173,0.12))] px-6 py-5">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff3bad]">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-black tracking-tight text-[#2a00ff]">
          {value}
        </span>
        <span className="pb-1 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}
