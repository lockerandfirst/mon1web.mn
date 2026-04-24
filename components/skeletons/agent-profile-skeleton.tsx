import { Skeleton } from "@/components/ui/skeleton";

import { ListingsGridSkeleton } from "./listings-grid-skeleton";

/**
 * `/agents/[id]` профайл хуудасны skeleton — бодит layout-ын padding,
 * rounded, grid тусгаарлалтыг яг таг хуулсан.
 */
export function AgentProfileSkeleton({
  listingsCount = 3,
}: {
  listingsCount?: number;
}) {
  return (
    <div className="min-h-screen bg-[#fff9fd] pb-20 pt-[calc(env(safe-area-inset-top,0px)+5rem)]">
      <main
        className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"
        role="status"
        aria-live="polite"
        aria-label="Агентын профайлыг ачаалж байна"
      >
        {/* Back link placeholder */}
        <Skeleton className="mb-4 h-7 w-20 rounded-full bg-white" />

        {/* Hero card */}
        <section className="rounded-4xl border border-[#eeebff] bg-white p-5 shadow-lg shadow-[#2a00ff]/10 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Skeleton className="h-18 w-18 rounded-full bg-[#eeebff] md:h-22 md:w-22" />
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-44 md:h-8 md:w-60" />
                  <Skeleton className="h-5 w-5 rounded-full bg-[#2a00ff]/25" />
                </div>
                <Skeleton className="h-3.5 w-32 md:h-4 md:w-40" />
                <Skeleton className="h-5 w-40 rounded-full bg-[#eef0ff]" />
              </div>
            </div>

            {/* Contact sidebar rows */}
            <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 md:min-w-72 md:p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-sm bg-[#2a00ff]/25" />
                  <Skeleton className="h-3.5 w-40 md:h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Bio card */}
          <div className="mt-5 rounded-3xl border border-[#eeebff] bg-[#faf9ff] p-4 md:mt-6 md:p-5">
            <Skeleton className="h-2.5 w-28 bg-[#2a00ff]/25" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-[92%]" />
              <Skeleton className="h-3 w-[78%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          </div>
        </section>

        {/* Listings section */}
        <section className="mt-6 md:mt-8">
          <div className="mb-4 flex items-end justify-between md:mb-6">
            <Skeleton className="h-6 w-48 md:h-8 md:w-64" />
            <Skeleton className="h-3 w-20 bg-[#ff3bad]/25" />
          </div>
          <ListingsGridSkeleton count={listingsCount} />
        </section>
      </main>
    </div>
  );
}
