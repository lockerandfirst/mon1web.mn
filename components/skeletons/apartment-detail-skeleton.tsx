import type { ReactNode } from "react";
import { ApartmentPageBackButtonSkeleton } from "@/components/apartmentDetail/apartment-page-back-button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Зарын дэлгэрэнгүй хуудасны layout-тай тааруулсан placeholder (gallery + 8/4 grid).
 */
type ApartmentDetailSkeletonProps = {
  /** Хоосон бол «Буцах» мөрийн skeleton; тодорхой JSX өгвөл (жишээ нь жинхэнэ Буцах товч) түүнийг харуулна. */
  topSlot?: ReactNode;
};

export function ApartmentDetailSkeleton({ topSlot }: ApartmentDetailSkeletonProps = {}) {
  return (
    <div
      className="min-h-screen bg-[#FDFCFB] pb-20 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]"
      role="status"
      aria-live="polite"
      aria-label="Зарын мэдээлэл ачаалж байна"
    >
      <nav
        className="mx-auto max-w-[1400px] px-3 pb-1 sm:px-4 md:px-6 md:pb-2"
        aria-hidden
      >
        {topSlot ?? <ApartmentPageBackButtonSkeleton />}
      </nav>
      <section className="mx-auto max-w-[1400px] px-3 pt-3 sm:px-4 md:px-6 md:pt-5">
        <div className="relative h-[280px] overflow-hidden rounded-4xl bg-slate-100 shadow-xl shadow-blue-900/5 md:h-[650px] md:rounded-[3rem] md:shadow-2xl">
          <Skeleton
            variant="shimmer-brand"
            className="absolute inset-0 rounded-4xl md:rounded-[3rem]"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between md:bottom-8 md:left-8 md:right-8">
            <Skeleton className="h-9 w-9 rounded-full md:h-14 md:w-14" />
            <Skeleton className="h-9 w-9 rounded-full md:h-14 md:w-14" />
          </div>
        </div>
      </section>

      <main className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 px-3 sm:px-4 md:mt-10 md:gap-10 md:px-6 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-8 md:space-y-10 lg:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Skeleton className="h-8 w-28 rounded-full md:h-10 md:w-36" />
              <Skeleton className="h-8 w-32 rounded-full md:h-10 md:w-40" />
              <Skeleton className="h-8 w-36 rounded-full md:h-10 md:w-44" />
            </div>
            <Skeleton className="h-10 w-full max-w-4xl md:h-14" />
            <Skeleton className="h-10 w-[92%] max-w-3xl md:h-12" />
            <Skeleton className="h-16 w-full rounded-2xl md:h-20 md:max-w-xl" />
            <Skeleton className="h-4 w-32 md:h-5 md:w-40" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:rounded-3xl md:p-5"
              >
                <Skeleton className="mx-auto mb-2 h-8 w-8 rounded-lg md:h-10 md:w-10" />
                <Skeleton className="mx-auto h-3 w-12 md:h-4 md:w-16" />
                <Skeleton className="mx-auto mt-2 h-5 w-10 md:mt-3 md:h-6 md:w-14" />
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:rounded-4xl md:p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 md:pb-4">
                <Skeleton className="h-5 w-48 md:h-6 md:w-64" />
                <Skeleton className="mt-2 h-3 w-full md:mt-3" />
                <Skeleton className="mt-1 h-3 w-[88%] md:mt-2" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-40 md:h-6 md:w-52" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-24 rounded-xl md:h-10 md:w-28 md:rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="space-y-4 md:sticky md:top-28 md:space-y-6">
            <div className="rounded-4xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-500/10 md:rounded-[3.5rem] md:p-8 md:shadow-2xl">
              <Skeleton className="mb-2 h-3 w-24 md:mb-3 md:h-4 md:w-28" />
              <Skeleton className="mb-4 h-12 w-3/4 max-w-xs md:mb-6 md:h-16" />
              <div className="mb-4 grid grid-cols-2 gap-2 md:mb-8 md:gap-3">
                <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
                  <Skeleton className="mb-2 h-2.5 w-16 md:h-3 md:w-20" />
                  <Skeleton className="h-5 w-24 md:h-6 md:w-28" />
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
                  <Skeleton className="mb-2 h-2.5 w-14 md:h-3 md:w-16" />
                  <Skeleton className="h-5 w-20 md:h-6 md:w-24" />
                </div>
              </div>
              <div className="mb-4 flex items-center gap-3 md:mb-6">
                <Skeleton className="h-14 w-14 shrink-0 rounded-full md:h-16 md:w-16" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 md:h-5 md:w-40" />
                  <Skeleton className="h-3 w-24 md:h-4 md:w-32" />
                </div>
              </div>
              <Skeleton className="mb-2 h-12 w-full rounded-2xl md:mb-3 md:h-14 md:rounded-3xl" />
              <Skeleton className="h-12 w-full rounded-2xl md:h-14 md:rounded-3xl" />
            </div>
          </div>
        </div>
      </main>

      <section className="mx-auto mt-12 max-w-7xl space-y-6 px-3 sm:px-4 md:mt-20 md:space-y-10 md:px-6">
        <div className="space-y-2 md:space-y-3">
          <Skeleton className="h-6 w-40 rounded-full md:h-8 md:w-48" />
          <Skeleton className="h-10 w-72 max-w-full md:h-14 md:w-96" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:rounded-4xl"
            >
              <Skeleton className="aspect-2/1 w-full max-sm:aspect-[2.2/1] md:aspect-16/10" />
              <div className="space-y-2 p-4 md:p-5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
