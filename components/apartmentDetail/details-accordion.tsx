import {
  Info,
  Building2,
  Sparkles,
  MapPin,
  LayoutGrid,
  Landmark,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Apartment } from "@/lib/data";

const paymentLabels: Record<Apartment["paymentMethod"], string> = {
  cash: "Бэлэн",
  mortgage: "Зээл",
  installment: "Лизинг",
  any: "Дурын / тохиролцоно",
};

export function DetailsAccordion({ apt }: { apt: Apartment }) {
  const detailItems = [
    { icon: LayoutGrid, label: "Ангилал", value: apt.propertyType },
    { icon: Landmark, label: "Төлбөр", value: paymentLabels[apt.paymentMethod] },
    {
      icon: Building2,
      label: "Нийт давхар",
      value: `${apt.totalFloors} давхар`,
    },
    {
      icon: CheckCircle2,
      label: "Баталгаажуулалт",
      value: apt.verified ? "Баталгаажсан" : "Шалгаж байна",
    },
    {
      icon: CalendarDays,
      label: "Нийтлэгдсэн",
      value: new Date(apt.createdAt).toLocaleDateString("mn-MN"),
    },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. DESCRIPTION */}
      <section className="space-y-3 md:space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tight text-slate-900 md:gap-3 md:text-2xl">
          <Info className="h-5 w-5 text-blue-600 md:h-6 md:w-6" /> Танилцуулга
        </h3>
        <div className="rounded-4xl border border-slate-100 bg-white p-4 text-sm font-medium italic leading-relaxed text-slate-600 shadow-sm md:rounded-[2.5rem] md:p-8 md:text-lg">
          {apt.description}
        </div>
      </section>

      {/* 2. SPECIFIC DETAILS GRID */}
      <section className="space-y-3 md:space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tight text-slate-900 md:gap-3 md:text-2xl">
          <Building2 className="h-5 w-5 text-blue-600 md:h-6 md:w-6" /> Дэлгэрэнгүй мэдээлэл
        </h3>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
          {detailItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-3xl border border-slate-50 bg-white p-3.5 shadow-sm md:gap-4 md:p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 md:h-12 md:w-12">
                <item.icon className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide text-slate-400 md:text-[10px] md:tracking-widest">
                  {item.label}
                </p>
                <p className="text-sm font-black uppercase italic text-slate-900 md:text-base">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURES TAGS */}
      <section className="space-y-3 md:space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tight text-slate-900 md:gap-3 md:text-2xl">
          <Sparkles className="h-5 w-5 text-blue-600 md:h-6 md:w-6" /> Онцлог, боломжууд
        </h3>
        <div className="flex flex-wrap gap-2 rounded-4xl border border-slate-100 bg-white p-4 shadow-sm md:gap-3 md:rounded-[2.5rem] md:p-6">
          {apt.features.map((feature, i) => (
            <Badge
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-slate-700 md:px-5 md:py-2.5 md:text-[11px] md:tracking-widest"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
