import { ListingsGridSkeleton } from "@/components/skeletons";

/**
 * Next.js route-level Suspense fallback для `/listings`.
 * Зарын grid-ийн яг layout-ыг харуулж, зарууд ачаалагдтал
 * үргэлжилдэг "тогтвортой" placeholder өгнө.
 */
export default function Loading() {
  return (
    <div className="min-h-svh bg-[#fff9fd] pt-[calc(env(safe-area-inset-top,0px)+5rem)]">
      <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 md:px-6 md:py-10">
        <div className="mb-6 space-y-2 md:mb-8">
          <div className="h-6 w-48 animate-pulse rounded-md bg-slate-200/60 md:h-8 md:w-64" />
          <div className="h-3 w-32 animate-pulse rounded-md bg-[#ff3bad]/20 md:h-3.5 md:w-40" />
        </div>
        <ListingsGridSkeleton count={6} />
      </main>
    </div>
  );
}
