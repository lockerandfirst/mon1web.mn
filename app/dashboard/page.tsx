"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ApartmentCard } from "@/components/apartment-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apartments, agents, formatPrice } from "@/lib/data";
import {
  publishMarketplaceListing,
  readMarketplaceListings,
  writeMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";
import {
  Plus,
  Home,
  Eye,
  Bell,
  Search,
  Bookmark,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const currentAgent = agents[0];

  useEffect(() => {
    setMarketplaceListings(readMarketplaceListings());
    setFavorites(["1", "3", "5"]);
  }, []);

  const agentListings = useMemo(
    () => [
      ...marketplaceListings.filter(
        (l) =>
          l.workflowStatus === "published" && l.agent.id === currentAgent.id,
      ),
      ...apartments.filter((apt) => apt.agent.id === currentAgent.id),
    ],
    [marketplaceListings, currentAgent.id],
  );

  const userRequests = marketplaceListings.filter(
    (l) => l.workflowStatus === "pending",
  );

  const favoriteApartments = apartments.filter((apt) =>
    favorites.includes(apt.id),
  );

  const filteredListings = agentListings.filter(
    (apt) =>
      apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClaimListing = (listingId: string) => {
    const nextListings = publishMarketplaceListing(
      listingId,
      currentAgent,
      marketplaceListings,
    );
    writeMarketplaceListings(nextListings);
    setMarketplaceListings(nextListings);
  };

  const openListingDetail = (listingId: string) => {
    router.push(`/apartment/${listingId}`);
  };

  return (
    <div className="min-h-screen bg-[#fff9fd]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-[#2a00ff] uppercase italic">
              Хянах самбар
            </h1>
            <p className="text-[#ff3bad] font-bold">
              Тавтай морил, {currentAgent.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-[#eeebff] text-[#2a00ff]"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/add-property">
              <Button className="gap-2 bg-[#2a00ff] hover:bg-[#ff3bad] text-white rounded-xl px-6 font-bold shadow-lg shadow-[#2a00ff]/20">
                <Plus className="h-5 w-5" />
                Шинэ зар нэмэх
              </Button>
            </Link>
          </div>
        </div>

        {/* --- TABS SYSTEM --- */}
        <Tabs defaultValue="listings" className="space-y-8">
          <TabsList className="bg-white border border-[#eeebff] p-1 rounded-2xl h-14 shadow-sm">
            <TabsTrigger
              value="listings"
              className="rounded-xl px-6 font-bold text-[#ff3bad] data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white gap-2 transition-all"
            >
              <Home className="h-4 w-4" /> Миний зарууд
            </TabsTrigger>
            <TabsTrigger
              value="user-posts"
              className="rounded-xl px-6 font-bold text-[#ff3bad] data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white gap-2 transition-all"
            >
              <UserCircle className="h-4 w-4" /> Ирсэн хүсэлтүүд
              {userRequests.length > 0 && (
                <Badge className="ml-1 bg-[#ff3bad] text-white border-none h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {userRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="rounded-xl px-6 font-bold text-[#ff3bad] data-[state=active]:bg-[#2a00ff] data-[state=active]:text-white gap-2 transition-all"
            >
              <Bookmark className="h-4 w-4" /> Хадгалсан
            </TabsTrigger>
          </TabsList>

          {/* 1. Агентын зарууд */}
          <TabsContent value="listings">
            <Card className="border-none shadow-xl shadow-[#2a00ff]/5 rounded-4xl overflow-hidden bg-white">
              <CardHeader className="border-b border-[#fff1f9] p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <CardTitle className="text-xl text-[#2a00ff] font-black uppercase italic tracking-tight">
                    Нийтлэгдсэн зарууд
                  </CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ff3bad]" />
                    <Input
                      placeholder="Хайх..."
                      className="pl-11 bg-[#fff9fd] border-none rounded-xl h-12 font-bold text-[#1a0b3b]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#fff9fd]">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                        Байршил / Нэр
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                        Үнэ
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                        Төлөв
                      </TableHead>
                      <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                        Үйлдэл
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow
                        key={listing.id}
                        onClick={() => openListingDetail(listing.id)}
                        className="group cursor-pointer border-b border-[#fff1f9] transition-colors hover:bg-[#fff9fd]"
                      >
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={listing.images[0]}
                              className="w-16 h-12 rounded-xl object-cover shadow-sm"
                              alt=""
                            />
                            <div>
                              <p className="font-black text-[#1a0b3b] uppercase italic tracking-tighter text-sm">
                                {listing.title}
                              </p>
                              <p className="text-xs text-[#ff3bad] font-bold uppercase">
                                {listing.location || listing.district}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-[#2a00ff] italic text-lg">
                          {formatPrice(listing.price)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#eeebff] text-[#2a00ff] border-none rounded-lg px-3 py-1 font-black text-[10px] tracking-widest">
                            ИДЭВХТЭЙ
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl px-4 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] hover:text-[#2a00ff] hover:bg-white hover:shadow-md"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Үзэх
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Ирсэн хүсэлтүүд */}
          <TabsContent value="user-posts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-none shadow-xl shadow-[#2a00ff]/5 rounded-4xl bg-white overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={request.images[0]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt=""
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-[#2a00ff] border-none font-black text-[10px] px-3 py-1.5 rounded-xl">
                        ШИНЭ ХҮСЭЛТ
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-black text-[#1a0b3b] uppercase italic tracking-tighter text-lg leading-none line-clamp-1">
                      {request.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#ff3bad] font-bold uppercase text-[10px]">
                          Эзэмшигч:
                        </span>
                        <span className="font-black text-[#1a0b3b] italic">
                          {request.submittedBy.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#ff3bad] font-bold uppercase text-[10px]">
                          Байршил:
                        </span>
                        <span className="font-black text-[#1a0b3b] italic">
                          {request.district}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#ff3bad] font-bold uppercase text-[10px]">
                          Үнэ:
                        </span>
                        <span className="font-black text-[#2a00ff] italic">
                          {formatPrice(request.price)}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full h-12 bg-[#1a0b3b] hover:bg-[#2a00ff] text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                      onClick={() => handleClaimListing(request.id)}
                    >
                      Энэ байрыг хариуцаж авах
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {userRequests.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[#ff3bad] font-black uppercase italic tracking-widest">
                    Одоогоор шинэ хүсэлт ирээгүй байна
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 3. Хадгалсан */}
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
              {favoriteApartments.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[#ff3bad] font-black uppercase italic tracking-widest">
                    Таны хадгалсан байр байхгүй байна
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
