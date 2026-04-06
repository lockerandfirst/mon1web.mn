export interface Apartment {
  id: string
  title: string
  price: number
  pricePerSqm: number
  sqm: number
  rooms: number
  bathrooms: number
  floor: number
  totalFloors: number
  location: string
  district: string
  address: string
  description: string
  features: string[]
  images: string[]
  verified: boolean
  featured: boolean
  agent: Agent
  nearbyServices: NearbyService[]
  coordinates: { lat: number; lng: number }
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  avatar: string
  phone: string
  email: string
  company: string
  rating: number
  reviewCount: number
  listingsCount: number
  verified: boolean
}

export interface NearbyService {
  type: "school" | "supermarket" | "bus" | "hospital"
  name: string
  distance: string
  walkTime: string
}

export const apartments: Apartment[] = [
  {
    id: "1",
    title: "Modern 3-Bedroom Apartment in Zaisan",
    price: 280000000,
    pricePerSqm: 3500000,
    sqm: 80,
    rooms: 3,
    bathrooms: 2,
    floor: 12,
    totalFloors: 16,
    location: "Zaisan",
    district: "Khan-Uul",
    address: "Zaisan Valley, Building 24, Apt 1201",
    description: "Luxurious modern apartment with stunning mountain views. Recently renovated with premium finishes including hardwood floors, marble countertops, and smart home features. The building offers 24/7 security, underground parking, and a fitness center.",
    features: ["Parking", "Elevator", "Security", "Balcony", "Heating", "Air Conditioning"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a1",
      name: "Bat-Erdene Ganbaatar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9911 2233",
      email: "baterdene@mon1.mn",
      company: "Elite Properties Mongolia",
      rating: 4.9,
      reviewCount: 127,
      listingsCount: 45,
      verified: true
    },
    nearbyServices: [
      { type: "school", name: "American School of Ulaanbaatar", distance: "800m", walkTime: "10 min" },
      { type: "supermarket", name: "Nomin Supermarket", distance: "400m", walkTime: "5 min" },
      { type: "bus", name: "Zaisan Bus Stop", distance: "200m", walkTime: "3 min" },
      { type: "hospital", name: "Intermed Hospital", distance: "1.2km", walkTime: "15 min" }
    ],
    coordinates: { lat: 47.8764, lng: 106.9057 },
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Cozy 2-Bedroom in Central Sukhbaatar",
    price: 195000000,
    pricePerSqm: 3250000,
    sqm: 60,
    rooms: 2,
    bathrooms: 1,
    floor: 8,
    totalFloors: 12,
    location: "Sukhbaatar Square",
    district: "Sukhbaatar",
    address: "Peace Avenue 15, Building B, Apt 802",
    description: "Perfect city center location with easy access to shops, restaurants, and public transportation. The apartment features an open floor plan, large windows with city views, and modern appliances.",
    features: ["Elevator", "Security", "Heating", "Storage"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a2",
      name: "Oyungerel Munkhbat",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9922 3344",
      email: "oyungerel@mon1.mn",
      company: "City Center Realty",
      rating: 4.8,
      reviewCount: 89,
      listingsCount: 32,
      verified: true
    },
    nearbyServices: [
      { type: "school", name: "School #1", distance: "500m", walkTime: "6 min" },
      { type: "supermarket", name: "State Department Store", distance: "300m", walkTime: "4 min" },
      { type: "bus", name: "Central Bus Station", distance: "100m", walkTime: "1 min" },
      { type: "hospital", name: "SOS Medica", distance: "800m", walkTime: "10 min" }
    ],
    coordinates: { lat: 47.9187, lng: 106.9176 },
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    title: "Spacious 4-Bedroom Family Home",
    price: 450000000,
    pricePerSqm: 3750000,
    sqm: 120,
    rooms: 4,
    bathrooms: 2,
    floor: 5,
    totalFloors: 9,
    location: "Yarmag",
    district: "Khan-Uul",
    address: "Yarmag Road, Royal Complex, Apt 501",
    description: "Ideal family home with generous living spaces. Master bedroom with en-suite bathroom, separate children's rooms, and a dedicated home office space. Premium kitchen with European appliances.",
    features: ["Parking", "Elevator", "Security", "Balcony", "Heating", "Air Conditioning", "Garden Access"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a1",
      name: "Bat-Erdene Ganbaatar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9911 2233",
      email: "baterdene@mon1.mn",
      company: "Elite Properties Mongolia",
      rating: 4.9,
      reviewCount: 127,
      listingsCount: 45,
      verified: true
    },
    nearbyServices: [
      { type: "school", name: "International School of Ulaanbaatar", distance: "1km", walkTime: "12 min" },
      { type: "supermarket", name: "Good Price Supermarket", distance: "600m", walkTime: "8 min" },
      { type: "bus", name: "Yarmag Station", distance: "300m", walkTime: "4 min" },
      { type: "hospital", name: "Grand Med Hospital", distance: "1.5km", walkTime: "18 min" }
    ],
    coordinates: { lat: 47.8923, lng: 106.8934 },
    createdAt: "2024-01-18"
  },
  {
    id: "4",
    title: "Studio Apartment near University",
    price: 85000000,
    pricePerSqm: 2833333,
    sqm: 30,
    rooms: 1,
    bathrooms: 1,
    floor: 3,
    totalFloors: 5,
    location: "13th Microdistrict",
    district: "Bayanzurkh",
    address: "University Street 5, Apt 302",
    description: "Perfect for students or young professionals. Compact but efficient layout with modern furnishings. Walking distance to National University of Mongolia.",
    features: ["Heating", "Internet Included"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    verified: false,
    featured: false,
    agent: {
      id: "a3",
      name: "Temuulen Bold",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9933 4455",
      email: "temuulen@mon1.mn",
      company: "Student Housing Co.",
      rating: 4.5,
      reviewCount: 45,
      listingsCount: 28,
      verified: false
    },
    nearbyServices: [
      { type: "school", name: "National University of Mongolia", distance: "300m", walkTime: "4 min" },
      { type: "supermarket", name: "E-Mart", distance: "500m", walkTime: "6 min" },
      { type: "bus", name: "13th District Stop", distance: "150m", walkTime: "2 min" },
      { type: "hospital", name: "District Clinic", distance: "700m", walkTime: "9 min" }
    ],
    coordinates: { lat: 47.9234, lng: 106.9345 },
    createdAt: "2024-01-22"
  },
  {
    id: "5",
    title: "Luxury Penthouse with Panoramic Views",
    price: 750000000,
    pricePerSqm: 5000000,
    sqm: 150,
    rooms: 4,
    bathrooms: 3,
    floor: 20,
    totalFloors: 20,
    location: "Central Tower",
    district: "Sukhbaatar",
    address: "Peace Avenue 17, Penthouse",
    description: "Exclusive penthouse offering 360-degree views of the city and mountains. Private elevator access, rooftop terrace, and premium smart home automation throughout.",
    features: ["Private Parking", "Private Elevator", "24/7 Security", "Rooftop Terrace", "Heating", "Air Conditioning", "Smart Home"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    verified: true,
    featured: true,
    agent: {
      id: "a4",
      name: "Enkhjargal Dorj",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9944 5566",
      email: "enkhjargal@mon1.mn",
      company: "Luxury Homes Mongolia",
      rating: 5.0,
      reviewCount: 67,
      listingsCount: 15,
      verified: true
    },
    nearbyServices: [
      { type: "school", name: "British School of Ulaanbaatar", distance: "1.2km", walkTime: "15 min" },
      { type: "supermarket", name: "Premium Foods", distance: "200m", walkTime: "3 min" },
      { type: "bus", name: "Central Tower Stop", distance: "50m", walkTime: "1 min" },
      { type: "hospital", name: "UB Hospital", distance: "600m", walkTime: "8 min" }
    ],
    coordinates: { lat: 47.9176, lng: 106.9187 },
    createdAt: "2024-01-10"
  },
  {
    id: "6",
    title: "Newly Built 2-Bedroom in Selbe",
    price: 165000000,
    pricePerSqm: 3000000,
    sqm: 55,
    rooms: 2,
    bathrooms: 1,
    floor: 6,
    totalFloors: 10,
    location: "Selbe",
    district: "Chingeltei",
    address: "Selbe River Road, Green Building, Apt 605",
    description: "Brand new apartment in a recently completed development. Modern design, energy-efficient windows, and eco-friendly materials throughout.",
    features: ["Elevator", "Security", "Heating", "Balcony", "Underground Parking"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    verified: true,
    featured: false,
    agent: {
      id: "a2",
      name: "Oyungerel Munkhbat",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      phone: "+976 9922 3344",
      email: "oyungerel@mon1.mn",
      company: "City Center Realty",
      rating: 4.8,
      reviewCount: 89,
      listingsCount: 32,
      verified: true
    },
    nearbyServices: [
      { type: "school", name: "Selbe Primary School", distance: "400m", walkTime: "5 min" },
      { type: "supermarket", name: "Nomin Market", distance: "350m", walkTime: "4 min" },
      { type: "bus", name: "Selbe Bridge Stop", distance: "250m", walkTime: "3 min" },
      { type: "hospital", name: "Health Center #3", distance: "900m", walkTime: "11 min" }
    ],
    coordinates: { lat: 47.9312, lng: 106.8987 },
    createdAt: "2024-01-25"
  }
]

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Bat-Erdene Ganbaatar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9911 2233",
    email: "baterdene@mon1.mn",
    company: "Elite Properties Mongolia",
    rating: 4.9,
    reviewCount: 127,
    listingsCount: 45,
    verified: true
  },
  {
    id: "a2",
    name: "Oyungerel Munkhbat",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9922 3344",
    email: "oyungerel@mon1.mn",
    company: "City Center Realty",
    rating: 4.8,
    reviewCount: 89,
    listingsCount: 32,
    verified: true
  },
  {
    id: "a3",
    name: "Temuulen Bold",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9933 4455",
    email: "temuulen@mon1.mn",
    company: "Student Housing Co.",
    rating: 4.5,
    reviewCount: 45,
    listingsCount: 28,
    verified: false
  },
  {
    id: "a4",
    name: "Enkhjargal Dorj",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    phone: "+976 9944 5566",
    email: "enkhjargal@mon1.mn",
    company: "Luxury Homes Mongolia",
    rating: 5.0,
    reviewCount: 67,
    listingsCount: 15,
    verified: true
  }
]

export function formatPrice(price: number): string {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)}B MNT`
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)}M MNT`
  }
  return `${price.toLocaleString()} MNT`
}
