"use client";

import { useRouter } from "next/navigation";
import { ApartmentCard } from "@/components/apartment-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, Bookmark } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { ListingTable } from "@/components/dashboard/ListingsTable";

export function DashboardPanel() {
  const router = useRouter();
  const {
    currentAgent,
    searchQuery,
    setSearchQuery,
    filteredListings,
    favoriteApartments,
  } = useDashboard();

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

        <Tabs defaultValue="listings" className="space-y-3 md:space-y-6">
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
                  onEdit={(id) => router.push(`/add-property?edit=${id}`)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-2 md:mt-3">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
