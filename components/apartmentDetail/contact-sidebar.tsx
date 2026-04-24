"use client";
import { useState } from "react";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
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
            <p className="text-sm font-black text-slate-900 md:text-base">
              {apt.sqm} м²
            </p>
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
        <Link
          href={`/agents/${apt.agent.id}`}
          className="block group perspective-1000"
          style={{ textDecoration: "none" }}
        >
          <div className="relative flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(42,0,255,0.04)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-[#2a00ff]/30 group-hover:shadow-[0_20px_40px_rgb(42,0,255,0.08)] md:gap-6 md:rounded-[2.5rem] md:p-5">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl md:h-20 md:w-20">
                <SafeImage
                  src={apt.agent.avatar}
                  variant="avatar"
                  alt={apt.agent.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Subtle Gradient Overlay on Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Verified Badge - Now more prominent */}
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2a00ff] text-white shadow-lg ring-4 ring-white md:h-8 md:w-8">
                <ShieldCheck className="h-4 w-4 md:h-5 md:h-5" />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="truncate text-lg font-black tracking-tight text-[#1a0b3b] group-hover:text-[#2a00ff] md:text-xl">
                  {apt.agent.name}
                </h4>
                <span className="inline-flex items-center rounded-full bg-[#ffebfa] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ff3bad]">
                  <span className="mr-1 h-1 w-1 rounded-full bg-[#ff3bad]" />
                  Verified
                </span>
              </div>

              <p className="mt-1 truncate text-sm font-bold text-slate-500">
                {apt.agent.company || "Бие даасан агент"}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#2a00ff] md:hidden">
                  Үзэх →
                </span>
              </div>
            </div>

            {/* Desktop Action Button */}
            <div className="hidden shrink-0 md:block">
              <div className="flex h-12 items-center justify-center rounded-2xl bg-[#2a00ff] px-6 text-sm font-black text-white transition-all duration-200 group-hover:bg-[#ff3bad] group-hover:shadow-lg group-hover:shadow-[#ff3bad]/25">
                Профайл
              </div>
            </div>
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
