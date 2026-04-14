import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Apartment } from "@/lib/data";
import { getPropertyTypeLabel } from "@/lib/property-types";

const paymentMethodLabels = {
  cash: "Бэлэн төлбөр",
  mortgage: "Ипотекийн зээл",
  installment: "Хувь лизинг",
} as const;

export function PropertyHeader({ apt }: { apt: Apartment }) {
  const propertyTypeLabel = getPropertyTypeLabel(apt.propertyType);
  const isCommissioned = apt.commissionYear <= new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="rounded-full border-none bg-blue-600 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20">
          {propertyTypeLabel}
        </Badge>

        <Badge className="rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
          {paymentMethodLabels[apt.paymentMethod] || "Тохиролцоно"}
        </Badge>

        <Badge className="rounded-full border border-slate-200 bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {isCommissioned ? "Ашиглалтанд орсон" : "Захиалгаар"}
        </Badge>
      </div>

      <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] uppercase italic">
        {apt.title}
      </h1>

      <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-4 text-slate-500 font-bold shadow-sm transition-all hover:shadow-md">
        <MapPin className="w-6 h-6 text-blue-600" />
        <span className="text-lg">
          {apt.address}, {apt.district}
        </span>
      </div>
    </div>
  );
}
