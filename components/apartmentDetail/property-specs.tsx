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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:border-blue-500 transition-colors"
        >
          <spec.icon className="h-6 w-6 text-blue-600 mb-4" />
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {spec.label}
          </p>
          <p className="text-xl font-black text-slate-900">{spec.val}</p>
        </div>
      ))}
    </div>
  );
}
