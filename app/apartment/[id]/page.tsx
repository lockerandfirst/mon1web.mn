"use client";

import { use, useEffect, useRef, useState } from "react";
import type { Apartment } from "@/lib/data";
import {
  apartmentFromApiListing,
  type OwnerContact,
} from "@/lib/portal/apartment-from-api-listing";
import { debug } from "@/lib/debug";
import { ApartmentPageBackButton } from "@/components/apartmentDetail/apartment-page-back-button";
import { ContactSidebar } from "@/components/apartmentDetail/contact-sidebar";
import { GallerySection } from "@/components/apartmentDetail/gallery-section";
import { PropertySpecs } from "@/components/apartmentDetail/property-specs";
import { RelatedListings } from "@/components/apartmentDetail/related-listings";
import { PropertyHeader } from "@/components/apartmentDetail/property-header";
import { DetailsAccordion } from "@/components/apartmentDetail/details-accordion";
import { NearbyServices } from "@/components/nearby-services";
import { ApartmentDetailSkeleton } from "@/components/skeletons";
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
  /** StrictMode/React 19 давтан mount-д нэг л удаа `record-view` дуудахын тулд. */
  const recordedViewForIdRef = useRef<string | null>(null);

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

        const {
          apartment,
          contactUsesAgent: usesAgent,
          ownerContact: owner,
        } = apartmentFromApiListing(row);

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
    if (recordedViewForIdRef.current === id) {
      return;
    }
    recordedViewForIdRef.current = id;

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
      } catch (error) {
        debug.warn("apartment-detail", "record-view failed", {
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [id, loadState]);

  if (loadState === "loading") {
    return (
      <ApartmentDetailSkeleton topSlot={<ApartmentPageBackButton />} />
    );
  }

  if (loadState === "error") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
        <nav
          className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6"
          aria-label="Буцах"
        >
          <ApartmentPageBackButton />
        </nav>
        <div className="flex min-h-[55dvh] items-center justify-center px-4 py-12 text-center text-sm font-medium text-slate-500 md:text-base">
          Зар олдсонгүй эсвэл ачаалахад алдаа гарлаа.
        </div>
      </div>
    );
  }

  if (!apt) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
        <nav
          className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6"
          aria-label="Буцах"
        >
          <ApartmentPageBackButton />
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
      <nav
        className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6"
        aria-label="Дэлгэрэнгүй"
      >
        <ApartmentPageBackButton />
      </nav>
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
