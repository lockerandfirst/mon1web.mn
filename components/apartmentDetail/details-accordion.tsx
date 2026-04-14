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

export function DetailsAccordion({ apt }: { apt: Apartment }) {
  const detailItems = [
    { icon: LayoutGrid, label: "Ангилал", value: apt.propertyType },
    { icon: Landmark, label: "Төлбөр", value: apt.paymentMethod },
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
    <div className="space-y-12">
      {/* 1. DESCRIPTION */}
      <section className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
          <Info className="w-6 h-6 text-blue-600" /> Танилцуулга
        </h3>
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 text-lg font-medium leading-relaxed text-slate-600 shadow-sm italic">
          {apt.description}
        </div>
      </section>

      {/* 2. SPECIFIC DETAILS GRID */}
      <section className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
          <Building2 className="w-6 h-6 text-blue-600" /> Дэлгэрэнгүй мэдээлэл
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {detailItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-3xl border border-slate-50 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <item.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>
                <p className="text-base font-black text-slate-900 uppercase italic">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURES TAGS */}
      <section className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
          <Sparkles className="w-6 h-6 text-blue-600" /> Онцлог, боломжууд
        </h3>
        <div className="flex flex-wrap gap-3 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          {apt.features.map((feature, i) => (
            <Badge
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-700"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
