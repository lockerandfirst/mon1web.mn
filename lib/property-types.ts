import { LISTING_IMAGE_FALLBACK } from "@/lib/image-fallbacks";

export const PROPERTY_CATEGORIES = [
  { value: "all", label: "Бүх" },
  { value: "apartment", label: "Орон сууц" },
  { value: "new-apartment", label: "Шинэ орон сууц" },
  { value: "rent", label: "Түрээс" },
  { value: "house", label: "Хаус" },
  { value: "land", label: "Газар" },
  { value: "office", label: "Оффис" },
  { value: "barter", label: "Бартер" },
  { value: "industrial", label: "Үйлдвэр" },
] as const;

type PropertyCategoryOption = (typeof PROPERTY_CATEGORIES)[number];

export const RENT_SUBCATEGORIES = [
  { value: "apartment-rent", label: "Байрны түрээс" },
  { value: "room-rent", label: "Өрөө түрээс" },
  { value: "house-rent", label: "Хаус түрээс" },
  { value: "office-rent", label: "Оффис түрээс" },
  { value: "work-rent", label: "Ажлын байр түрээс" },
] as const;

export type FilterPropertyCategory = PropertyCategoryOption["value"];
export type PropertyCategory = Exclude<FilterPropertyCategory, "all">;
export type RentSubcategory = (typeof RENT_SUBCATEGORIES)[number]["value"];

export const LISTING_PROPERTY_CATEGORIES = PROPERTY_CATEGORIES.filter(
  (
    category,
  ): category is Extract<PropertyCategoryOption, { value: PropertyCategory }> =>
    category.value !== "all",
);

const PROPERTY_CATEGORY_SET = new Set<PropertyCategory>(
  LISTING_PROPERTY_CATEGORIES.map((category) => category.value),
);

const RENT_SUBCATEGORY_SET = new Set<RentSubcategory>(
  RENT_SUBCATEGORIES.map((category) => category.value),
);

export function isPropertyCategory(value: string): value is PropertyCategory {
  return PROPERTY_CATEGORY_SET.has(value as PropertyCategory);
}

export function isRentSubcategory(value: string): value is RentSubcategory {
  return RENT_SUBCATEGORY_SET.has(value as RentSubcategory);
}

export function getPropertyTypeLabel(propertyType?: string) {
  switch (propertyType) {
    case "new-apartment":
      return "шинэ орон сууц";
    case "rent":
      return "түрээс";
    case "house":
      return "хаус";
    case "land":
      return "газар";
    case "office":
      return "оффис";
    case "industrial":
      return "үйлдвэр";
    case "barter":
      return "бартер";
    default:
      return "орон сууц";
  }
}

/** Зураггүй эсвэл алдаатай URL-д — төслийн нэгтгэсэн local fallback. */
export function getPlaceholderImage(_propertyType?: string) {
  return LISTING_IMAGE_FALLBACK;
}

export function inferPropertyCategory(listing: {
  propertyType?: string;
  title?: string;
  description?: string;
}) {
  if (listing.propertyType && isPropertyCategory(listing.propertyType)) {
    return listing.propertyType;
  }

  const searchableText =
    `${listing.title ?? ""} ${listing.description ?? ""}`.toLowerCase();

  if (searchableText.includes("түрээс") || searchableText.includes("rent")) {
    return "rent";
  }

  if (
    searchableText.includes("new apartment") ||
    searchableText.includes("brand new") ||
    searchableText.includes("шинэ")
  ) {
    return "new-apartment";
  }

  if (searchableText.includes("office") || searchableText.includes("оффис")) {
    return "office";
  }

  if (searchableText.includes("barter") || searchableText.includes("бартер")) {
    return "barter";
  }

  if (
    searchableText.includes("industrial") ||
    searchableText.includes("factory") ||
    searchableText.includes("warehouse") ||
    searchableText.includes("үйлдвэр")
  ) {
    return "industrial";
  }

  if (searchableText.includes("land") || searchableText.includes("газар")) {
    return "land";
  }

  if (
    searchableText.includes("house") ||
    searchableText.includes("home") ||
    searchableText.includes("villa") ||
    searchableText.includes("haush") ||
    searchableText.includes("хаус") ||
    searchableText.includes("байшин")
  ) {
    return "house";
  }

  return "apartment";
}

export function inferRentSubcategory(listing: {
  propertyType?: string;
  title?: string;
  description?: string;
}) {
  if (inferPropertyCategory(listing) !== "rent") {
    return null;
  }

  const searchableText =
    `${listing.title ?? ""} ${listing.description ?? ""}`.toLowerCase();

  if (
    searchableText.includes("нийтийн байр") ||
    searchableText.includes("shared housing") ||
    searchableText.includes("shared room")
  ) {
    return "shared-housing";
  }

  if (
    searchableText.includes("өрөө") ||
    searchableText.includes("room rent") ||
    searchableText.includes("room for rent")
  ) {
    return "room-rent";
  }

  if (
    searchableText.includes("хаус") ||
    searchableText.includes("house rent") ||
    searchableText.includes("байшин түрээс")
  ) {
    return "house-rent";
  }

  if (
    searchableText.includes("оффис") ||
    searchableText.includes("office rent")
  ) {
    return "office-rent";
  }

  if (
    searchableText.includes("гараж") ||
    searchableText.includes("garage rent")
  ) {
    return "garage-rent";
  }

  return "apartment-rent";
}
