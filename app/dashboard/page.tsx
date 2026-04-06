"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Heart,
  MessageSquare,
  TrendingUp,
  MoreVertical,
  Pencil,
  Trash2,
  BarChart3,
  Users,
  Building2,
  DollarSign,
  BadgeCheck,
  Search,
  Bell,
  MapPin,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);

  // Mock agent data (would come from auth in real app)
  const currentAgent = agents[0];

  useEffect(() => {
    setMarketplaceListings(readMarketplaceListings());
  }, []);

  const publishedMarketplaceListings = marketplaceListings.filter(
    (listing) =>
      listing.workflowStatus === "published" &&
      listing.agent.id === currentAgent.id,
  );

  const pendingMarketplaceListings = marketplaceListings.filter(
    (listing) => listing.workflowStatus === "pending",
  );

  const agentListings = [
    ...publishedMarketplaceListings,
    ...apartments.filter((apt) => apt.agent.id === currentAgent.id),
  ];

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

  // Mock stats
  const stats = {
    totalListings: agentListings.length,
    totalViews: 12450,
    totalInquiries: 89,
    totalFavorites: 324,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Агентын хянах самбар
            </h1>
            <p className="text-muted-foreground">
              Тавтай морил, {currentAgent.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/add-property">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5" />
                Шинэ зар нэмэх
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Нийт зар</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalListings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Нийт үзэлт</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Хүсэлтүүд</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalInquiries}
                  </p>
                </div>
                <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Дуртай</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalFavorites}
                  </p>
                </div>
                <div className="w-12 h-12 bg-chart-5/10 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-chart-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Owner Requests Queue */}
        <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Эзэмшигчдийн шинэ хүсэлтүүд
              </CardTitle>
              <Badge className="bg-primary text-primary-foreground">Шинэ</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Хүмүүс байрны мэдээллээ илгээсэн байна. Та зөвшөөрвөл нийтлэл болж
              үндсэн сайтад гарна.
            </p>
          </CardHeader>
          <CardContent>
            {pendingMarketplaceListings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                <p className="font-medium text-foreground mb-2">
                  Шинэ хүсэлт алга
                </p>
                <p className="text-sm text-muted-foreground">
                  Хэрэглэгч байр нэмэхэд энд гарч ирнэ.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pendingMarketplaceListings.map((request) => (
                  <Card
                    key={request.id}
                    className="border-border bg-background"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {request.district}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Зар:</span>
                          <span className="text-foreground truncate ml-3">
                            {request.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Үнэ:</span>
                          <span className="text-foreground font-medium">
                            {formatPrice(request.price)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Эзэмшигч:
                          </span>
                          <span className="text-foreground">
                            {request.submittedBy.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Төлөв:</span>
                          <span className="text-foreground">
                            {request.selectedAgentId
                              ? "Агент хүссэн"
                              : "Нээлттэй хүсэлт"}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 gap-2"
                        size="sm"
                        onClick={() => handleClaimListing(request.id)}
                      >
                        Би энэ байрыг зарна
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" className="gap-2">
              <Home className="h-4 w-4" />
              Миний зарууд
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Статистик
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Хүсэлтүүд
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-xl">Миний зарууд</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Зар хайх..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Байр</TableHead>
                        <TableHead>Үнэ</TableHead>
                        <TableHead>Төлөв</TableHead>
                        <TableHead className="text-center">Үзэлт</TableHead>
                        <TableHead className="text-center">Хүсэлт</TableHead>
                        <TableHead className="text-right">Үйлдэл</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="max-w-50 truncate font-medium text-foreground">
                                  {listing.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {listing.location}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-foreground">
                              {formatPrice(listing.price)}
                            </p>
                          </TableCell>
                          <TableCell>
                            {listing.verified ? (
                              <Badge
                                variant="secondary"
                                className="gap-1 bg-primary/10 text-primary border-0"
                              >
                                <BadgeCheck className="h-3 w-3" />
                                Баталгаажсан
                              </Badge>
                            ) : (
                              <Badge variant="outline">Хүлээгдэж байна</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">
                              {((Number(listing.id) * 127 + 100) % 500) + 100}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">
                              {((Number(listing.id) * 7 + 5) % 20) + 5}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link
                                    href={`/apartment/${listing.id}`}
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Үзэх
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Засах
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Устгах
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Гүйцэтгэлийн тойм
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Энэ сарын үзэлт
                      </span>
                      <span className="font-semibold text-foreground">
                        3,245 <span className="text-primary text-sm">+12%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Энэ сарын хүсэлт
                      </span>
                      <span className="font-semibold text-foreground">
                        28 <span className="text-primary text-sm">+8%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Хөрвүүлэлтийн хувь
                      </span>
                      <span className="font-semibold text-foreground">
                        0.86%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Дундаж хариу өгөх хугацаа
                      </span>
                      <span className="font-semibold text-foreground">
                        2.4 цаг
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Зарын үнэлгээ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Нийт багцын үнэ
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {formatPrice(
                          agentListings.reduce(
                            (sum, apt) => sum + apt.price,
                            0,
                          ),
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Дундаж үнэ</span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(
                          agentListings.reduce(
                            (sum, apt) => sum + apt.price,
                            0,
                          ) / agentListings.length,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Хамгийн өндөр зар
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(
                          Math.max(...agentListings.map((apt) => apt.price)),
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Сүүлийн хүсэлтүүд</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Эрдэнэ Батбаяр",
                      property: "Зайсан дахь орчин үеийн 3 өрөө байр",
                      time: "2 цагийн өмнө",
                      message:
                        "Энэ байр одоо ч гэсэн боломжтой юу? Энэ амралтын өдөр үзлэг хийлгэмээр байна.",
                    },
                    {
                      name: "Сарнай Отгон",
                      property: "Өргөн 4 өрөө гэр бүлийн байр",
                      time: "5 цагийн өмнө",
                      message: "Зогсоолын талаар дэлгэрэнгүй мэдээлэл өгөөч?",
                    },
                    {
                      name: "Түмэндэлгэр Болд",
                      property: "Зайсан дахь орчин үеийн 3 өрөө байр",
                      time: "1 өдрийн өмнө",
                      message:
                        "Энэ барилгын сарын засвар үйлчилгээний хураамж хэд вэ?",
                    },
                  ].map((inquiry, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">
                            {inquiry.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {inquiry.time}
                          </span>
                        </div>
                        <p className="text-sm text-primary mb-1">
                          {inquiry.property}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.message}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Хариу бичих
                          </Button>
                          <Button size="sm" variant="outline">
                            Байр үзэх
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
