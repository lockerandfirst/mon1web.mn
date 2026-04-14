import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, CalendarX } from "lucide-react";
import { formatPrice } from "@/lib/data";

interface ListingTableProps {
  listings: any[];
  onView: (id: string) => void;
}

export function ListingTable({ listings, onView }: ListingTableProps) {
  return (
    <Table>
      <TableHeader className="bg-[#fff9fd]">
        <TableRow className="hover:bg-transparent border-none">
          <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
            Байршил / Нэр
          </TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
            Үнэ
          </TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
            Нийтэлсэн
          </TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
            Дуусах хугацаа
          </TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
            Төлөв
          </TableHead>
          <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest text-[#ff3bad]">
            Үйлдэл
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => {
          // Logic for 3-month removal
          const createdAt = listing.createdAt
            ? new Date(listing.createdAt)
            : new Date();
          const removedAt = new Date(createdAt);
          removedAt.setMonth(removedAt.getMonth() + 3);

          const formatDate = (date: Date) =>
            date.toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

          return (
            <TableRow
              key={listing.id}
              onClick={() => onView(listing.id)}
              className="group cursor-pointer border-b border-[#fff1f9] transition-colors hover:bg-[#fff9fd]"
            >
              <TableCell className="pl-8 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.images[0]}
                    className="w-16 h-12 rounded-xl object-cover shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="font-black text-[#1a0b3b] uppercase italic tracking-tighter text-sm">
                      {listing.title}
                    </p>
                    <p className="text-xs text-[#ff3bad] font-bold uppercase">
                      {listing.location || listing.district}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="font-black text-[#2a00ff] italic text-lg">
                {formatPrice(listing.price)}
              </TableCell>

              {/* Time Posted */}
              <TableCell>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {formatDate(createdAt)}
                </div>
              </TableCell>

              {/* Will be Removed */}
              <TableCell>
                <div className="flex items-center gap-2 text-[#ff3bad] font-black text-xs italic">
                  <CalendarX className="h-3.5 w-3.5" />
                  {formatDate(removedAt)}
                </div>
              </TableCell>

              <TableCell>
                <Badge className="bg-[#eeebff] text-[#2a00ff] border-none rounded-lg px-3 py-1 font-black text-[10px] tracking-widest">
                  ИДЭВХТЭЙ
                </Badge>
              </TableCell>

              <TableCell className="text-right pr-8">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl px-4 font-black text-[10px] uppercase tracking-widest text-[#ff3bad] hover:text-[#2a00ff] hover:bg-white hover:shadow-md"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Үзэх
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
