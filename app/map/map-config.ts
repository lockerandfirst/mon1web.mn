import { type Apartment } from "@/lib/data";
import { PROPERTY_CATEGORIES, RENT_SUBCATEGORIES } from "@/lib/property-types";

export type TernaryFilter = "any" | "yes" | "no";
export type PaymentFilter = Apartment["paymentMethod"] | "any";
export type CategoryFilter = (typeof PROPERTY_CATEGORIES)[number]["value"];
export type RentSubcategoryFilter = (typeof RENT_SUBCATEGORIES)[number]["value"] | "any";

export type ActiveFilterBadgeKey =
  | "search"
  | "room"
  | "district"
  | "price"
  | "sqm"
  | "payment"
  | "category"
  | "rentSubcategory"
  | "elevator"
  | "floor"
  | "year"
  | "commissioned";

export type ActiveFilterBadge = {
  key: ActiveFilterBadgeKey;
  label: string;
};

export const CURRENT_YEAR = new Date().getFullYear();
export const MAX_PRICE_MILLION = 1000;
export const MAX_SQM = 500;
export const MAX_FLOOR = 60;
export const MIN_COMMISSION_YEAR = 2000;
export const MAX_COMMISSION_YEAR = CURRENT_YEAR;

export const DISTRICT_OPTIONS = [
  "Сүхбаатар",
  "Хан-Уул",
  "Баянзүрх",
  "Баянгол",
  "Чингэлтэй",
  "Сонгинохайрхан",
] as const;

export const ROOM_OPTIONS = [
  { value: "any", label: "Бүгд" },
  { value: "1", label: "1 өрөө" },
  { value: "2", label: "2 өрөө" },
  { value: "3", label: "3 өрөө" },
  { value: "4+", label: "4+ өрөө" },
] as const;

export const paymentFilterLabels: Record<PaymentFilter, string> = {
  any: "Төлбөр",
  cash: "Бэлэн",
  mortgage: "Ипотек",
  installment: "Хувь лизинг",
};

export const ternaryFilterLabels: Record<TernaryFilter, string> = {
  any: "Хамаагүй",
  yes: "Тийм",
  no: "Үгүй",
};

export const categoryFilterLabels: Record<CategoryFilter, string> = {
  all: "Бүх",
  apartment: "Орон сууц",
  "new-apartment": "Шинэ орон сууц",
  rent: "Түрээс",
  house: "Хаус",
  land: "Газар",
  office: "Оффис",
  barter: "Бартер",
  industrial: "Үйлдвэр",
};
