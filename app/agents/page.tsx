"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  User,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Building2,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Eye,
  MousePointer2,
  Plus,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// --- MOCK DATA ---
const MY_LISTINGS = [
  {
    id: "1",
    title: "Sky Garden Residence",
    price: "850,000,000 ₮",
    location: "Хан-Уул, 11-р хороо",
    views: 1240,
    leads: 12,
    status: "claimed",
    agent: {
      name: "А. Тэмүүлэн",
      phone: "9900-1122",
      rating: 4.9,
      agency: "Mon1.mn Realty",
      isVerified: true,
    },
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
  },
  {
    id: "2",
    title: "River Garden 2-р ээлж",
    price: "1.2B ₮",
    location: "Хан-Уул, Маршалын гүүр",
    views: 450,
    leads: 0,
    status: "pending",
    agent: null,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary/10">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        {/* --- TOP HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
              Миний <span className="text-primary italic">Самбар</span>
            </h1>
            <p className="text-zinc-500 font-medium mt-2">
              Үл хөдлөх хөрөнгийн удирдлага болон AI статистик.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/add-property">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-14 px-8 font-bold shadow-2xl shadow-black/10 gap-3 group">
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                ШИНЭ ЗАР НЭМЭХ
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* --- ANALYTICS BENTO TILES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              label: "Нийт үзэлт",
              value: "1,690",
              icon: Eye,
              color: "text-blue-500",
            },
            {
              label: "Агентын хүсэлт",
              value: "08",
              icon: MousePointer2,
              color: "text-primary",
            },
            {
              label: "Идэвхтэй зар",
              value: "02",
              icon: Building2,
              color: "text-green-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-zinc-100 p-6 rounded-4xl shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl bg-zinc-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- MAIN TABS --- */}
        <Tabs
          defaultValue="listings"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-2">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="listings"
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-4 pt-0 font-bold text-zinc-400 shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-zinc-900 data-[state=active]:shadow-none"
              >
                Миний зарууд
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-4 pt-0 font-bold text-zinc-400 shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-zinc-900 data-[state=active]:shadow-none"
              >
                Системийн зарууд
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="listings" className="mt-0">
              <div className="grid gap-6">
                {MY_LISTINGS.map((zar, idx) => (
                  <motion.div
                    key={zar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Layer */}
                      <div className="lg:w-80 h-64 lg:h-auto relative overflow-hidden">
                        <img
                          src={zar.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <Badge
                            className={cn(
                              "px-3 py-1 rounded-full font-bold border-none text-[10px] uppercase tracking-wider",
                              zar.status === "claimed"
                                ? "bg-green-500 text-white"
                                : "bg-amber-500 text-white",
                            )}
                          >
                            {zar.status === "claimed"
                              ? "Агенттай"
                              : "Хүлээгдэж буй"}
                          </Badge>
                        </div>
                      </div>

                      {/* Info Layer */}
                      <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl lg:text-3xl font-black tracking-tighter text-zinc-900 mb-1">
                              {zar.title}
                            </h3>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                              <MapPin className="h-4 w-4" /> {zar.location}
                            </div>
                            <p className="text-2xl font-black text-primary mt-3">
                              {zar.price}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-zinc-100"
                          >
                            <MoreHorizontal className="h-6 w-6 text-zinc-400" />
                          </Button>
                        </div>

                        {/* AGENT OR STATUS SECTION */}
                        <div className="mt-10 pt-8 border-t border-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          {zar.agent ? (
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200 overflow-hidden shadow-sm">
                                  <User className="h-7 w-7 text-zinc-400" />
                                </div>
                                {zar.agent.isVerified && (
                                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1 border-2 border-white">
                                    <ShieldCheck className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-zinc-900">
                                    {zar.agent.name}
                                  </p>
                                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-black text-amber-700">
                                      {zar.agent.rating}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-1">
                                  {zar.agent.agency}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 text-zinc-400">
                              <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center animate-spin-slow">
                                <Clock className="h-5 w-5" />
                              </div>
                              <p className="text-sm font-medium italic">
                                Агентууд таны зарыг хянаж байна...
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            {zar.agent && (
                              <>
                                <Button
                                  variant="outline"
                                  className="h-12 px-6 rounded-xl border-zinc-200 font-bold hover:bg-zinc-50 gap-2"
                                >
                                  <MessageSquare className="h-4 w-4" /> Чаат
                                </Button>
                                <Button className="h-12 px-6 bg-zinc-900 text-white rounded-xl font-bold shadow-xl shadow-black/10 gap-2">
                                  <Phone className="h-4 w-4" />{" "}
                                  {zar.agent.phone}
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              className="h-12 w-12 rounded-xl border border-zinc-100 p-0"
                            >
                              <ArrowUpRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

// Utility for cleaner class names
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
