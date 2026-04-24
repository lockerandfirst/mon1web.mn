"use client";

import { ListingsGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

import type { AgentPortalTab } from "@/components/portal/portal-types";

/** «Худалдан авах хүсэлт» таб — картын grid-тэй ойролцоо. */
export function BuyRequestsTabSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-label="Хүсэлтүүд ачаалж байна"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-3xl border border-[#ff3bad]/20 bg-white shadow-sm ring-1 ring-[#ff3bad]/10"
        >
          <div className="flex items-center justify-between border-b border-[#ff3bad]/15 bg-[#fff7fc] px-5 py-3">
            <Skeleton className="h-6 w-14 rounded-full bg-[#ff3bad]/35" />
            <Skeleton className="h-3 w-20 rounded-md bg-[#ff3bad]/20" />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <Skeleton className="h-5 w-full max-w-[min(100%,14rem)]" />
            <Skeleton className="h-3 w-3/4 max-w-xs" />
            <Skeleton className="mt-1 h-7 w-32 rounded-lg bg-[#ff3bad]/15" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-11 w-full rounded-3xl bg-[#ff3bad]/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** «Миний мэдээлэл» таб — профайл карт + талбарууд. */
export function ProfileTabSkeleton() {
  return (
    <div
      className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(42, 0, 255,0.15)]"
      role="status"
      aria-live="polite"
      aria-label="Профайл ачаалж байна"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:text-left">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full bg-slate-100" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="mx-auto h-3 w-24 sm:mx-0" />
          <Skeleton className="mx-auto h-8 w-48 max-w-full sm:mx-0" />
          <Skeleton className="mx-auto h-3 w-32 sm:mx-0" />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
          <Skeleton className="mb-3 h-3 w-28" />
          <Skeleton className="mx-auto h-28 w-28 rounded-full bg-white" />
          <Skeleton className="mx-auto mt-3 h-9 w-40 rounded-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-3xl bg-[#2a00ff]/20" />
      </div>
    </div>
  );
}

/** Нэвтрэлт / gate — listing grid биш, ерөнхий placeholder. */
export function AgentPortalAuthContentSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-label="Ачаалж байна">
      <Skeleton className="h-40 w-full max-w-2xl rounded-3xl bg-white/80" />
      <Skeleton className="h-28 w-full max-w-xl rounded-2xl bg-white/60" />
      <Skeleton className="h-20 w-full max-w-lg rounded-2xl bg-white/50" />
    </div>
  );
}

export function AgentPortalTabBodySkeleton({ tab }: { tab: AgentPortalTab }) {
  switch (tab) {
    case "listings":
    case "saleRequests":
      return (
        <ListingsGridSkeleton className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6" />
      );
    case "buyRequests":
      return <BuyRequestsTabSkeleton />;
    case "profile":
      return <ProfileTabSkeleton />;
  }
}
