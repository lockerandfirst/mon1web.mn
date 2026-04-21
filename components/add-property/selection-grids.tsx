import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Home, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import {
  AMENITY_OPTIONS,
  DISTRICTS,
  PROPERTY_TYPE_ICONS,
  PROPERTY_TYPE_OPTIONS,
  SURROUNDING_OPTIONS,
} from "./constants";

function SparkleBadge({ sharedLayoutId }: { sharedLayoutId?: string }) {
  return (
    <motion.span
      layoutId={sharedLayoutId}
      initial={sharedLayoutId ? undefined : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={sharedLayoutId ? undefined : { scale: 0.8, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 28,
      }}
      style={{ backgroundColor: "#ff2bad", opacity: 1 }}
      className="pointer-events-none absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff2bad]! opacity-100! text-white shadow-md shadow-[#ff2bad]/40 md:right-3 md:top-3 md:h-11 md:w-11 md:shadow-[0_12px_30px_-12px_rgba(255,43,173,0.95)]"
    >
      <span className="absolute inset-0 rounded-full bg-linear-to-br from-[#ffb7e3] via-[#ff72c7] to-[#ff2bad]" />
      <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/60 md:left-2 md:top-2 md:h-2.5 md:w-2.5" />
      <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-white/75 md:bottom-2 md:right-2 md:h-1.5 md:w-1.5" />
      <Sparkles className="relative z-10 h-3 w-3 fill-current md:h-4 md:w-4" />
    </motion.span>
  );
}

export function PropertyTypeGrid({
  value,
  onChange,
  options = PROPERTY_TYPE_OPTIONS,
  icons,
  badgeLayoutId = "add-property-type-badge",
  label = "Үл хөдлөхийн төрөл",
}: {
  value: string;
  onChange: (value: string) => void;
  options?: ReadonlyArray<{ value: string; label: string }>;
  icons?: Partial<Record<string, LucideIcon>>;
  badgeLayoutId?: string;
  label?: string;
}) {
  const iconMap = { ...PROPERTY_TYPE_ICONS, ...icons };

  return (
    <div className="space-y-2 md:space-y-4">
      <Label className="ml-1 text-[9px] font-black uppercase tracking-wide text-slate-400 md:ml-2 md:text-[10px] md:tracking-[0.2em]">
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-4">
        {options.map((item) => {
          const Icon = iconMap[item.value] || Home;
          const isActive = value === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                "group relative flex min-h-17 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 p-2 text-center transition-all duration-300 max-md:active:scale-[0.99] md:min-h-44 md:gap-4 md:rounded-[2.5rem] md:p-6",
                isActive
                  ? "border-[#2a00ff] bg-[#2a00ff]/5 shadow-md shadow-[#2a00ff]/10 md:scale-[1.02] md:shadow-xl"
                  : "border-slate-50 bg-slate-50/60 hover:border-slate-200 hover:bg-white",
              )}
            >
              {isActive && (
                <SparkleBadge sharedLayoutId={badgeLayoutId} />
              )}
              <div className="pointer-events-none absolute inset-x-3 bottom-2 h-5 rounded-full bg-[#ff2bad]/8 blur-xl transition-opacity duration-300 group-hover:opacity-100 md:inset-x-6 md:bottom-4 md:h-8 md:blur-2xl" />
              <Icon
                className={cn(
                  "relative z-1 h-5 w-5 transition-transform duration-300 md:h-10 md:w-10 md:group-hover:scale-110",
                  isActive ? "text-[#2a00ff]" : "text-slate-300",
                )}
              />
              <span
                className={cn(
                  "relative z-1 line-clamp-2 text-[8px] font-black uppercase leading-tight tracking-wide md:text-[10px] md:tracking-[0.18em]",
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
    <div className="space-y-2.5 md:space-y-3">
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
              "h-11 rounded-xl border-2 text-sm font-black transition-all md:h-14 md:rounded-[1.4rem]",
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
    <div className="space-y-3 md:space-y-4">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Дүүрэг
      </Label>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
        {DISTRICTS.map((district) => (
          <button
            key={district}
            type="button"
            onClick={() => onChange(district)}
            className={cn(
              "h-12 rounded-2xl border-2 px-3 text-[11px] font-black uppercase tracking-[0.12em] transition-all md:h-16 md:rounded-3xl md:px-4 md:text-sm md:tracking-[0.15em]",
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
    <div className="space-y-3 md:space-y-4">
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
              {isActive && <SparkleBadge />}
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

export function AmenitiesGrid({
  value,
  onToggle,
}: {
  value: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Байрны боломжууд
      </Label>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {AMENITY_OPTIONS.map((feature) => {
          const isActive = value.includes(feature);

          return (
            <button
              key={feature}
              type="button"
              onClick={() => onToggle(feature)}
              className={cn(
                "rounded-xl border-2 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all md:rounded-[1.6rem] md:px-4 md:py-4 md:text-sm md:tracking-[0.12em]",
                isActive
                  ? "border-[#2a00ff] bg-[#eef0ff] text-[#2a00ff] shadow-lg shadow-[#2a00ff]/10"
                  : "border-[#f2eaff] bg-[#fff9fd] text-[#7f6f98] hover:border-[#d7c7ff]",
              )}
            >
              {feature}
            </button>
          );
        })}
      </div>
    </div>
  );
}
