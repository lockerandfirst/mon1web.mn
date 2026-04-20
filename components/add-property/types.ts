export type ServiceType = "self" | "agent";
import type { NearbyService } from "@/lib/data";

export type PaymentMethodOption = "cash" | "mortgage" | "installment";

export type FormData = {
  title: string;
  propertyType: string;
  district: string;
  location: string;
  address: string;
  price: string;
  /** true = төлбөрийн төрөл дурын / тохиролцоно */
  paymentFlexible: boolean;
  /** Сонгосон нөхцлүүд (олон сонголт); paymentFlexible үед хоосон */
  paymentMethods: PaymentMethodOption[];
  sqm: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  totalFloors: string;
  commissionYear: string;
  description: string;
  contactPhone: string;
  serviceType: ServiceType;
  selectedAgentId: string | null;
  surroundings: string[];
  nearbyServices: NearbyService[];
  features: string[];
  imageUrls: string;
  /** Зарын зураг (локал файл) */
  images: File[];
};
