"use client";

import { Suspense } from "react";
import { ListingsPageContent } from "@/components/listings/listings-page-content";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh flex-col items-center justify-center bg-background">
          <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}
