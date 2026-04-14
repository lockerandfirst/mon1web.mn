"use client";

import { use, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { ApartmentCard } from "@/components/apartment-card";
import { apartments, type Apartment } from "@/lib/data";
import { readMarketplaceListings } from "@/lib/marketplace";
import { motion } from "framer-motion";
import { ContactSidebar } from "@/components/apartmentDetail/contact-sidebar";
import { GallerySection } from "@/components/apartmentDetail/gallery-section";
import { PropertySpecs } from "@/components/apartmentDetail/property-specs";
import { RelatedListings } from "@/components/apartmentDetail/related-listings";
import { PropertyHeader } from "@/components/apartmentDetail/property-header";
import { DetailsAccordion } from "@/components/apartmentDetail/details-accordion";

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
      <div className="h-screen flex items-center justify-center font-black italic uppercase tracking-widest text-slate-300">
        Уншиж байна...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Header />

      <GallerySection images={apt.images} />

      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-1 gap-12 px-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-12">
          <PropertyHeader apt={apt} />
          <PropertySpecs apt={apt} />
          <DetailsAccordion apt={apt} />
        </div>

        <div className="lg:col-span-4">
          <ContactSidebar apt={apt} />
        </div>
      </main>

      <RelatedListings currentId={apt.id} />
    </div>
  );
}
