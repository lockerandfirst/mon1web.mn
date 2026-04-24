"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Megaphone,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { BuyRequestFeed } from "@/components/portal/BuyRequestFeed";
import { PortalSidebarNav } from "@/components/portal/portal-sidebar-nav";
import { PortalListingsPanel } from "@/components/portal/portal-listings-panel";
import { PortalProfilePanel } from "@/components/portal/portal-profile-panel";
import { SaleRequestFeed } from "@/components/portal/SaleRequestFeed";
import type { AgentPortalTab } from "@/components/portal/portal-types";
import { useAgentPortalData } from "@/components/portal/use-agent-portal-data";
import { AgentPortalDashboardSkeleton } from "@/components/portal/agent-portal-page-skeleton";
import { AgentPortalTabBodySkeleton } from "@/components/portal/agent-portal-tab-skeleton";
import { cn } from "@/lib/utils";

const titles: Record<AgentPortalTab, { title: string; subtitle: string }> = {
  listings: {
    title: "Миний зарууд",
    subtitle: "Таны худалдаалах хүсэлтэй байгаа зарууд",
  },
  saleRequests: {
    title: "Агент хайж буй зарууд",
    subtitle: "Агентаар заруулах хүсэлтэй байгаа хүмүүсийн зар.",
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

const AGENT_PORTAL_TAB_STORAGE_KEY = "agent-portal-active-tab-v1";

function readStoredTab(): AgentPortalTab {
  if (typeof window === "undefined") {
    return "saleRequests";
  }
  const saved = window.localStorage.getItem(AGENT_PORTAL_TAB_STORAGE_KEY);
  if (
    saved === "listings" ||
    saved === "saleRequests" ||
    saved === "buyRequests" ||
    saved === "profile"
  ) {
    return saved;
  }
  return "saleRequests";
}

export function AgentPortalDashboard() {
  const [tab, setTab] = useState<AgentPortalTab>("saleRequests");
  const [tabHydrated, setTabHydrated] = useState(false);
  const {
    claimedSaleListings,
    buyRequestsSeekingAgent,
    agentPickListings,
    connectedAgent,
    userLoaded,
    refresh,
    portalInitialLoading,
  } = useAgentPortalData();

  useLayoutEffect(() => {
    setTab(readStoredTab());
    setTabHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !tabHydrated) {
      return;
    }
    window.localStorage.setItem(AGENT_PORTAL_TAB_STORAGE_KEY, tab);
  }, [tab, tabHydrated]);

  if (!userLoaded) {
    return <AgentPortalDashboardSkeleton activeTab={tab} />;
  }

  const { title, subtitle } = titles[tab];

  const mobileTabs: {
    id: AgentPortalTab;
    label: string;
    icon: typeof Megaphone;
  }[] = [
    { id: "listings", label: "Миний зар", icon: LayoutDashboard },
    { id: "saleRequests", label: "Зарна", icon: Megaphone },
    { id: "buyRequests", label: "Авна", icon: ShoppingBag },
    { id: "profile", label: "Профайл", icon: UserRound },
  ];

  return (
    <div className="mt-18 flex min-h-[calc(100vh-5rem)] flex-1 flex-col overflow-x-hidden md:flex-row">
      <PortalSidebarNav active={tab} onSelect={setTab} />
      <section className="flex min-h-0 flex-1 flex-col bg-linear-to-b from-[#f7f4ff] to-[#f3f2ff]">
        <header className="border-b border-[#2a00ff]/10 bg-white/85 px-4 py-6 backdrop-blur-md md:px-10 md:py-8">
          <div className="mb-3 flex items-center justify-end md:hidden">
            <Link
              href="/home"
              className="inline-flex items-center rounded-full border border-[#2a00ff]/15 bg-[#2a00ff]/6 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#2a00ff] transition-colors hover:bg-[#2a00ff]/10"
            >
              Гарах
            </Link>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#2a00ff] md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-semibold text-[#2a00ff]/70">
            {subtitle}
          </p>
        </header>
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-10 md:pb-10">
          {portalInitialLoading ? (
            <AgentPortalTabBodySkeleton tab={tab} />
          ) : (
            <>
              <div className={tab === "listings" ? "block" : "hidden"}>
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="min-w-0 rounded-4xl"
                >
                  <PortalListingsPanel
                    claimedSaleListings={claimedSaleListings}
                  />
                </motion.div>
              </div>
              <div className={tab === "saleRequests" ? "block" : "hidden"}>
                <SaleRequestFeed
                  connectedAgent={connectedAgent}
                  onRefresh={refresh}
                />
              </div>
              <div className={tab === "buyRequests" ? "block" : "hidden"}>
                <BuyRequestFeed
                  requests={buyRequestsSeekingAgent}
                  agentPickListings={agentPickListings}
                  connectedAgentId={connectedAgent?.id ?? null}
                  connectedAgentAvatar={connectedAgent?.avatar ?? ""}
                  connectedAgentName={connectedAgent?.name ?? ""}
                  onRefresh={refresh}
                />
              </div>
              <div className={tab === "profile" ? "block" : "hidden"}>
                <PortalProfilePanel />
              </div>
            </>
          )}
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2a00ff]/12 bg-white/95 px-3 py-2 backdrop-blur md:hidden">
          <ul className="grid grid-cols-4 gap-1.5">
            {mobileTabs.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex h-13 w-full flex-col items-center justify-center rounded-4xl border px-0.5 text-[9px] font-black uppercase tracking-wide transition ${
                    tab === id
                      ? "border-[#2a00ff] bg-[#2a00ff] text-white shadow-[0_14px_30px_-16px_rgba(42,0,255,0.8)]"
                      : " bg-white text-[#2a00ff] active:scale-[0.98]"
                  }`}
                >
                  <Icon
                    className={cn(
                      "mb-0.5 h-3.5 w-3.5",
                      tab === id ? "text-white" : "text-[#2a00ff]",
                    )}
                  />
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
