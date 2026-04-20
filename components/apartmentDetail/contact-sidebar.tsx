"use client";
import { useState } from "react";
import { Phone, Mail, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, type Apartment } from "@/lib/data";
import Link from "next/link";

export function ContactSidebar({ apt }: { apt: Apartment }) {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="space-y-4 md:sticky md:top-28 md:space-y-6">
      <div className="rounded-4xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-500/10 md:rounded-[3.5rem] md:p-8 md:shadow-2xl">
        <p className="mb-1 text-[9px] font-black uppercase tracking-wide text-blue-600 md:mb-2 md:text-[10px] md:tracking-widest">
          Нийт үнэ
        </p>
        <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:mb-6 md:text-5xl md:tracking-tighter">
          {formatPrice(apt.price)}
        </h2>

        <div className="mb-4 grid grid-cols-2 gap-2 md:mb-8 md:gap-3">
          <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
            <span className="text-[8px] font-black uppercase text-slate-400 md:text-[9px]">
              м² Үнэ
            </span>
            <p className="text-sm font-black text-slate-900 md:text-base">
              {formatPrice(apt.pricePerSqm)}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
            <span className="text-[8px] font-black uppercase text-slate-400 md:text-[9px]">
              Талбай
            </span>
            <p className="text-sm font-black text-slate-900 md:text-base">{apt.sqm} м²</p>
          </div>
        </div>

        <Button
          onClick={() => setShowPhone(!showPhone)}
          className="h-12 w-full rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 md:h-16 md:text-lg md:shadow-xl"
        >
          <Phone className="mr-2 h-4 w-4 md:mr-3 md:h-5 md:w-5" />
          {showPhone ? apt.agent.phone : "Холбоо барих"}
        </Button>
      </div>

      <Link href={`/agents/${apt.agent.id}`} className="block group">
        <div className="flex items-center gap-3 rounded-4xl border bg-white p-3 transition-all group-hover:shadow-lg md:gap-4 md:rounded-[2.5rem] md:p-5">
          <img
            src={apt.agent.avatar}
            className="h-12 w-12 rounded-2xl object-cover md:h-14 md:w-14"
          />
          <div className="flex-1">
            <h4 className="text-sm font-black leading-none text-slate-900 md:text-base">
              {apt.agent.name}
            </h4>
            <p className="mt-1 text-[9px] font-bold uppercase italic text-slate-400 md:text-[10px]">
              {apt.agent.company}
            </p>
          </div>
          <ShieldCheck className="h-6 w-6 text-blue-600 opacity-20 transition-opacity group-hover:opacity-100 md:h-8 md:w-8" />
        </div>
      </Link>
    </div>
  );
}
