import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Building,
  Building2,
  Bus,
  Dumbbell,
  Factory,
  Home,
  Hospital,
  Landmark,
  Map,
  Pill,
  School,
  ShoppingCart,
  TreePine,
  Trees,
  Utensils,
} from "lucide-react";

import { PROPERTY_CATEGORIES } from "@/lib/property-types";

import type { FormData } from "./types";

export const PROPERTY_TYPE_OPTIONS = PROPERTY_CATEGORIES.filter(
  (item) => item.value !== "all" && item.value !== "barter",
);

export const PROPERTY_TYPE_ICONS: Record<string, LucideIcon> = {
  apartment: Home,
  "new-apartment": Building,
  rent: Banknote,
  house: TreePine,
  land: Map,
  office: Building2,
  industrial: Factory,
  barter: Landmark,
};

export const DISTRICTS = [
  "Хан-Уул",
  "Сүхбаатар",
  "Баянзүрх",
  "Баянгол",
  "Сонгинохайрхан",
  "Чингэлтэй",
];

export const SURROUNDING_OPTIONS = [
  {
    id: "school",
    label: "Сургууль",
    description: "Сургууль, цэцэрлэгтэй ойр байвал гэр бүлд илүү сонирхолтой.",
    icon: School,
  },
  {
    id: "bus",
    label: "Тээвэр",
    description: "Автобус, гол зам ойр байвал үзэлт хурдан нэмэгддэг.",
    icon: Bus,
  },
  {
    id: "shop",
    label: "Дэлгүүр",
    description: "Өдөр тутмын үйлчилгээ ойр байх нь шийдвэрт нөлөөлдөг.",
    icon: ShoppingCart,
  },
  {
    id: "hospital",
    label: "Эмнэлэг",
    description: "Эмнэлэг ойр байх нь аюулгүй байдлыг нэмэгдүүлдэг.",
    icon: Hospital,
  },
  {
    id: "park",
    label: "Парк",
    description: "Ногоон байгууламж ойр бол амьдрах орчин илүү таатай.",
    icon: Trees,
  },
  {
    id: "gym",
    label: "Фитнесс",
    description: "Спорт заал ойр бол эрүүл амьдралд дөхөм.",
    icon: Dumbbell,
  },
  {
    id: "restaurant",
    label: "Ресторан",
    description: "Хоолны газрууд ойр бол амьдрал илүү тухтай.",
    icon: Utensils,
  },
  {
    id: "pharmacy",
    label: "Эмийн сан",
    description: "Эмийн сан ойр байх нь яаралтай үед хэрэгтэй.",
    icon: Pill,
  },
  {
    id: "bank",
    label: "Банк",
    description: "Банк, АТМ ойр бол санхүүгийн үйлчилгээ хялбар.",
    icon: Landmark,
  },
  {
    id: "mall",
    label: "Худалдааны төв",
    description: "Том худалдааны төв ойр бол үнэ цэнэ өсдөг.",
    icon: Building2,
  },
] as const;

export const AMENITY_OPTIONS = [
  "Машины зогсоол",
  "Лефт",
  "Харуул хамгаалалт",
  "Тагт",
  "Халаалт",
  "Агааржуулалт",
  "Агуулах",
  "Фитнесс төв",
  "Цэцэрлэгт хүрээлэн",
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Бэлэн" },
  { value: "mortgage", label: "Зээл" },
  { value: "installment", label: "Лизинг" },
] as const;

/** Add-property & buy-request — same three-step flow (labels + mobile hint). */
export const FORM_STEPS = [
  { step: 1, label: "Төрөл", hint: "Сонгох" },
  { step: 2, label: "Байршил", hint: "Оруулах" },
  { step: 3, label: "Дуусгах", hint: "Илгээх" },
] as const;

export const FEATURE_GUIDE = [
  "Нар үзэлт, цонхны чиглэл",
  "Засвар болон ашиглалтад орсон он",
  "Лифт, зогсоол, харуул хамгаалалт",
  "Сургууль, үйлчилгээний төвийн ойр байдал",
];

export const DEFAULT_FORM: FormData = {
  title: "",
  propertyType: "apartment",
  district: "",
  location: "",
  address: "",
  price: "",
  paymentFlexible: false,
  paymentMethods: ["cash"],
  sqm: "",
  rooms: "2",
  bathrooms: "1",
  floor: "",
  totalFloors: "",
  commissionYear: `${new Date().getFullYear()}`,
  description: "",
  contactPhone: "",
  serviceType: "agent",
  selectedAgentId: null,
  surroundings: [],
  nearbyServices: [],
  features: [],
  imageUrls: "",
  images: [],
};
