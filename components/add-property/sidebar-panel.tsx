import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  DollarSign,
  LayoutGrid,
  MapPin,
  Ruler,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

import type { FormData } from "./types";

export function SidebarPanel({
  completionScore,
  formData,
  pricePerSqm,
  propertyLabel,
  selectedAgentName,
}: {
  completionScore: number;
  formData: FormData;
  pricePerSqm: string | null;
  propertyLabel: string;
  selectedAgentName: string;
}) {
  return (
    <aside className="space-y-6 md:col-span-5 md:sticky md:top-24 lg:col-span-4 max-w-60">
      <Card className="relative overflow-hidden rounded-[3rem] border-none bg-[#1a0b3b] p-10 text-white shadow-[0_45px_90px_-55px_rgba(26,11,59,1)]">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#2a00ff]/25 blur-3xl" />
        <div className="absolute -bottom-4 left-6 h-24 w-24 rounded-full bg-[#ff3bad]/20 blur-3xl" />
        <h3 className="mb-6 flex items-center gap-3 text-xl font-black uppercase italic tracking-tight">
          <Zap className="h-6 w-6 text-[#ff3bad]" />
          Зарын чанар
        </h3>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9ce0]">
              Оноо
            </span>
            <span className="text-5xl font-black tracking-tight text-white">
              {completionScore}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#ff3bad_0%,#2a00ff_100%)]"
              animate={{ width: `${completionScore}%` }}
            />
          </div>
          <p className="text-sm font-semibold leading-6 text-white/80">
            {completionScore >= 80
              ? "Зар нийтлэхэд бараг бэлэн боллоо."
              : "Үнэ, байршил, тайлбар гурав дэлгэрэх тусам зар илүү хүчтэй болно."}
          </p>
        </div>
      </Card>

      <Card className="rounded-[2.5rem] border border-[#f0e8ff] bg-white p-8 shadow-[0_35px_80px_-55px_rgba(42,0,255,0.45)]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff3bad]">
          Live Preview
        </p>
        <div className="mt-4 space-y-4">
          <div className="rounded-4xl bg-[#fff8fd] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Төрөл
            </p>
            <p className="mt-2 text-2xl font-black uppercase italic tracking-tight text-[#1a0b3b]">
              {propertyLabel}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SummaryTile
              icon={MapPin}
              label="Байршил"
              value={formData.district || "Сонгоогүй"}
            />
            <SummaryTile
              icon={LayoutGrid}
              label="Өрөө"
              value={formData.rooms || "-"}
            />
            <SummaryTile
              icon={DollarSign}
              label="Үнэ"
              value={
                formData.price
                  ? `${Number(formData.price).toLocaleString()}₮`
                  : "-"
              }
            />
            <SummaryTile
              icon={Ruler}
              label="Талбай"
              value={formData.sqm ? `${formData.sqm}м²` : "-"}
            />
          </div>
          <div className="rounded-[1.75rem] bg-[#f8f6ff] px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
              Нийтлэх хэлбэр
            </p>
            <p className="mt-2 text-sm font-black text-[#1a0b3b]">
              {selectedAgentName}
            </p>
          </div>
          {pricePerSqm && (
            <div className="rounded-[1.75rem] bg-[#f8f6ff] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
                Нэг м² үнэ
              </p>
              <p className="mt-2 text-xl font-black tracking-tight text-[#1a0b3b]">
                {pricePerSqm}₮
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="rounded-[2.5rem] border border-[#f8e4f4] bg-[#fff8fd] p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff3bad]">
          Checklist
        </p>
        <div className="mt-5 space-y-3">
          <ChecklistRow
            done={Boolean(formData.propertyType)}
            label="Төрөл сонгосон"
          />
          <ChecklistRow
            done={Boolean(formData.price && formData.sqm)}
            label="Үнэ ба талбай оруулсан"
          />
          <ChecklistRow
            done={Boolean(formData.location && formData.district)}
            label="Байршлаа тодорхойлсон"
          />
          <ChecklistRow
            done={Boolean(formData.floor && formData.totalFloors)}
            label="Давхарын мэдээлэл оруулсан"
          />
          <ChecklistRow
            done={Boolean(formData.description.trim())}
            label="Тайлбараа бичсэн"
          />
        </div>
      </Card>
    </aside>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-[#f8f6ff] p-4">
      <Icon className="h-5 w-5 text-[#2a00ff]" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[#1a0b3b]">{value}</p>
    </div>
  );
}

function ChecklistRow({ done, label }: { done: boolean; label: string }) {
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
