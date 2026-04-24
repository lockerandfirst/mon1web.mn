"use client";

import { Suspense, use, useState } from "react";

import { Footer } from "@/components/footer";
import { AddPropertyForm } from "@/components/add-property/add-property-form";
import { cn } from "@/lib/utils";

function decodeListingIdSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function EditListingPageInner({ id }: { id: string }) {
  const [listingSaved, setListingSaved] = useState(false);
  const listingIdToEdit = decodeListingIdSegment(id.trim());

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main
        className={cn(
          "mx-auto w-full flex-1 px-3 sm:px-4",
          listingSaved
            ? "flex flex-col items-center justify-center px-4 py-12 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)]"
            : "container max-w-7xl pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] pb-[max(6.5rem,env(safe-area-inset-bottom,0px)+5rem)] md:pb-10 md:pt-10",
        )}
      >
        <div className={cn(!listingSaved && "mx-auto max-w-7xl")}>
          <AddPropertyForm
            key={listingIdToEdit}
            listingIdToEdit={listingIdToEdit}
            onSuccess={() => setListingSaved(true)}
          />
        </div>
      </main>
      {!listingSaved && <Footer />}
    </div>
  );
}

function EditListingFallback() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
    </div>
  );
}

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<EditListingFallback />}>
      <EditListingPageInner id={id} />
    </Suspense>
  );
}
