import { Bed, Maximize2, Building, Bath } from "lucide-react";
import { Apartment } from "@/lib/data";

export function PropertySpecs({ apt }: { apt: Apartment }) {
  const specs = [
    { icon: Bed, label: "ӨРӨӨ", val: apt.rooms },
    { icon: Maximize2, label: "ТАЛБАЙ", val: `${apt.sqm} м²` },
    { icon: Building, label: "ДАВХАР", val: apt.floor },
    { icon: Bath, label: "АРИУН ЦЭВЭР", val: apt.bathrooms },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="rounded-3xl border border-slate-100 bg-white p-3 shadow-sm transition-colors hover:border-blue-500 md:rounded-[2.5rem] md:p-6"
        >
          <spec.icon className="mb-2 h-4 w-4 text-blue-600 md:mb-4 md:h-6 md:w-6" />
          <p className="text-[8px] font-black uppercase tracking-wide text-slate-400 md:text-[9px] md:tracking-widest">
            {spec.label}
          </p>
          <p className="text-base font-black text-slate-900 md:text-xl">{spec.val}</p>
        </div>
      ))}
    </div>
  );
}
