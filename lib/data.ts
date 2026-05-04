export interface Apartment {
  id: string;
  title: string;
  propertyType?: string;
  price: number;
  paymentMethod: "cash" | "mortgage" | "installment" | "any";
  pricePerSqm: number;
  sqm: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  commissionYear: number;
  location: string;
  district: string;
  address: string;
  description: string;
  features: string[];
  images: string[];
  verified: boolean;
  featured: boolean;
  agent: Agent;
  nearbyServices: NearbyService[];
  coordinates: { lat: number; lng: number };
  createdAt: string;
  /** Нийтийн зарын дэлгэрэнгүй үзэлт (backend `view_count`) */
  viewCount?: number;
  /** Зарын мэдээлэлд оруулсан утас (`submitted_by.phone`) */
  contactPhone?: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  company: string;
  rating: number;
  reviewCount: number;
  listingsCount: number;
  verified: boolean;
}

export interface NearbyService {
  type: "school" | "supermarket" | "bus" | "hospital";
  name: string;
  distance: string;
  walkTime: string;
}

/** Үнэ — Монгол локаль + төгрөг тэмдэгт (UI-д нэгдсэн формат). */
export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    const b = price / 1_000_000_000;
    return `${b.toLocaleString("mn-MN", { maximumFractionDigits: 1 })} тэрбум ₮`;
  }
  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return `${m.toLocaleString("mn-MN", { maximumFractionDigits: m >= 100 ? 0 : 1 })} сая ₮`;
  }
  return `${price.toLocaleString("mn-MN")} ₮`;
}
