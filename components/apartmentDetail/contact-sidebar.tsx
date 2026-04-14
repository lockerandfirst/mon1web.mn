"use client";
import { useState } from "react";
import { Phone, Mail, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, type Apartment } from "@/lib/data";
import Link from "next/link";

export function ContactSidebar({ apt }: { apt: Apartment }) {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="sticky top-28 space-y-6">
      <div className="rounded-[3.5rem] border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-500/10">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">
          Нийт үнэ
        </p>
        <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">
          {formatPrice(apt.price)}
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-[9px] font-black text-slate-400 uppercase">
              м² Үнэ
            </span>
            <p className="font-black text-slate-900">
              {formatPrice(apt.pricePerSqm)}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-[9px] font-black text-slate-400 uppercase">
              Талбай
            </span>
            <p className="font-black text-slate-900">{apt.sqm} м²</p>
          </div>
        </div>

        <Button
          onClick={() => setShowPhone(!showPhone)}
          className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20"
        >
          <Phone className="mr-3 h-5 w-5" />
          {showPhone ? apt.agent.phone : "Холбоо барих"}
        </Button>
      </div>

      <Link href={`/agents/${apt.agent.id}`} className="block group">
        <div className="flex items-center gap-4 p-5 rounded-[2.5rem] border bg-white group-hover:shadow-lg transition-all">
          <img
            src={apt.agent.avatar}
            className="w-14 h-14 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-black text-slate-900 leading-none">
              {apt.agent.name}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">
              {apt.agent.company}
            </p>
          </div>
          <ShieldCheck className="h-8 w-8 text-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    </div>
  );
}
