"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast, Toaster } from "sonner";
import { ApartmentCard } from "@/components/apartment-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, Bookmark, MessagesSquare } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { DashboardPanelSkeleton } from "@/components/dashboard/dashboard-panel-skeleton";
import { ListingTable } from "@/components/dashboard/ListingsTable";
import { apiFetch } from "@/lib/backend-api";
import { BuyRequestFeed } from "@/components/portal/BuyRequestFeed";
import { useAgentPortalData } from "@/components/portal/use-agent-portal-data";

const DASHBOARD_TAB_STORAGE_KEY = "mon1:dashboard-active-tab-v1";

type DashboardTab = "listings" | "favorites" | "requests";

function readStoredDashboardTab(): DashboardTab {
  if (typeof window === "undefined") {
    return "listings";
  }
  const saved = window.localStorage.getItem(DASHBOARD_TAB_STORAGE_KEY);
  if (
    saved === "listings" ||
    saved === "favorites" ||
    saved === "requests"
  ) {
    return saved;
  }
  return "listings";
}

export function DashboardPanel() {
  const router = useRouter();
  const { getToken } = useAuth();
  const {
    currentAgent,
    searchQuery,
    setSearchQuery,
    filteredListings,
    favoriteApartments,
    refreshListings,
    isLoading,
  } = useDashboard();
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null,
  );
  const {
    buyRequestsSeekingAgent,
    agentPickListings,
    connectedAgent,
    refresh: refreshAgentPortalData,
    portalInitialLoading,
  } = useAgentPortalData({ mergeMyBuyRequests: true });

  const [activeTab, setActiveTab] = useState<DashboardTab>("listings");
  const [tabHydrated, setTabHydrated] = useState(false);

  useLayoutEffect(() => {
    setActiveTab(readStoredDashboardTab());
    setTabHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !tabHydrated) {
      return;
    }
    window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, activeTab);
  }, [activeTab, tabHydrated]);

  const handleDeleteListing = async (id: string) => {
    if (
      !window.confirm(
        "Энэ зарыг устгах уу? Үйлдлийг буцаах боломжгүй.",
      )
    ) {
      return;
    }
    setDeletingListingId(id);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Нэвтэрсэн байх шаардлагатай.");
        return;
      }
      await apiFetch<{ success: boolean; data: { id: string } }>(
        `/api/listings/${encodeURIComponent(id)}`,
        { method: "DELETE", token },
      );
      toast.success("Зар устгагдлаа.");
      await refreshListings();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Устгахад алдаа гарлаа.";
      toast.error(message);
    } finally {
      setDeletingListingId(null);
    }
  };

  if (isLoading) {
    return <DashboardPanelSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto mt-16 px-3 py-5 pb-24 md:mt-18 md:px-4 md:py-8 md:pb-10">
        <div className="mb-5 flex flex-col justify-between gap-3 md:mb-8 md:gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-[1000] tracking-tighter text-[#2a00ff] uppercase italic md:text-3xl">
              Хянах самбар
            </h1>
            <p className="text-xs font-bold text-[#ff3bad] md:text-sm">
              Тавтай морил, {currentAgent.name}
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            if (v === "listings" || v === "favorites" || v === "requests") {
              setActiveTab(v);
            }
          }}
          className="space-y-3 md:space-y-6"
        >
          <TabsList className="inline-flex h-auto w-fit justify-start rounded-xl border border-[#2a00ff]/12 bg-white p-1 shadow-sm md:rounded-2xl md:p-1.5">
            <TabsTrigger
              value="listings"
              className="flex-none gap-1.5 rounded-lg px-3 py-2 font-black text-[9px] uppercase tracking-wide text-[#2a00ff]/70 transition-all data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white md:gap-2 md:rounded-xl md:px-4 md:py-2 md:text-[10px] md:tracking-widest"
            >
              <Home className="h-3.5 w-3.5 md:h-4 md:w-4" /> Миний зарууд
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex-none gap-1.5 rounded-lg px-3 py-2 font-black text-[9px] uppercase tracking-wide text-[#2a00ff]/70 transition-all data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white md:gap-2 md:rounded-xl md:px-4 md:py-2 md:text-[10px] md:tracking-widest"
            >
              <Bookmark className="h-3.5 w-3.5 md:h-4 md:w-4" /> Хадгалсан
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex-none gap-1.5 rounded-lg px-3 py-2 font-black text-[9px] uppercase tracking-wide text-[#2a00ff]/70 transition-all data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white md:gap-2 md:rounded-xl md:px-4 md:py-2 md:text-[10px] md:tracking-widest"
            >
              <MessagesSquare className="h-3.5 w-3.5 md:h-4 md:w-4" /> Хүсэлтүүд
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-2 md:mt-3">
            <Card className="overflow-hidden rounded-3xl border border-[#2a00ff]/10 bg-white shadow-xl shadow-[#2a00ff]/8 md:rounded-[2.5rem] md:shadow-2xl">
              <CardHeader className="p-3 max-md:pb-2 md:border-b md:border-[#2a00ff]/10 md:p-5">
                <div className="flex flex-col justify-between gap-2 md:gap-4 md:flex-row md:items-center">
                  <CardTitle className="text-base font-black uppercase italic text-[#2a00ff] md:text-xl">
                    Нийтлэгдсэн
                  </CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2a00ff] md:left-4 md:h-4 md:w-4" />
                    <Input
                      placeholder="Хайх..."
                      className="h-10 rounded-xl border border-[#2a00ff]/10 bg-[#2a00ff]/6 pl-9 text-sm font-bold text-[#2a00ff] placeholder:text-[#2a00ff]/40 focus-visible:border-[#2a00ff]/25 focus-visible:ring-[#2a00ff]/15 md:h-12 md:pl-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ListingTable
                  listings={filteredListings}
                  onView={(id) => router.push(`/apartment/${id}`)}
                  onEdit={(id) =>
                    router.push(
                      `/edit-listing/${encodeURIComponent(id)}`,
                    )
                  }
                  onDelete={handleDeleteListing}
                  deletingId={deletingListingId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-2 md:mt-3">
            {favoriteApartments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#eeebff] bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">
                Хадгалсан зар алга.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {favoriteApartments.map((apt, index) => (
                  <ApartmentCard
                    key={apt.id}
                    apartment={apt}
                    index={index}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-2 md:mt-3">
            <BuyRequestFeed
              requests={buyRequestsSeekingAgent}
              agentPickListings={agentPickListings}
              connectedAgentId={connectedAgent?.id ?? null}
              connectedAgentAvatar={connectedAgent?.avatar ?? ""}
              connectedAgentName={connectedAgent?.name ?? ""}
              onRefresh={refreshAgentPortalData}
              initialDataLoading={portalInitialLoading}
              hideAgentRecommendActions
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
