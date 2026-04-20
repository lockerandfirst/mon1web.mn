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
    <div className="min-h-screen bg-[#fff9fd]">
      <div className="container mx-auto mt-18 px-4 py-8 pb-28 md:pb-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-[#2a00ff] uppercase italic">
              Хянах самбар
            </h1>
            <p className="text-sm font-bold text-[#ff3bad]">
              Тавтай морил, {currentAgent.name}
            </p>
          </div>
        </div>

        <Tabs defaultValue="listings" className="space-y-8">
          <TabsList className="h-auto w-full justify-start rounded-2xl border border-[#eeebff] bg-white p-1.5 shadow-sm">
            <TabsTrigger
              value="listings"
              className="gap-2 rounded-xl px-4 py-2 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] transition-all data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white"
            >
              <Home className="h-4 w-4" /> Миний зарууд
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="gap-2 rounded-xl px-4 py-2 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] transition-all data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white"
            >
              <Bookmark className="h-4 w-4" /> Хадгалсан
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl shadow-[#2a00ff]/5">
              <CardHeader className="border-b border-[#fff1f9] p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <CardTitle className="text-lg font-black uppercase italic text-[#2a00ff] md:text-xl">
                    Нийтлэгдсэн
                  </CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3bad]" />
                    <Input
                      placeholder="Хайх..."
                      className="h-11 rounded-xl border-none bg-slate-50 pl-12 font-bold md:h-12"
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

          <TabsContent value="favorites">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
