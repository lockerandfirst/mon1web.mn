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

const tabs: { id: AgentPortalTab; label: string; icon: typeof LayoutGrid }[] = [
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
    <aside className="hidden shrink-0 flex-col gap-2 border-b border-[#2a00ff]/10 bg-white/90 p-4 backdrop-blur-md md:flex md:w-64 md:border-b-0 md:border-r md:py-8">
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
                ? "bg-[#2a00ff] text-white shadow-lg shadow-[#2a00ff]/30 ring-2 ring-[#2a00ff]/20"
                : "border-1 border-[#2a00ff]/25 bg-white text-[#2a00ff] hover:border-[#2a00ff]/45 hover:bg-[#f8f6ff]",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0",
                active === id ? "text-white" : "text-[#2a00ff]",
              )}
            />
            <span className="leading-tight">{label}</span>
          </button>
        ))}
      </nav>
      <div className="hidden flex-1 md:block" aria-hidden />
      <SignOutButton redirectUrl="/agent-portal">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-3xl border border-[#2a00ff]/20 bg-white px-4 py-3 text-sm font-black text-[#2a00ff] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:mt-0"
        >
          <LogOut className="h-5 w-5" />
          Гарах
        </button>
      </SignOutButton>
    </aside>
  );
}
