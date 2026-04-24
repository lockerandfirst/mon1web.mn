import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Mobile listing card skeleton — `ListingsTable`-ийн карттай ижил бүтэц (№+утас, гарчиг+байршил truncate).
 */
export function DashboardListingRowSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#fff1f9] bg-[#fff9fd] p-2.5 md:hidden",
        className,
      )}
      aria-hidden="true"
    >
      <div className="mb-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <Skeleton className="h-3 w-7 shrink-0 rounded" />
        <Skeleton className="h-3 w-28 max-w-[min(100%,9rem)] shrink-0" />
      </div>
      <div className="flex gap-2.5">
        <Skeleton className="h-16 w-20 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-1">
          <Skeleton className="h-3.5 w-full max-w-[min(100%,15rem)]" />
          <Skeleton className="h-2.5 w-[72%] max-w-44" />
          <Skeleton className="mt-1 h-4 w-24 bg-[#2a00ff]/25" />
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <Skeleton className="h-2.5 w-[60%] max-w-56" />
        <Skeleton className="h-2.5 w-[48%] max-w-48 bg-[#ff3bad]/25" />
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5">
        <Skeleton className="h-8 w-14 rounded-lg" />
        <Skeleton className="h-8 w-14 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Дашбоард хүснэгт — desktop-д `ListingsTable`-тай ижил `table-fixed` багана.
 */
export function DashboardListingsTableSkeleton({
  rows = 5,
}: {
  rows?: number;
}) {
  return (
    <div role="status" aria-live="polite" aria-label="Зарууд ачаалж байна">
      <div className="space-y-2 p-2 md:hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <DashboardListingRowSkeleton key={i} />
        ))}
      </div>

      <div className="hidden min-w-0 md:block">
        <Table
          className="table-fixed"
          containerClassName="min-w-0 w-full overflow-x-auto"
        >
          <TableHeader className="bg-[#fff9fd]">
            <TableRow className="border-none hover:bg-transparent [&:hover]:bg-transparent">
              <TableHead className="h-auto w-9 px-1 py-3 text-center font-black uppercase text-[10px] tracking-widest text-[#ff3bad] lg:w-10">
                №
              </TableHead>
              <TableHead className="h-auto w-[26%] py-3 pl-1 text-left font-black uppercase text-[10px] tracking-widest text-[#ff3bad] lg:pl-2">
                Байршил / Нэр
              </TableHead>
              <TableHead className="h-auto w-[12%] py-3 text-left font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Үнэ
              </TableHead>
              <TableHead className="h-auto w-[14%] py-3 text-left font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Утас
              </TableHead>
              <TableHead className="h-auto w-[14%] py-3 text-left font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Нийтэлсэн
              </TableHead>
              <TableHead className="h-auto w-[14%] py-3 text-left font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Дуусах
              </TableHead>
              <TableHead className="h-auto w-[15%] py-3 pr-4 text-right font-black uppercase text-[10px] tracking-widest text-[#ff3bad] lg:pr-6">
                Үйлдэл
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-[#fff1f9]/70 hover:bg-[#fff9fd]"
              >
                <TableCell className="px-1 py-3 text-center align-middle">
                  <Skeleton className="mx-auto h-4 w-5 rounded" />
                </TableCell>
                <TableCell className="min-w-0 whitespace-normal py-3 pl-1 align-middle lg:pl-2">
                  <div className="flex min-w-0 items-center gap-2 lg:gap-3">
                    <Skeleton className="h-11 w-14 shrink-0 rounded-lg lg:h-12 lg:w-16 lg:rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-1.5 text-left">
                      <Skeleton className="h-3.5 w-full max-w-[min(100%,18rem)]" />
                      <Skeleton className="h-2.5 w-[65%] max-w-52" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-middle text-left">
                  <Skeleton className="h-5 w-20 max-w-full bg-[#2a00ff]/25" />
                </TableCell>
                <TableCell className="min-w-0 align-middle text-left">
                  <Skeleton className="h-3 w-24 max-w-full" />
                </TableCell>
                <TableCell className="align-middle">
                  <Skeleton className="h-3 w-20 max-w-full" />
                </TableCell>
                <TableCell className="align-middle">
                  <Skeleton className="h-3 w-20 max-w-full bg-[#ff3bad]/25" />
                </TableCell>
                <TableCell className="pr-4 text-right align-middle lg:pr-6">
                  <div className="flex flex-wrap items-center justify-end gap-1">
                    <Skeleton className="h-8 w-14 rounded-lg" />
                    <Skeleton className="h-8 w-14 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
