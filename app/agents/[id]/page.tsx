"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, ShieldCheck } from "lucide-react";

import { ApartmentCard } from "@/components/apartment-card";
import { AgentProfileSkeleton } from "@/components/skeletons";
import { SafeImage } from "@/components/ui/safe-image";
import { API_BASE_URL } from "@/lib/backend-api";
import type { Agent, Apartment } from "@/lib/data";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";

type AgentProfileResponse = {
  success?: boolean;
  data?: {
    id?: string;
    name?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    company?: string;
    rating?: number;
    review_count?: number;
    listings_count?: number;
    verified?: boolean;
    bio?: string;
    listings?: Record<string, unknown>[];
  };
};

export default function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentBio, setAgentBio] = useState("");
  const [listings, setListings] = useState<Apartment[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoadState("loading");
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/agents/${encodeURIComponent(id)}`,
        );
        if (!response.ok) {
          if (!cancelled) {
            setLoadState("error");
          }
          return;
        }

        const json = (await response.json()) as AgentProfileResponse;
        const payload = json.data;
        if (!payload?.id) {
          if (!cancelled) {
            setLoadState("error");
          }
          return;
        }

        const mappedAgent: Agent = {
          id: String(payload.id ?? ""),
          name: String(payload.name ?? "Агент"),
          avatar: String(payload.avatar ?? ""),
          phone: String(payload.phone ?? ""),
          email: String(payload.email ?? ""),
          company: String(payload.company ?? ""),
          rating: Number(payload.rating ?? 0),
          reviewCount: Number(payload.review_count ?? 0),
          listingsCount: Number(payload.listings_count ?? 0),
          verified: Boolean(payload.verified ?? false),
        };

        const mappedListings = (payload.listings ?? [])
          .map((row) =>
            apartmentFromApiListing({
              ...row,
              listing_agent: {
                id: mappedAgent.id,
                name: mappedAgent.name,
                avatar: mappedAgent.avatar,
                phone: mappedAgent.phone,
                email: mappedAgent.email,
                company: mappedAgent.company,
                rating: mappedAgent.rating,
                review_count: mappedAgent.reviewCount,
                listings_count: mappedAgent.listingsCount,
                verified: mappedAgent.verified,
              },
            }).apartment,
          )
          .filter((row) => row.agent.id && row.id);

        if (!cancelled) {
          setAgent(mappedAgent);
          setAgentBio(String(payload.bio ?? "").trim());
          setListings(mappedListings);
          setLoadState("ok");
        }
      } catch {
        if (!cancelled) {
          setLoadState("error");
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loadState === "loading") {
    return <AgentProfileSkeleton listingsCount={3} />;
  }

  if (loadState === "error" || !agent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm font-black text-slate-500">
        Агентын профайл олдсонгүй.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9fd] pb-20 pt-[calc(env(safe-area-inset-top,0px)+5rem)]">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <Link
          href="/listings"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2a00ff]/20 bg-white px-3 py-1.5 text-xs font-black text-[#2a00ff] hover:bg-[#f5f3ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Буцах
        </Link>

        <section className="rounded-4xl border border-[#eeebff] bg-white p-5 shadow-lg shadow-[#2a00ff]/10 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <SafeImage
                src={agent.avatar}
                variant="avatar"
                alt={agent.name}
                className="h-18 w-18 rounded-full border-4 border-[#eeebff] object-cover md:h-22 md:w-22"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-2xl font-black text-[#2a00ff] md:text-3xl">
                    {agent.name}
                  </h1>
                  {agent.verified ? (
                    <ShieldCheck className="h-5 w-5 text-[#2a00ff]" />
                  ) : null}
                </div>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {agent.company || "Агент"}
                </p>
                <div className="mt-2 inline-flex items-center rounded-full border border-[#2a00ff]/15 bg-[#f5f3ff] px-3 py-1 text-[11px] font-black text-[#2a00ff]">
                  Рейтинг: {agent.rating.toFixed(1)} ({agent.reviewCount})
                </div>
              </div>
            </div>
            <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-600 md:min-w-72 md:p-4">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#2a00ff]" />
                {agent.phone || "Утас оруулаагүй"}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#2a00ff]" />
                {agent.email || "Имэйл оруулаагүй"}
              </p>
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2a00ff]" />
                Нийт зар: {listings.length}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-[#eeebff] bg-[#faf9ff] p-4 md:mt-6 md:p-5">
            <p className="text-[11px] font-black uppercase tracking-wide text-[#2a00ff]">
              Агентын танилцуулга
            </p>
            <p className="mt-2 text-sm leading-relaxed font-semibold text-slate-600 md:text-[15px]">
              {agentBio || "Одоогоор агент тайлбар оруулаагүй байна."}
            </p>
          </div>
        </section>

        <section className="mt-6 md:mt-8">
          <div className="mb-4 flex items-end justify-between md:mb-6">
            <h2 className="text-xl font-black text-[#2a00ff] md:text-2xl">
              Энэ агентын зарууд
            </h2>
            <p className="text-xs font-black uppercase tracking-wide text-[#ff3bad]">
              Нийт {listings.length}
            </p>
          </div>
          {listings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#eeebff] bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">
              Одоогоор нийтэлсэн зар алга.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((row) => (
                <ApartmentCard key={row.id} apartment={row} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
