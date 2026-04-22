"use client";

import { use, useEffect, useState } from "react";
import type { Apartment } from "@/lib/data";
import {
  apartmentFromApiListing,
  type OwnerContact,
} from "@/lib/portal/apartment-from-api-listing";
import { ContactSidebar } from "@/components/apartmentDetail/contact-sidebar";
import { GallerySection } from "@/components/apartmentDetail/gallery-section";
import { PropertySpecs } from "@/components/apartmentDetail/property-specs";
import { RelatedListings } from "@/components/apartmentDetail/related-listings";
import { PropertyHeader } from "@/components/apartmentDetail/property-header";
import { DetailsAccordion } from "@/components/apartmentDetail/details-accordion";
import { NearbyServices } from "@/components/nearby-services";
import { API_BASE_URL } from "@/lib/backend-api";

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [apt, setApt] = useState<Apartment | null>(null);
  const [contactUsesAgent, setContactUsesAgent] = useState(false);
  const [ownerContact, setOwnerContact] = useState<OwnerContact | null>(null);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">(
    "loading",
  );

  /** Зөвхөн GET /api/listings/:id — localStorage эсвэл static fallback байхгүй. */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoadState("loading");
      setApt(null);
      setOwnerContact(null);
      setViewCount(null);
      setContactUsesAgent(false);

      try {
        const detailRes = await fetch(
          `${API_BASE_URL}/api/listings/${encodeURIComponent(id)}`,
        );

        if (!detailRes.ok) {
          if (!cancelled) {
            setLoadState("error");
          }
          return;
        }

        const detailJson = (await detailRes.json()) as {
          success?: boolean;
          data?: Record<string, unknown>;
        };

        const row = detailJson.data;
        if (!row) {
          if (!cancelled) {
            setLoadState("error");
          }
          return;
        }

        const { apartment, contactUsesAgent: usesAgent, ownerContact: owner } =
          apartmentFromApiListing(row);

        if (cancelled) {
          return;
        }

        setApt(apartment);
        setContactUsesAgent(usesAgent);
        setOwnerContact(owner);
        setViewCount(
          typeof apartment.viewCount === "number" ? apartment.viewCount : 0,
        );
        setLoadState("ok");
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

  /** Үзэлт +1 — API-ийн буцаасан viewCount-оор локал төлөвийг шинэчилнэ. */
  useEffect(() => {
    if (loadState !== "ok" || !id) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const viewRes = await fetch(
          `${API_BASE_URL}/api/listings/${encodeURIComponent(id)}/record-view`,
          { method: "POST" },
        );

        if (!cancelled && viewRes.ok) {
          const viewJson = (await viewRes.json()) as {
            data?: { viewCount?: number };
          };
          const next = viewJson.data?.viewCount;
          if (typeof next === "number") {
            setViewCount(next);
            setApt((prev) => (prev ? { ...prev, viewCount: next } : null));
          }
        }
      } catch {
        /* record-view алдааг үл тоомсорлоно */
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [id, loadState]);

  if (loadState === "loading" || loadState === "error") {
    return (
      <div className="flex h-screen items-center justify-center px-4 text-center text-sm font-black italic uppercase tracking-wide text-slate-300 md:text-base md:tracking-widest">
        {loadState === "error"
          ? "Зар олдсонгүй эсвэл ачаалахад алдаа гарлаа."
          : "Уншиж байна..."}
      </div>
    );
  }

  if (!apt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
      <GallerySection images={apt.images} />

      <main className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 px-3 sm:px-4 md:mt-10 md:gap-10 md:px-6 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-8 md:space-y-10 lg:space-y-12">
          <PropertyHeader apt={apt} viewCount={viewCount} />
          <PropertySpecs apt={apt} />
          <DetailsAccordion apt={apt} />
          <NearbyServices services={apt.nearbyServices} />
        </div>

        <div className="lg:col-span-4">
          <ContactSidebar
            apt={apt}
            contactUsesAgent={contactUsesAgent}
            ownerContact={ownerContact}
          />
        </div>
      </main>

      <RelatedListings currentId={apt.id} />
    </div>
  );
}
