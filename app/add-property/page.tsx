"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Footer } from "@/components/footer";
import { AddPropertyForm } from "@/components/add-property/add-property-form";
import { cn } from "@/lib/utils";

function AddPropertyPageContent() {
  const searchParams = useSearchParams();
  const [listingSaved, setListingSaved] = useState(false);
  const editListingId = searchParams.get("edit");

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main
        className={cn(
          "mx-auto w-full flex-1 px-4",
          listingSaved
            ? "flex flex-col items-center justify-center py-12"
            : "container max-w-7xl py-10",
        )}
      >
        <div className={cn(!listingSaved && "mx-auto max-w-7xl")}>
          <AddPropertyForm
            onSuccess={() => setListingSaved(true)}
            editListingId={editListingId}
          />
        </div>
      </main>
      {!listingSaved && <Footer />}
    </div>
  );
}

function AddPropertyPageFallback() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
    </div>
  );
}

export default function AddPropertyPage() {
  return (
    <Suspense fallback={<AddPropertyPageFallback />}>
      <AddPropertyPageContent />
    </Suspense>
  );
}
