"use client";

import { SignOutButton } from "@clerk/nextjs";
import {
  LayoutGrid,
  Megaphone,
  ShoppingBag,
  UserRound,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { AgentPortalTab } from "@/components/portal/portal-types";

const tabs: { id: AgentPortalTab; label: string; icon: typeof LayoutGrid }[] =
  [
    { id: "listings", label: "Миний зарууд", icon: LayoutGrid },
    {
      id: "saleRequests",
      label: "Агент хайж буй зарууд",
      icon: Megaphone,
    },
    {
      id: "buyRequests",
      label: "Худалдан авах хүсэлтүүд",
      icon: ShoppingBag,
    },
    { id: "profile", label: "Миний мэдээлэл", icon: UserRound },
  ];

export function PortalSidebarNav({
  active,
  onSelect,
}: {
  active: AgentPortalTab;
  onSelect: (tab: AgentPortalTab) => void;
}) {
  return (
    <aside className="hidden shrink-0 flex-col gap-2 border-b border-slate-100 bg-white/90 p-4 backdrop-blur-md md:flex md:w-64 md:border-b-0 md:border-r md:py-8">
      <p className="hidden px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3bad] md:block">
        Самбар
      </p>
      <nav className="flex flex-row gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "flex min-w-38 shrink-0 items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-black transition-all md:min-w-0 md:w-full",
              active === id
                ? "bg-[#2a00ff] text-white shadow-lg shadow-[#2a00ff]/25"
                : "bg-slate-50 text-[#1a0b3b] hover:bg-[#eef0ff] hover:text-[#2a00ff]",
            )}
          >
            <Icon className="h-5 w-5 shrink-0 opacity-90" />
            <span className="leading-tight">{label}</span>
          </button>
        ))}
      </nav>
      <div className="hidden flex-1 md:block" aria-hidden />
      <SignOutButton redirectUrl="/agent-portal">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:mt-0"
        >
          <LogOut className="h-5 w-5" />
          Гарах
        </button>
      </SignOutButton>
    </aside>
  );
}
