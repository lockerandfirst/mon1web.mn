import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock, CalendarX, Pencil, Trash2, Loader2 } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { formatPrice } from "@/lib/data";

interface ListingTableProps {
  listings: any[];
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void | Promise<void>;
  deletingId?: string | null;
}

export function ListingTable({
  listings,
  onView,
  onEdit,
  onDelete,
  deletingId,
}: ListingTableProps) {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <>
      <div className="space-y-2 p-2 md:hidden lg:mb-0 -mb-6  lg:mt-0 -mt-9">
        {listings.map((listing, index) => {
          const createdAt = listing.createdAt
            ? new Date(listing.createdAt)
            : null;
          const removedAt = createdAt ? new Date(createdAt) : null;
          if (removedAt) removedAt.setMonth(removedAt.getMonth() + 3);
          const isBusy = deletingId === listing.id;
          const rowNo = index + 1;
          const phone =
            listing.contactPhone?.trim() ||
            listing.agent?.phone?.trim() ||
            "";

          return (
            <div
              key={listing.id}
              onClick={() => onView(listing.id)}
              className="rounded-2xl border border-[#fff1f9] bg-[#fff9fd] p-2.5"
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-black text-slate-400">
                <span>№ {rowNo}</span>
                {phone ? (
                  <span className="truncate font-bold text-[#1a0b3b]">
                    {phone}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </div>
              <div className="flex gap-2.5">
                <div className="relative h-16 w-20 max-h-16 max-w-20 shrink-0 overflow-hidden rounded-xl bg-[#fff1f9]/40 shadow-sm ring-1 ring-inset ring-[#fff1f9]/50">
                  <SafeImage
                    src={listing.images?.[0]}
                    variant="listingThumb"
                    className="absolute inset-0 size-full max-h-full max-w-full object-cover"
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-black uppercase italic tracking-tight text-[#1a0b3b]">
                    {listing.title}
                  </p>
                  <p className="truncate text-[10px] font-bold uppercase text-[#ff3bad]">
                    {listing.location || listing.district}
                  </p>
                  <p className="mt-1 text-base font-black italic text-[#2a00ff]">
                    {formatPrice(listing.price)}
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-[10px] font-bold">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Нийтэлсэн: {createdAt ? formatDate(createdAt) : "-"}
                </div>
                <div className="flex items-center gap-1.5 text-[#ff3bad]">
                  <CalendarX className="h-3.5 w-3.5" />
                  Дуусах: {removedAt ? formatDate(removedAt) : "-"}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-end gap-1">
                {onEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    className="h-8 shrink-0 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-wide text-[#2a00ff] hover:bg-white"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(listing.id);
                    }}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Засах
                  </Button>
                ) : null}
                {onDelete ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    className="h-8 shrink-0 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-wide text-red-600 hover:bg-white hover:text-red-700"
                    onClick={(event) => {
                      event.stopPropagation();
                      void onDelete(listing.id);
                    }}
                  >
                    {isBusy ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="mr-1 h-3 w-3" />
                    )}
                    Устгах
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden min-w-0 md:block">
        <Table
          className="table-fixed"
          containerClassName="min-w-0 w-full overflow-x-auto"
        >
          <TableHeader className="bg-[#fff9fd]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-9 px-1 text-center font-black uppercase text-[10px] tracking-widest text-[#ff3bad] lg:w-10">
                №
              </TableHead>
              <TableHead className="w-[26%] pl-1 font-black uppercase text-[10px] tracking-widest text-[#ff3bad] lg:pl-2">
                Байршил / Нэр
              </TableHead>
              <TableHead className="w-[12%] font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Үнэ
              </TableHead>
              <TableHead className="w-[14%] font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Утас
              </TableHead>
              <TableHead className="w-[14%] font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Нийтэлсэн
              </TableHead>
              <TableHead className="w-[14%] font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
                Дуусах
              </TableHead>
              <TableHead className="w-[15%] pr-4 text-right font-black uppercase text-[10px] tracking-widest text-[#ff3bad] lg:pr-6">
                Үйлдэл
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing, index) => {
              const createdAt = listing.createdAt
                ? new Date(listing.createdAt)
                : null;
              const removedAt = createdAt ? new Date(createdAt) : null;
              if (removedAt) {
                removedAt.setMonth(removedAt.getMonth() + 3);
              }
              const isBusy = deletingId === listing.id;
              const rowNo = index + 1;
              const phone =
                listing.contactPhone?.trim() ||
                listing.agent?.phone?.trim() ||
                "";

              return (
                <TableRow
                  key={listing.id}
                  onClick={() => !isBusy && onView(listing.id)}
                  className="group cursor-pointer border-b border-[#fff1f9]/70 transition-colors hover:bg-[#fff9fd]"
                >
                  <TableCell className="px-1 py-3 text-center align-middle text-[11px] font-black text-slate-500 lg:text-xs">
                    {rowNo}
                  </TableCell>
                  <TableCell className="min-w-0 whitespace-normal py-3 pl-1 align-middle lg:pl-2">
                    <div className="flex min-w-0 items-center gap-2 lg:gap-3">
                      <div className="relative h-11 w-14 max-h-11 max-w-14 shrink-0 overflow-hidden rounded-lg bg-[#fff1f9]/40 shadow-sm ring-1 ring-inset ring-[#fff1f9]/50 lg:h-12 lg:w-16 lg:max-h-12 lg:max-w-16 lg:rounded-xl">
                        <SafeImage
                          src={listing.images?.[0]}
                          variant="listingThumb"
                          className="absolute inset-0 size-full max-h-full max-w-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-black text-[11px] uppercase italic leading-tight tracking-tighter text-[#1a0b3b] lg:text-sm">
                          {listing.title}
                        </p>
                        <p className="truncate text-[10px] font-bold uppercase text-[#ff3bad] lg:text-xs">
                          {listing.location || listing.district}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="align-middle text-[13px] font-black italic leading-tight text-[#2a00ff] lg:text-base">
                    {formatPrice(listing.price)}
                  </TableCell>

                  <TableCell className="min-w-0 align-middle whitespace-normal break-all text-[10px] font-bold text-[#1a0b3b] lg:text-xs">
                    {phone || "—"}
                  </TableCell>

                  <TableCell className="align-middle whitespace-normal">
                    <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold text-slate-500 lg:gap-2 lg:text-xs">
                      <Clock className="h-3 w-3 shrink-0 text-slate-400 lg:h-3.5 lg:w-3.5" />
                      <span className="min-w-0 break-all">
                        {createdAt ? formatDate(createdAt) : "-"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="align-middle whitespace-normal">
                    <div className="flex flex-wrap items-center gap-1 text-[10px] font-black italic text-[#ff3bad] lg:gap-2 lg:text-xs">
                      <CalendarX className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" />
                      <span className="min-w-0 break-all">
                        {removedAt ? formatDate(removedAt) : "-"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="pr-4 text-right align-middle lg:pr-6">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      {onEdit ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isBusy}
                          className="h-8 shrink-0 rounded-lg px-2 text-[9px] font-black uppercase tracking-wide text-[#2a00ff] hover:bg-white lg:h-9 lg:rounded-xl lg:px-2.5 lg:text-[10px]"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEdit(listing.id);
                          }}
                        >
                          <Pencil className="mr-1 h-3 w-3 lg:mr-1.5 lg:h-3.5 lg:w-3.5" />
                          Засах
                        </Button>
                      ) : null}
                      {onDelete ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isBusy}
                          className="h-8 shrink-0 rounded-lg px-2 text-[9px] font-black uppercase tracking-wide text-red-600 hover:bg-white hover:text-red-700 lg:h-9 lg:rounded-xl lg:px-2.5 lg:text-[10px]"
                          onClick={(event) => {
                            event.stopPropagation();
                            void onDelete(listing.id);
                          }}
                        >
                          {isBusy ? (
                            <Loader2 className="h-3 w-3 animate-spin lg:h-3.5 lg:w-3.5" />
                          ) : (
                            <Trash2 className="mr-1 h-3 w-3 lg:mr-1.5 lg:h-3.5 lg:w-3.5" />
                          )}
                          Устгах
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
