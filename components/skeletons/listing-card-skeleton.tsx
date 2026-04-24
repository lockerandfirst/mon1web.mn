import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * `ApartmentCard`-ийн картын геометр-т 1:1 тааруулсан skeleton.
 * CLS (layout shift) гарахгүйн тулд padding, rounded, aspect, grid columns
 * бодит картын тохиргоог яг таг ашигладаг.
 */
export function ListingCardSkeleton({
  variant = "default",
  className,
}: {
  variant?: "default" | "compact";
  className?: string;
}) {
  return (
    <Card
      aria-hidden="true"
      data-slot="listing-card-skeleton"
      className={cn(
        "group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border-slate-100 bg-white pt-0 pb-1 shadow-sm",
        "max-md:shadow-md max-md:ring-1 max-md:ring-slate-100/80",
        "md:rounded-[2.5rem]",
        variant === "compact" &&
          "lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-0",
        className,
      )}
    >
      {/* IMAGE — яг aspect-ratio */}
      <div className="relative aspect-2/1 overflow-hidden bg-slate-50 max-sm:aspect-[2.2/1] md:aspect-16/10">
        <Skeleton
          variant="shimmer-brand"
          className="absolute inset-0 rounded-none"
        />
        {/* Pagination indicator dots */}
        <div className="absolute bottom-1.5 left-1/2 z-20 flex -translate-x-1/2 gap-0.5 max-md:scale-90 md:bottom-4 md:gap-1.5 md:scale-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full bg-white/60",
                i === 0 ? "w-3 md:w-4 bg-white/90" : "w-1",
              )}
            />
          ))}
        </div>
        {/* Price pill */}
        <div className="absolute bottom-2 left-2 z-20 max-md:max-w-[58%] md:bottom-4 md:left-4">
          <div className="rounded-lg bg-[#2a00ff]/25 px-2 py-1 backdrop-blur-sm md:rounded-2xl md:px-4 md:py-2">
            <Skeleton className="h-3 w-16 bg-white/60 md:h-4 md:w-24" />
            <Skeleton className="mt-1 hidden h-2 w-20 bg-white/40 md:block" />
          </div>
        </div>
        {/* Top-left badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-1.5 md:top-4 md:left-4">
          <Skeleton className="h-4 w-14 rounded-full bg-[#ff3bad]/25 md:h-5 md:w-16" />
          <Skeleton className="h-4 w-16 rounded-full bg-white/60 md:h-5 md:w-20" />
        </div>
        {/* Heart button */}
        <Skeleton className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-white/50 md:top-4 md:right-4 md:h-10 md:w-10" />
      </div>

      {/* CONTENT — padding match */}
      <CardContent className="flex min-w-0 flex-1 flex-col px-3 py-2.5 md:p-5">
        {/* Title — 1 line on md, 2 lines on mobile */}
        <div className="mb-0.5 space-y-1.5 md:mb-2">
          <Skeleton className="h-3.5 w-[88%] md:h-5 md:w-3/4" />
          <Skeleton className="h-3.5 w-[62%] md:hidden" />
        </div>

        {/* Location */}
        <div className="mb-2 flex items-center gap-1.5 md:mb-5">
          <Skeleton className="h-3.5 w-3.5 rounded-full bg-[#ff3bad]/30 md:h-4 md:w-4" />
          <Skeleton className="h-2.5 w-[55%] md:h-3 md:w-[48%]" />
        </div>

        {/* Specs grid — 4 cols */}
        <div className="mb-2 grid grid-cols-4 items-stretch divide-x divide-slate-200/90 overflow-hidden rounded-xl border border-slate-100/90 bg-[#fff9fd] py-1 md:mb-5 md:divide-x-0 md:rounded-2xl md:border-none md:bg-[#fff9fd] md:py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-0.5 md:gap-1",
                i < 3 && "md:border-r md:border-slate-200",
              )}
            >
              <Skeleton className="h-3 w-3 rounded-sm bg-[#2a00ff]/25 md:h-4 md:w-4" />
              <Skeleton className="h-2 w-7 md:h-2.5 md:w-10" />
            </div>
          ))}
        </div>

        {/* Footer — avatar + name + action */}
        <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5 pt-0.5 md:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full md:h-9 md:w-9" />
            <div className="flex min-w-0 flex-col gap-1">
              <Skeleton className="h-2.5 w-16 md:h-3 md:w-20" />
              <Skeleton className="h-2 w-10 md:h-2.5 md:w-14" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 shrink-0 rounded-lg bg-[#2a00ff]/25 md:h-10 md:w-24 md:rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
