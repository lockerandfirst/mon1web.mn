export type ServiceType = "self" | "agent";

export type FormData = {
  propertyType: string;
  district: string;
  location: string;
  price: string;
  sqm: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  totalFloors: string;
  description: string;
  serviceType: ServiceType;
  selectedAgentId: string | null;
  surroundings: string[];
};
