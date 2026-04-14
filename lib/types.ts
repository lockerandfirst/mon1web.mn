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

export const DEFAULT_FORM: FormData = {
  propertyType: "apartment",
  district: "",
  location: "",
  price: "",
  sqm: "",
  rooms: "2",
  bathrooms: "1",
  floor: "",
  totalFloors: "",
  description: "",
  serviceType: "self",
  selectedAgentId: null,
  surroundings: [],
};
