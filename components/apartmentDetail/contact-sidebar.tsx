"use client";
import { useState } from "react";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, type Apartment } from "@/lib/data";
import type { OwnerContact } from "@/lib/portal/apartment-from-api-listing";
import Link from "next/link";

export function ContactSidebar({
  apt,
  contactUsesAgent,
  ownerContact,
}: {
  apt: Apartment;
  /** `listings.agent_id` тохируулсан эсэх — үнэн бол агентын профайл. */
  contactUsesAgent: boolean;
  /** `submitted_by` — зөвхөн `contactUsesAgent === false` */
  ownerContact: OwnerContact | null;
}) {
  const [showPhone, setShowPhone] = useState(false);

  const owner = ownerContact;
  const displayPhone = contactUsesAgent
    ? apt.agent.phone
    : (owner?.phone ?? apt.agent.phone) || "Утас бүртгэгдээгүй";
  const displayEmail = contactUsesAgent
    ? apt.agent.email
    : (owner?.email ?? apt.agent.email);
  const displayName = contactUsesAgent
    ? apt.agent.name
    : (owner?.name ?? apt.agent.name);

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
          {showPhone ? displayPhone : "Холбоо барих"}
        </Button>

        {!contactUsesAgent && displayEmail.trim().length > 0 ? (
          <a
            href={`mailto:${encodeURIComponent(displayEmail)}`}
            className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 underline-offset-2 hover:underline md:mt-4 md:text-sm"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {displayEmail}
          </a>
        ) : null}
      </div>

      {contactUsesAgent && apt.agent.id && apt.agent.id !== "owner-contact" ? (
        <Link href={`/agents/${apt.agent.id}`} className="block group">
          <div className="flex items-center gap-3 rounded-4xl border bg-white p-3 transition-all group-hover:shadow-lg md:gap-4 md:rounded-[2.5rem] md:p-5">
            <img
              src={apt.agent.avatar || "https://placehold.co/96x96/e2e8f0/64748b?text=A"}
              alt=""
              className="h-12 w-12 rounded-2xl object-cover md:h-14 md:w-14"
            />
            <div className="flex-1">
              <h4 className="text-sm font-black leading-none text-slate-900 md:text-base">
                {apt.agent.name}
              </h4>
              <p className="mt-1 text-[9px] font-bold uppercase italic text-slate-400 md:text-[10px]">
                {apt.agent.company || "Агент"}
              </p>
            </div>
            <ShieldCheck className="h-6 w-6 text-blue-600 opacity-20 transition-opacity group-hover:opacity-100 md:h-8 md:w-8" />
          </div>
        </Link>
      ) : (
        <div className="rounded-4xl border border-slate-100 bg-white p-4 md:rounded-[2.5rem] md:p-5">
          <p className="text-[9px] font-black uppercase tracking-wide text-slate-400 md:text-[10px]">
            Зар оруулагч
          </p>
          <h4 className="mt-1 text-sm font-black text-slate-900 md:text-base">
            {displayName}
          </h4>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Холбоо барих мэдээлэл (зарын эзэн)
          </p>
        </div>
      )}
    </div>
  );
}
