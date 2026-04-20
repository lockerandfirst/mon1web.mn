import type { Apartment } from "@/lib/data";

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000000000];
export const DEFAULT_SQM_RANGE: [number, number] = [0, 500];

export const DISTRICT_OPTIONS = [
  "Сүхбаатар",
  "Хан-Уул",
  "Баянзүрх",
  "Баянгол",
  "Чингэлтэй",
  "Сонгинохайрхан",
] as const;

export type PaymentFilter = Apartment["paymentMethod"] | "any";

export const paymentFilterLabels: Record<PaymentFilter, string> = {
  any: "Бүгд",
  cash: "Бэлнээр",
  mortgage: "Зээлээр",
  installment: "Лизинг",
};

export function getPriceRangeFromParam(
  priceParam: string | null,
): [number, number] {
  switch (priceParam) {
    case "0-100":
      return [0, 100000000];
    case "100-300":
      return [100000000, 300000000];
    case "500+":
      return [500000000, 1000000000];
    default:
      return DEFAULT_PRICE_RANGE;
  }
}

export function matchesCountFilter(value: number, filterValue: string) {
  if (!filterValue || filterValue === "any") {
    return true;
  }

  if (filterValue.endsWith("+")) {
    const minimumValue = Number.parseInt(filterValue, 10);
    return Number.isFinite(minimumValue) && value >= minimumValue;
  }

  return value === Number.parseInt(filterValue, 10);
}

export function normalizeKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchesKeywordSearch(apartment: Apartment, keyword: string) {
  const normalizedKeyword = normalizeKeyword(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  const searchableContent = [
    apartment.title,
    apartment.location,
    apartment.district,
    apartment.address,
    apartment.description,
    apartment.propertyType,
    apartment.agent.name,
    apartment.agent.company,
    ...apartment.features,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return normalizedKeyword
    .split(" ")
    .every((part) => searchableContent.includes(part));
}
