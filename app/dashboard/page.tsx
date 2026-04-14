"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ApartmentCard } from "@/components/apartment-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Home,
  Bell,
  Search,
  Bookmark,
  UserCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
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
    userRequests,
    buyerRequests,
    favoriteApartments,
    totalIncoming,
    getBuyRequestBudgetLabel,
    actions,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-[#fff9fd]">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
          <div className="flex items-center gap-3">
            <Link href="/add-property">
              <Button className="h-14 bg-[#2a00ff] hover:bg-[#ff3bad] text-white rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#2a00ff]/20">
                <Plus className="h-5 w-5 mr-2" /> Шинэ зар нэмэх
              </Button>
            </Link>
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
              value="user-posts"
              className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white gap-2 transition-all"
            >
              <UserCircle className="h-4 w-4" /> Ирсэн хүсэлтүүд
              {totalIncoming > 0 && (
                <Badge className="ml-1 bg-[#ff3bad] text-white">
                  {totalIncoming}
                </Badge>
              )}
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
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. INCOMING REQUESTS (USER & BUYER) */}
          <TabsContent value="user-posts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyerRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden bg-[#f8f6ff]">
                    <img
                      src={request.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                    <Badge className="absolute top-4 left-4 bg-[#2a00ff] text-white uppercase text-[10px] font-black">
                      АВНА ХҮСЭЛТ
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-black text-[#1a0b3b] uppercase italic text-lg leading-none">
                      {request.title}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#ff3bad] uppercase font-black text-[9px]">
                          Төсөв:
                        </span>
                        <span className="font-black text-[#2a00ff]">
                          {getBuyRequestBudgetLabel(request)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ff3bad] uppercase font-black text-[9px]">
                          Дүүрэг:
                        </span>
                        <span className="font-black">{request.district}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full h-12 bg-[#2a00ff] hover:bg-[#ff3bad] text-white rounded-xl font-black uppercase text-[10px]"
                      onClick={() => actions.handleClaimBuyRequest(request.id)}
                    >
                      Хариуцаж авах
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {userRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={request.images[0]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                    <Badge className="absolute top-4 left-4 bg-white text-[#2a00ff] uppercase text-[10px] font-black">
                      ШИНЭ ХҮСЭЛТ
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-black text-[#1a0b3b] uppercase italic text-lg leading-none">
                      {request.title}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#ff3bad] uppercase font-black text-[9px]">
                          Үнэ:
                        </span>
                        <span className="font-black text-[#2a00ff]">
                          {formatPrice(request.price)}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full h-12 bg-slate-900 hover:bg-[#2a00ff] text-white rounded-xl font-black uppercase text-[10px]"
                      onClick={() => actions.handleClaimListing(request.id)}
                    >
                      Нийтлэх
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 3. FAVORITES */}
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
