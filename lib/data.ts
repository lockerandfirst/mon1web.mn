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

export const apartments: Apartment[] = [
  {
    id: "1",
    title: "Modern 3-Bedroom Apartment in Zaisan",
    propertyType: "apartment",
    price: 280000000,
    paymentMethod: "mortgage",
    pricePerSqm: 3500000,
    sqm: 80,
    rooms: 3,
    bathrooms: 2,
    floor: 12,
    totalFloors: 16,
    commissionYear: 2021,
    location: "Zaisan",
    district: "Хан-Уул",
    address: "Zaisan Valley, Building 24, Apt 1201",
    description:
      "Luxurious modern apartment with stunning mountain views. Recently renovated with premium finishes including hardwood floors, marble countertops, and smart home features. The building offers 24/7 security, underground parking, and a fitness center.",
    features: [
      "Parking",
      "Elevator",
      "Security",
      "Balcony",
      "Heating",
      "Air Conditioning",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a1",
      name: "Bat-Erdene Ganbaatar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9911 2233",
      email: "baterdene@mon1.mn",
      company: "Elite Properties Mongolia",
      rating: 4.9,
      reviewCount: 127,
      listingsCount: 45,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "American School of Ulaanbaatar",
        distance: "800m",
        walkTime: "10 min",
      },
      {
        type: "supermarket",
        name: "Nomin Supermarket",
        distance: "400m",
        walkTime: "5 min",
      },
      {
        type: "bus",
        name: "Zaisan Bus Stop",
        distance: "200m",
        walkTime: "3 min",
      },
      {
        type: "hospital",
        name: "Intermed Hospital",
        distance: "1.2km",
        walkTime: "15 min",
      },
    ],
    coordinates: { lat: 47.8764, lng: 106.9057 },
    createdAt: "2024-01-15",
  },

  {
    id: "2",
    title: "Cozy 2-Bedroom in Central Sukhbaatar",
    propertyType: "apartment",
    price: 195000000,
    paymentMethod: "cash",
    pricePerSqm: 3250000,
    sqm: 60,
    rooms: 2,
    bathrooms: 1,
    floor: 8,
    totalFloors: 12,
    commissionYear: 2018,
    location: "Sukhbaatar Square",
    district: "Сүхбаатар",
    address: "Peace Avenue 15, Building B, Apt 802",
    description:
      "Perfect city center location with easy access to shops, restaurants, and public transportation. The apartment features an open floor plan, large windows with city views, and modern appliances.",
    features: ["Elevator", "Security", "Heating", "Storage"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a2",
      name: "Oyungerel Munkhbat",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9922 3344",
      email: "oyungerel@mon1.mn",
      company: "City Center Realty",
      rating: 4.8,
      reviewCount: 89,
      listingsCount: 32,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "School #1",
        distance: "500m",
        walkTime: "6 min",
      },
      {
        type: "supermarket",
        name: "State Department Store",
        distance: "300m",
        walkTime: "4 min",
      },
      {
        type: "bus",
        name: "Central Bus Station",
        distance: "100m",
        walkTime: "1 min",
      },
      {
        type: "hospital",
        name: "SOS Medica",
        distance: "800m",
        walkTime: "10 min",
      },
    ],
    coordinates: { lat: 47.9187, lng: 106.9176 },
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Spacious 4-Bedroom Family Home",
    propertyType: "house",
    price: 450000000,
    paymentMethod: "installment",
    pricePerSqm: 3750000,
    sqm: 120,
    rooms: 4,
    bathrooms: 2,
    floor: 5,
    totalFloors: 9,
    commissionYear: 2026,
    location: "Yarmag",
    district: "Хан-Уул",
    address: "Yarmag Road, Royal Complex, Apt 501",
    description:
      "Ideal family home with generous living spaces. Master bedroom with en-suite bathroom, separate children's rooms, and a dedicated home office space. Premium kitchen with European appliances.",
    features: [
      "Parking",
      "Elevator",
      "Security",
      "Balcony",
      "Heating",
      "Air Conditioning",
      "Garden Access",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a1",
      name: "Bat-Erdene Ganbaatar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9911 2233",
      email: "baterdene@mon1.mn",
      company: "Elite Properties Mongolia",
      rating: 4.9,
      reviewCount: 127,
      listingsCount: 45,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "International School of Ulaanbaatar",
        distance: "1km",
        walkTime: "12 min",
      },
      {
        type: "supermarket",
        name: "Good Price Supermarket",
        distance: "600m",
        walkTime: "8 min",
      },
      {
        type: "bus",
        name: "Yarmag Station",
        distance: "300m",
        walkTime: "4 min",
      },
      {
        type: "hospital",
        name: "Grand Med Hospital",
        distance: "1.5km",
        walkTime: "18 min",
      },
    ],
    coordinates: { lat: 47.8923, lng: 106.8934 },
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    title: "Studio Apartment near University",
    propertyType: "apartment",
    price: 85000000,
    paymentMethod: "cash",
    pricePerSqm: 2833333,
    sqm: 30,
    rooms: 1,
    bathrooms: 1,
    floor: 3,
    totalFloors: 5,
    commissionYear: 2016,
    location: "13th Microdistrict",
    district: "Баянзүрх",
    address: "University Street 5, Apt 302",
    description:
      "Perfect for students or young professionals. Compact but efficient layout with modern furnishings. Walking distance to National University of Mongolia.",
    features: ["Heating", "Internet Included"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: false,
    featured: false,
    agent: {
      id: "a3",
      name: "Temuulen Bold",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9933 4455",
      email: "temuulen@mon1.mn",
      company: "Student Housing Co.",
      rating: 4.5,
      reviewCount: 45,
      listingsCount: 28,
      verified: false,
    },
    nearbyServices: [
      {
        type: "school",
        name: "National University of Mongolia",
        distance: "300m",
        walkTime: "4 min",
      },
      {
        type: "supermarket",
        name: "E-Mart",
        distance: "500m",
        walkTime: "6 min",
      },
      {
        type: "bus",
        name: "13th District Stop",
        distance: "150m",
        walkTime: "2 min",
      },
      {
        type: "hospital",
        name: "District Clinic",
        distance: "700m",
        walkTime: "9 min",
      },
    ],
    coordinates: { lat: 47.9234, lng: 106.9345 },
    createdAt: "2024-01-22",
  },
  {
    id: "5",
    title: "Luxury Penthouse with Panoramic Views",
    propertyType: "apartment",
    price: 750000000,
    paymentMethod: "cash",
    pricePerSqm: 5000000,
    sqm: 150,
    rooms: 4,
    bathrooms: 3,
    floor: 20,
    totalFloors: 20,
    commissionYear: 2023,
    location: "Central Tower",
    district: "Сүхбаатар",
    address: "Peace Avenue 17, Penthouse",
    description:
      "Exclusive penthouse offering 360-degree views of the city and mountains. Private elevator access, rooftop terrace, and premium smart home automation throughout.",
    features: [
      "Private Parking",
      "Private Elevator",
      "24/7 Security",
      "Rooftop Terrace",
      "Heating",
      "Air Conditioning",
      "Smart Home",
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a4",
      name: "Enkhjargal Dorj",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9944 5566",
      email: "enkhjargal@mon1.mn",
      company: "Luxury Homes Mongolia",
      rating: 5.0,
      reviewCount: 67,
      listingsCount: 15,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "British School of Ulaanbaatar",
        distance: "1.2km",
        walkTime: "15 min",
      },
      {
        type: "supermarket",
        name: "Premium Foods",
        distance: "200m",
        walkTime: "3 min",
      },
      {
        type: "bus",
        name: "Central Tower Stop",
        distance: "50m",
        walkTime: "1 min",
      },
      {
        type: "hospital",
        name: "UB Hospital",
        distance: "600m",
        walkTime: "8 min",
      },
    ],
    coordinates: { lat: 47.9176, lng: 106.9187 },
    createdAt: "2024-01-10",
  },
  {
    id: "6",
    title: "Newly Built 2-Bedroom in Selbe",
    propertyType: "new-apartment",
    price: 165000000,
    paymentMethod: "mortgage",
    pricePerSqm: 3000000,
    sqm: 55,
    rooms: 2,
    bathrooms: 1,
    floor: 6,
    totalFloors: 10,
    commissionYear: 2027,
    location: "Selbe",
    district: "Чингэлтэй",
    address: "Selbe River Road, Green Building, Apt 605",
    description:
      "Brand new apartment in a recently completed development. Modern design, energy-efficient windows, and eco-friendly materials throughout.",
    features: [
      "Elevator",
      "Security",
      "Heating",
      "Balcony",
      "Underground Parking",
    ],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a2",
      name: "Oyungerel Munkhbat",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9922 3344",
      email: "oyungerel@mon1.mn",
      company: "City Center Realty",
      rating: 4.8,
      reviewCount: 89,
      listingsCount: 32,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "Selbe Primary School",
        distance: "400m",
        walkTime: "5 min",
      },
      {
        type: "supermarket",
        name: "Nomin Market",
        distance: "350m",
        walkTime: "4 min",
      },
      {
        type: "bus",
        name: "Selbe Bridge Stop",
        distance: "250m",
        walkTime: "3 min",
      },
      {
        type: "hospital",
        name: "Health Center #3",
        distance: "900m",
        walkTime: "11 min",
      },
    ],
    coordinates: { lat: 47.9312, lng: 106.8987 },
    createdAt: "2024-01-25",
  },
  {
    id: "7",
    title: "Fully Furnished 2-Room Apartment Rent in Baga Toiruu",
    propertyType: "rent",
    price: 1800000,
    paymentMethod: "cash",
    pricePerSqm: 30000,
    sqm: 60,
    rooms: 2,
    bathrooms: 1,
    floor: 4,
    totalFloors: 9,
    commissionYear: 2019,
    location: "Baga Toiruu",
    district: "Сүхбаатар",
    address: "Baga Toiruu 42, Apt 403",
    description:
      "Бүрэн тавилгатай байрны түрээс. Их сургууль, төв зам, дэлгүүрүүдтэй ойр, богино хугацаанд нүүхэд бэлэн.",
    features: ["Heating", "Furnished", "Security", "Internet Included"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a3",
      name: "Temuulen Bold",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9933 4455",
      email: "temuulen@mon1.mn",
      company: "Student Housing Co.",
      rating: 4.5,
      reviewCount: 45,
      listingsCount: 28,
      verified: false,
    },
    nearbyServices: [
      {
        type: "school",
        name: "NUM Campus",
        distance: "450m",
        walkTime: "6 min",
      },
      {
        type: "supermarket",
        name: "CU Store",
        distance: "120m",
        walkTime: "2 min",
      },
      {
        type: "bus",
        name: "Baga Toiruu Stop",
        distance: "180m",
        walkTime: "3 min",
      },
      {
        type: "hospital",
        name: "Shastin Hospital",
        distance: "1.4km",
        walkTime: "18 min",
      },
    ],
    coordinates: { lat: 47.9209, lng: 106.9208 },
    createdAt: "2024-02-02",
  },
  {
    id: "8",
    title: "Modern Office Space in Khan-Uul Business Center",
    propertyType: "office",
    price: 320000000,
    paymentMethod: "mortgage",
    pricePerSqm: 4000000,
    sqm: 80,
    rooms: 4,
    bathrooms: 1,
    floor: 7,
    totalFloors: 14,
    commissionYear: 2022,
    location: "Misheel City",
    district: "Хан-Уул",
    address: "Misheel Business Tower, Floor 7",
    description:
      "Bright office with open workspace, meeting room, reception area, and strong road access. Suitable for agencies, startups, or consulting firms.",
    features: [
      "Elevator",
      "Parking",
      "Reception",
      "Security",
      "Air Conditioning",
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a2",
      name: "Oyungerel Munkhbat",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9922 3344",
      email: "oyungerel@mon1.mn",
      company: "City Center Realty",
      rating: 4.8,
      reviewCount: 89,
      listingsCount: 32,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "Hobby School",
        distance: "900m",
        walkTime: "11 min",
      },
      {
        type: "supermarket",
        name: "Misheel Walk Mall",
        distance: "300m",
        walkTime: "4 min",
      },
      {
        type: "bus",
        name: "Misheel Bus Stop",
        distance: "140m",
        walkTime: "2 min",
      },
      {
        type: "hospital",
        name: "Intermed Hospital",
        distance: "2.2km",
        walkTime: "25 min",
      },
    ],
    coordinates: { lat: 47.8828, lng: 106.9051 },
    createdAt: "2024-02-05",
  },
  {
    id: "9",
    title: "Secure Garage for Sale in Bayangol",
    propertyType: "garage",
    price: 45000000,
    paymentMethod: "cash",
    pricePerSqm: 2500000,
    sqm: 18,
    rooms: 1,
    bathrooms: 1,
    floor: 1,
    totalFloors: 1,
    commissionYear: 2020,
    location: "10th Microdistrict",
    district: "Баянгол",
    address: "10th Microdistrict Garage Complex, Unit 18",
    description:
      "Enclosed garage with security gate access, lighting, and winter-ready insulation. Convenient for downtown commuters.",
    features: ["Security", "Lighting", "Gated Access"],
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a1",
      name: "Bat-Erdene Ganbaatar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9911 2233",
      email: "baterdene@mon1.mn",
      company: "Elite Properties Mongolia",
      rating: 4.9,
      reviewCount: 127,
      listingsCount: 45,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "School #28",
        distance: "700m",
        walkTime: "9 min",
      },
      {
        type: "supermarket",
        name: "Nomin Hypermarket",
        distance: "500m",
        walkTime: "6 min",
      },
      {
        type: "bus",
        name: "10th District Stop",
        distance: "160m",
        walkTime: "2 min",
      },
      {
        type: "hospital",
        name: "Railway Hospital",
        distance: "1.1km",
        walkTime: "14 min",
      },
    ],
    coordinates: { lat: 47.9141, lng: 106.8752 },
    createdAt: "2024-02-09",
  },
  {
    id: "10",
    title: "Development Land Near Nisekh",
    propertyType: "land",
    price: 210000000,
    paymentMethod: "installment",
    pricePerSqm: 262500,
    sqm: 800,
    rooms: 1,
    bathrooms: 1,
    floor: 1,
    totalFloors: 1,
    commissionYear: 2025,
    location: "Nisekh",
    district: "Хан-Уул",
    address: "Nisekh Road, Plot 27",
    description:
      "Flat development land with paved-road access, utility connections nearby, and strong long-term value for residential or warehouse projects.",
    features: ["Road Access", "Utility Nearby", "Fenced"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: false,
    featured: false,
    agent: {
      id: "a4",
      name: "Enkhjargal Dorj",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9944 5566",
      email: "enkhjargal@mon1.mn",
      company: "Luxury Homes Mongolia",
      rating: 5.0,
      reviewCount: 67,
      listingsCount: 15,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "Nisekh School",
        distance: "1.5km",
        walkTime: "18 min",
      },
      {
        type: "supermarket",
        name: "Nisekh Market",
        distance: "900m",
        walkTime: "11 min",
      },
      {
        type: "bus",
        name: "Airport Road Stop",
        distance: "220m",
        walkTime: "3 min",
      },
      {
        type: "hospital",
        name: "Intermed Hospital",
        distance: "3.8km",
        walkTime: "40 min",
      },
    ],
    coordinates: { lat: 47.8472, lng: 106.8138 },
    createdAt: "2024-02-12",
  },
  {
    id: "11",
    title: "Brand New 3-Room Apartment in Yarmag Residence",
    propertyType: "new-apartment",
    price: 235000000,
    paymentMethod: "mortgage",
    pricePerSqm: 3357143,
    sqm: 70,
    rooms: 3,
    bathrooms: 2,
    floor: 9,
    totalFloors: 16,
    commissionYear: 2027,
    location: "Yarmag Residence",
    district: "Хан-Уул",
    address: "Yarmag Main Road, Block C, Apt 903",
    description:
      "Шинэ орон сууц, том цонхтой, хүүхдийн тоглоомын талбай болон underground parking-той. Ипотекийн нөхцөл боломжтой.",
    features: ["Elevator", "Balcony", "Security", "Underground Parking"],
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a2",
      name: "Oyungerel Munkhbat",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9922 3344",
      email: "oyungerel@mon1.mn",
      company: "City Center Realty",
      rating: 4.8,
      reviewCount: 89,
      listingsCount: 32,
      verified: true,
    },
    nearbyServices: [
      {
        type: "school",
        name: "Yarmag School Campus",
        distance: "550m",
        walkTime: "7 min",
      },
      {
        type: "supermarket",
        name: "Orgil Supermarket",
        distance: "300m",
        walkTime: "4 min",
      },
      {
        type: "bus",
        name: "Yarmag Main Stop",
        distance: "130m",
        walkTime: "2 min",
      },
      {
        type: "hospital",
        name: "Grand Med Hospital",
        distance: "1.1km",
        walkTime: "14 min",
      },
    ],
    coordinates: { lat: 47.8888, lng: 106.8998 },
    createdAt: "2024-02-15",
  },
];

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Bat-Erdene Ganbaatar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9911 2233",
    email: "baterdene@mon1.mn",
    company: "Elite Properties Mongolia",
    rating: 4.9,
    reviewCount: 127,
    listingsCount: 45,
    verified: true,
  },
  {
    id: "a2",
    name: "Oyungerel Munkhbat",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9922 3344",
    email: "oyungerel@mon1.mn",
    company: "City Center Realty",
    rating: 4.8,
    reviewCount: 89,
    listingsCount: 32,
    verified: true,
  },
  {
    id: "a3",
    name: "Temuulen Bold",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9933 4455",
    email: "temuulen@mon1.mn",
    company: "Student Housing Co.",
    rating: 4.5,
    reviewCount: 45,
    listingsCount: 28,
    verified: false,
  },
  {
    id: "a4",
    name: "Enkhjargal Dorj",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9944 5566",
    email: "enkhjargal@mon1.mn",
    company: "Luxury Homes Mongolia",
    rating: 5.0,
    reviewCount: 67,
    listingsCount: 15,
    verified: true,
  },
];

export function formatPrice(price: number): string {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)}B MNT`;
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)}M MNT`;
  }
  return `${price.toLocaleString()} MNT`;
}
const DISTRICTS = [
  "Хан-Уул",
  "Сүхбаатар",
  "Баянзүрх",
  "Баянгол",
  "Сонгинохайрхан",
  "Чингэлтэй",
  "бүх дүүрэг",
];
