"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApartmentCard } from "@/components/apartment-card";
import { agents, apartments, type Agent } from "@/lib/data";
import {
  readMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/marketplace";

export default function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);

  useEffect(() => {
    setMarketplaceListings(
      readMarketplaceListings().filter(
        (listing) => listing.workflowStatus === "published",
      ),
    );
  }, []);

  const agent = useMemo<Agent | null>(
    () => agents.find((item) => item.id === resolvedParams.id) ?? null,
    [resolvedParams.id],
  );

  const agentListings = useMemo(() => {
    if (!agent) {
      return [];
    }

    return [...apartments, ...marketplaceListings].filter(
      (listing) => listing.agent.id === agent.id,
    );
  }, [agent, marketplaceListings]);

  if (!agent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB] px-6">
        <div className="rounded-4xl border border-slate-100 bg-white px-8 py-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Агент олдсонгүй
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Хүссэн агентын профайл одоогоор байхгүй байна.
          </p>
          <Link href="/agents" className="mt-5 inline-block">
            <Button className="rounded-2xl bg-blue-600 px-5 text-white hover:bg-blue-700">
              Агентууд руу буцах
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-16">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/agents" className="inline-block">
          <Button
            variant="outline"
            className="mb-6 rounded-2xl border-slate-200 bg-white px-4 font-bold text-slate-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Агентууд руу буцах
          </Button>
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="h-28 w-28 rounded-4xl object-cover shadow-sm"
              />
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full border-none bg-blue-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    Мэргэжлийн агент
                  </Badge>
                  {agent.verified && (
                    <Badge className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                      Баталгаажсан
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                  {agent.name}
                </h1>
                <p className="text-base font-semibold text-slate-500">
                  {agent.company}
                </p>
                <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {agent.rating} үнэлгээ
                  </span>
                  <span>{agent.reviewCount} сэтгэгдэл</span>
                  <span>{agent.listingsCount} идэвхтэй зар</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-black uppercase tracking-[0.16em] text-slate-900">
              Холбоо барих
            </h2>
            <div className="mt-5 space-y-4 text-sm font-semibold text-slate-600">
              <p className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <Phone className="h-4 w-4 text-blue-600" />
                <a href={`tel:${agent.phone.replace(/\s+/g, "")}`}>
                  {agent.phone}
                </a>
              </p>
              <p className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 break-all">
                <Mail className="h-4 w-4 text-blue-600" />
                <a href={`mailto:${agent.email}`}>{agent.email}</a>
              </p>
              <p className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <Building2 className="h-4 w-4 text-blue-600" />
                {agent.company}
              </p>
              <p className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                {agent.verified ? "Баталгаажсан агент" : "Шалгагдаж буй агент"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                Agent Listings
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tighter text-slate-900">
                {agent.name} агентын зарууд
              </h2>
            </div>
            <Badge className="rounded-full border-none bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
              {agentListings.length} зар
            </Badge>
          </div>

          {agentListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {agentListings.map((listing, index) => (
                <ApartmentCard
                  key={listing.id}
                  apartment={listing}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-4xl border border-dashed border-slate-200 bg-white px-8 py-10 text-center text-sm font-medium text-slate-500">
              Энэ агентын нийтлэгдсэн зар одоогоор алга байна.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
