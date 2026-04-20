import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Apartment } from "@/lib/data";
import { getPropertyTypeLabel } from "@/lib/property-types";

const paymentMethodLabels = {
  cash: "Бэлэн төлбөр",
  mortgage: "Ипотекийн зээл",
  installment: "Хувь лизинг",
  any: "Дурын / тохиролцоно",
} as const;

export function PropertyHeader({ apt }: { apt: Apartment }) {
  const propertyTypeLabel = getPropertyTypeLabel(apt.propertyType);
  const isCommissioned = apt.commissionYear <= new Date().getFullYear();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Badge className="rounded-full border-none bg-blue-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-white shadow-md shadow-blue-600/20 md:px-5 md:py-2 md:text-[10px] md:tracking-widest md:shadow-lg">
          {propertyTypeLabel}
        </Badge>

        <Badge className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-blue-600 md:px-5 md:py-2 md:text-[10px] md:tracking-widest">
          {paymentMethodLabels[apt.paymentMethod] || "Тохиролцоно"}
        </Badge>

        <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-slate-500 md:px-5 md:py-2 md:text-[10px] md:tracking-widest">
          {isCommissioned ? "Ашиглалтанд орсон" : "Захиалгаар"}
        </Badge>
      </div>

      <h1 className="text-2xl font-black uppercase italic leading-tight tracking-tight text-slate-900 md:text-4xl md:tracking-tighter lg:text-6xl lg:leading-[1.1]">
        {apt.title}
      </h1>

      <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-2.5 font-bold text-slate-500 shadow-sm transition-all hover:shadow-md md:w-fit md:gap-3 md:px-6 md:py-4">
        <MapPin className="h-4 w-4 text-blue-600 md:h-6 md:w-6" />
        <span className="text-sm md:text-lg">
          {apt.address}, {apt.district}
        </span>
      </div>
    </div>
  );
}
