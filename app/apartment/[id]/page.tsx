"use client";

import { use, useEffect, useState } from "react";
import { apartments, type Apartment } from "@/lib/data";
import { readMarketplaceListings } from "@/lib/marketplace";
import { ContactSidebar } from "@/components/apartmentDetail/contact-sidebar";
import { GallerySection } from "@/components/apartmentDetail/gallery-section";
import { PropertySpecs } from "@/components/apartmentDetail/property-specs";
import { RelatedListings } from "@/components/apartmentDetail/related-listings";
import { PropertyHeader } from "@/components/apartmentDetail/property-header";
import { DetailsAccordion } from "@/components/apartmentDetail/details-accordion";
import { NearbyServices } from "@/components/nearby-services";

// Modular Components

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [apt, setApt] = useState<Apartment | null>(null);

  useEffect(() => {
    const publishedListings = readMarketplaceListings().filter(
      (l) => l.workflowStatus === "published",
    );
    const found = [...publishedListings, ...apartments].find(
      (l) => l.id === resolvedParams.id,
    );
    setApt(found || null);
  }, [resolvedParams.id]);

  if (!apt)
    return (
      <div className="flex h-screen items-center justify-center px-4 text-center text-sm font-black italic uppercase tracking-wide text-slate-300 md:text-base md:tracking-widest">
        Уншиж байна...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
      <GallerySection images={apt.images} />

      <main className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 px-3 sm:px-4 md:mt-10 md:gap-10 md:px-6 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-8 md:space-y-10 lg:space-y-12">
          <PropertyHeader apt={apt} />
          <PropertySpecs apt={apt} />
          <DetailsAccordion apt={apt} />
          <NearbyServices services={apt.nearbyServices} />
        </div>

        <div className="lg:col-span-4">
          <ContactSidebar apt={apt} />
        </div>
      </main>

      <RelatedListings currentId={apt.id} />
    </div>
  );
}
