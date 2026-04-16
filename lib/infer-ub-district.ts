import { DISTRICTS } from "@/components/add-property/constants";

type NominatimLike = {
  display_name?: string;
  address?: Record<string, string | undefined>;
};

const DISTRICT_SET = new Set(DISTRICTS);

/** Nominatim / OSM-т ирсэн хаягийн текстээс УБ-ын дүүргийг таамаглана. */
export function inferDistrictFromNominatim(data: NominatimLike): string {
  const parts: string[] = [];
  if (data.display_name) parts.push(data.display_name);
  if (data.address) {
    for (const v of Object.values(data.address)) {
      if (v) parts.push(v);
    }
  }
  const blob = parts.join(" ");
  const lower = blob.toLowerCase();

  for (const district of DISTRICTS) {
    if (lower.includes(district.toLowerCase())) return district;
  }

  const latinHints: { re: RegExp; district: string }[] = [
    { re: /khan[-\s]?uul/i, district: "Хан-Уул" },
    { re: /songinokhairkhan/i, district: "Сонгинохайрхан" },
    { re: /bayanzurkh/i, district: "Баянзүрх" },
    { re: /bayangol/i, district: "Баянгол" },
    { re: /chingeltei/i, district: "Чингэлтэй" },
    {
      re: /(sükhbaatar|sukhbaatar)(\s+district|\s+дүүрэг)/i,
      district: "Сүхбаатар",
    },
  ];

  for (const { re, district } of latinHints) {
    if (re.test(blob) && DISTRICT_SET.has(district)) return district;
  }

  return "";
}
