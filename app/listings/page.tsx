"use client";

import { Suspense } from "react";
import { ListingsPageContent } from "@/components/listings/listings-page-content";
import { ListingsGridSkeleton } from "@/components/skeletons";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-svh w-full max-w-7xl px-3 pt-24 sm:px-4 md:px-6">
          <ListingsGridSkeleton count={6} />
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}
