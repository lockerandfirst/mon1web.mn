import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import {
  DISTRICTS,
  PROPERTY_TYPE_ICONS,
  PROPERTY_TYPE_OPTIONS,
  SURROUNDING_OPTIONS,
} from "./constants";

export function PropertyTypeGrid({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Үл хөдлөхийн төрөл
      </Label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PROPERTY_TYPE_OPTIONS.map((item) => {
          const Icon = PROPERTY_TYPE_ICONS[item.value] || Home;
          const isActive = value === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                "group relative flex min-h-44 flex-col items-center justify-center gap-4 overflow-hidden rounded-[2.5rem] border-2 p-6 text-center transition-all duration-300",
                isActive
                  ? "scale-[1.03] border-[#2a00ff] bg-[#2a00ff]/5 shadow-xl shadow-[#2a00ff]/10"
                  : "border-slate-50 bg-slate-50/60 hover:border-slate-200 hover:bg-white",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="add-property-category-badge"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="pointer-events-none absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffb7e3_0%,#ff72c7_52%,#ff2bad_100%)] text-white shadow-[0_12px_30px_-12px_rgba(255,43,173,0.95)]"
                >
                  <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-white/60" />
                  <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-white/75" />
                  <Sparkles className="h-4 w-4 fill-current" />
                </motion.span>
              )}
              <div className="pointer-events-none absolute inset-x-6 bottom-4 h-8 rounded-full bg-[#ff2bad]/8 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <Icon
                className={cn(
                  "relative z-1 h-10 w-10 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-[#2a00ff]" : "text-slate-300",
                )}
              />
              <span
                className={cn(
                  "relative z-1 text-[10px] font-black uppercase tracking-[0.18em]",
                  isActive ? "text-[#2a00ff]" : "text-slate-500",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChoiceRow({
  label,
  activeValue,
  color,
  options,
  onChange,
}: {
  label: string;
  activeValue: string;
  color: "blue" | "pink";
  options: string[];
  onChange: (value: string) => void;
}) {
  const activeClass =
    color === "blue"
      ? "scale-105 border-[#2a00ff] bg-[#2a00ff] text-white shadow-lg shadow-[#2a00ff]/20"
      : "scale-105 border-[#ff2bad] bg-[#ff2bad] text-white shadow-lg shadow-[#ff2bad]/20";
  const idleClass =
    color === "blue"
      ? "border-[#f4ecff] bg-[#fff7fc] text-[#ff9ce0]"
      : "border-[#ffe5f5] bg-[#fff8fd] text-[#ff9ce0]";

  return (
    <div className="space-y-3">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </Label>
      <div
        className={cn(
          "grid gap-2",
          options.length === 5 ? "grid-cols-5" : "grid-cols-3",
        )}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "h-14 rounded-[1.4rem] border-2 font-black transition-all",
              activeValue === option ? activeClass : idleClass,
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DistrictGrid({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Дүүрэг
      </Label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {DISTRICTS.map((district) => (
          <button
            key={district}
            type="button"
            onClick={() => onChange(district)}
            className={cn(
              "h-16 rounded-3xl border-2 px-4 text-sm font-black uppercase tracking-[0.15em] transition-all",
              value === district
                ? "scale-105 border-[#ff2bad] bg-[#ff2bad]/5 text-[#ff2bad] shadow-lg shadow-[#ff2bad]/10"
                : "border-slate-50 bg-slate-50 text-slate-400",
            )}
          >
            {district}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SurroundingsGrid({
  value,
  onToggle,
}: {
  value: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Ойр орчимд
      </Label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SURROUNDING_OPTIONS.map((item) => {
          const isActive = value.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                "group relative overflow-hidden rounded-4xl border-2 p-6 text-left transition-all duration-300",
                isActive
                  ? "border-[#2a00ff] bg-[#eef0ff] shadow-lg shadow-[#2a00ff]/10"
                  : "border-[#f2eaff] bg-[#fff9fd]",
              )}
            >
              {isActive && (
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ff2bad] text-white shadow-[0_12px_30px_-12px_rgba(255,43,173,0.95)]"
                >
                  <Sparkles className="h-4 w-4 fill-current" />
                </motion.span>
              )}
              <item.icon
                className={cn(
                  "h-8 w-8 transition-transform group-hover:scale-110",
                  isActive ? "text-[#2a00ff]" : "text-[#ff9ce0]",
                )}
              />
              <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#1a0b3b]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#7f6f98]">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
