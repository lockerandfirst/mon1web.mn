"use client";

import { useState } from "react";
import { Megaphone, ShoppingBag, UserRound } from "lucide-react";

import { BuyRequestFeed } from "@/components/portal/BuyRequestFeed";
import { PortalSidebarNav } from "@/components/portal/portal-sidebar-nav";
import { PortalListingsPanel } from "@/components/portal/portal-listings-panel";
import { PortalProfilePanel } from "@/components/portal/portal-profile-panel";
import { SaleRequestFeed } from "@/components/portal/SaleRequestFeed";
import type { AgentPortalTab } from "@/components/portal/portal-types";
import { useAgentPortalData } from "@/components/portal/use-agent-portal-data";

const titles: Record<AgentPortalTab, { title: string; subtitle: string }> = {
  listings: {
    title: "Миний зарууд",
    subtitle: "Таны оруулсан болон хариуцсан зарууд.",
  },
  saleRequests: {
    title: "Агент хайж буй зарууд",
    subtitle:
      "Зар оруулагч «Агентаар заруулах» гэж сонгосон зарууд — эзэнтэй холбогдож, зарлах эрх авах.",
  },
  buyRequests: {
    title: "Худалдан авах хүсэлтүүд",
    subtitle:
      "Байр худалдан авахыг хүсэгчдийн хүсэлт — өөрийн заруудаас тохирохыг санал болгоно.",
  },
  profile: {
    title: "Миний мэдээлэл",
    subtitle: "Профайл болон бүртгэлийн тохиргоо.",
  },
};

export function AgentPortalDashboard() {
  const [tab, setTab] = useState<AgentPortalTab>("saleRequests");
  const {
    marketplace,
    catalog,
    buyRequestsSeekingAgent,
    saleFeedListings,
    agentPickListings,
    connectedAgent,
    userLoaded,
    mounted,
    refresh,
  } = useAgentPortalData();

  if (!userLoaded || !mounted) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  const { title, subtitle } = titles[tab];

  const mobileTabs: {
    id: AgentPortalTab;
    label: string;
    icon: typeof Megaphone;
  }[] = [
    { id: "saleRequests", label: "Зарна", icon: Megaphone },
    { id: "buyRequests", label: "Авна", icon: ShoppingBag },
    { id: "profile", label: "Профайл", icon: UserRound },
  ];

  return (
    <div className="mt-18 flex min-h-[calc(100vh-5rem)] flex-1 flex-col overflow-x-hidden md:flex-row">
      <PortalSidebarNav active={tab} onSelect={setTab} />
      <section className="flex min-h-0 flex-1 flex-col bg-[#fafafa]">
        <header className="border-b border-slate-100 bg-white/80 px-4 py-6 backdrop-blur-md md:px-10 md:py-8">
          <h1 className="text-2xl font-black tracking-tight text-[#1a0b3b] md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-500">
            {subtitle}
          </p>
        </header>
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-10 md:pb-10">
          {tab === "listings" && (
            <PortalListingsPanel marketplace={marketplace} catalog={catalog} />
          )}
          {tab === "saleRequests" && (
            <SaleRequestFeed
              listings={saleFeedListings}
              connectedAgent={connectedAgent}
              onRefresh={refresh}
            />
          )}
          {tab === "buyRequests" && (
            <BuyRequestFeed
              requests={buyRequestsSeekingAgent}
              agentPickListings={agentPickListings}
              connectedAgentId={connectedAgent?.id ?? null}
              onRefresh={refresh}
            />
          )}
          {tab === "profile" && <PortalProfilePanel />}
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2 backdrop-blur md:hidden">
          <ul className="grid grid-cols-3 gap-2">
            {mobileTabs.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex h-14 w-full flex-col items-center justify-center rounded-3xl text-[10px] font-black uppercase tracking-wider transition ${
                    tab === id
                      ? "bg-[#2a00ff] text-white shadow-lg shadow-[#2a00ff]/30"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="mb-1 h-4 w-4" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </div>
  );
}
