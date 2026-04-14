import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Sparkles, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { AGENT_OPTIONS } from "./constants";
import type { ServiceType } from "./types";

export function ServicePicker({
  serviceType,
  selectedAgentId,
  onServiceChange,
  onAgentSelect,
}: {
  serviceType: ServiceType;
  selectedAgentId: string | null;
  onServiceChange: (value: ServiceType) => void;
  onAgentSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ServiceCard
          active={serviceType === "self"}
          icon={User}
          title="Би өөрөө зарна"
          description="Зараа шууд илгээж, системд хадгална."
          onClick={() => onServiceChange("self")}
        />
        <ServiceCard
          active={serviceType === "agent"}
          icon={Users}
          title="Агентаар заруулна"
          description="Баталгаажсан агенттай холбож нийтэлнэ."
          onClick={() => onServiceChange("agent")}
          premium
        />
      </div>

      {serviceType === "agent" && (
        <div className="space-y-4">
          <Label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Агент сонгох
          </Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {AGENT_OPTIONS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => onAgentSelect(agent.id)}
                className={cn(
                  "rounded-[2rem] border-2 p-5 text-left transition-all",
                  selectedAgentId === agent.id
                    ? "border-[#2a00ff] bg-[#eef0ff] shadow-lg shadow-[#2a00ff]/10"
                    : "border-[#f0e8ff] bg-white",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-[#1a0b3b]">
                    {agent.name}
                  </p>
                  {selectedAgentId === agent.id && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff2bad] text-white">
                      <Sparkles className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff3bad]">
                  {agent.company}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#6d4d84]">
                  {agent.listingsCount} listing • {agent.rating.toFixed(1)} rating
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  active,
  icon: Icon,
  title,
  description,
  onClick,
  premium,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  premium?: boolean;
}) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-[3rem] border-4 p-8 text-center transition-all duration-500",
        active
          ? "border-[#2a00ff] bg-[#eef0ff] shadow-xl shadow-[#2a00ff]/10"
          : "border-[#eeebff] bg-white hover:border-[#ff9ce0]/30",
      )}
    >
      {active && (
        <motion.span
          layoutId="service-type-badge"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#ff2bad] text-white shadow-[0_12px_30px_-12px_rgba(255,43,173,0.95)]"
        >
          <Sparkles className="h-4 w-4 fill-current" />
        </motion.span>
      )}
      <div
        className={cn(
          "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] transition-all",
          active
            ? "scale-110 bg-[#2a00ff] text-white"
            : "bg-[#fff9fd] text-[#ff9ce0]",
        )}
      >
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mb-2 text-xl font-black uppercase italic tracking-tight text-[#1a0b3b]">
        {title}
      </h3>
      <p className="text-xs font-bold leading-5 text-[#ff9ce0]">{description}</p>
      {premium && (
        <Badge className="mt-4 rounded-full bg-[#1a0b3b] px-4 py-1 text-[9px] font-black uppercase italic text-[#ff9ce0]">
          Recommended
        </Badge>
      )}
    </Card>
  );
}
