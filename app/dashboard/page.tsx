"use client";

import { useRouter } from "next/navigation";
import { ApartmentCard } from "@/components/apartment-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, Search, Bookmark } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/use-dashboard";
import { ListingTable } from "@/components/dashboard/ListingsTable";

// NEW IMPORTS

export default function DashboardPage() {
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
      <main className="container mx-auto px-4 py-8 mt-18">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-[#2a00ff] uppercase italic">
              Хянах самбар
            </h1>
            <p className="text-[#ff3bad] font-bold">
              Тавтай морил, {currentAgent.name}
            </p>
          </div>
        </div>

        <Tabs defaultValue="listings" className="space-y-8">
          <TabsList className="bg-white border border-[#eeebff] p-1.5 rounded-2xl h-16 shadow-sm">
            <TabsTrigger
              value="listings"
              className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white gap-2 transition-all"
            >
              <Home className="h-4 w-4" /> Миний зарууд
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white gap-2 transition-all"
            >
              <Bookmark className="h-4 w-4" /> Хадгалсан
            </TabsTrigger>
          </TabsList>

          {/* 1. MY LISTINGS */}
          <TabsContent value="listings">
            <Card className="border-none shadow-2xl shadow-[#2a00ff]/5 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-[#fff1f9]">
                <div className="flex justify-between items-center gap-4">
                  <CardTitle className="text-xl font-black uppercase italic text-[#2a00ff]">
                    Нийтлэгдсэн
                  </CardTitle>
                  <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ff3bad]" />
                    <Input
                      placeholder="Хайх..."
                      className="pl-12 bg-slate-50 border-none rounded-xl h-12 font-bold"
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

          {/* 2. FAVORITES */}
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
      </main>
    </div>
  );
}
