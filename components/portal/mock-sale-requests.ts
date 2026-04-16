import { agents, apartments } from "@/lib/data";
import type { MarketplaceListing } from "@/lib/marketplace";

const now = Date.now();

function fromApartment(
  apartmentIndex: number,
  patch: Partial<MarketplaceListing>,
): MarketplaceListing {
  const base = apartments[apartmentIndex];
  return {
    ...base,
    workflowStatus: "pending",
    serviceType: "agent",
    selectedAgentId: null,
    takingAgentId: null,
    submittedBy: {
      name: "Хэрэглэгч",
      email: "seller@mon1.mn",
      phone: "99112233",
    },
    ...patch,
  };
}

export const MOCK_SALE_REQUESTS: MarketplaceListing[] = [
  fromApartment(0, {
    id: "mock-sale-1",
    title: "Хүннү 2222-д 3 өрөө байр зарна",
    district: "Хан-Уул",
    location: "Хүннү моллын урд",
    address: "Хан-Уул, 15-р хороо",
    price: 420000000,
    pricePerSqm: 420000000 / 98,
    sqm: 98,
    rooms: 3,
    createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    submittedBy: {
      name: "Тэмүүжин",
      email: "temuujin@mon1.mn",
      phone: "99118822",
    },
    agent: agents[0],
  }),
  fromApartment(1, {
    id: "mock-sale-2",
    title: "Яармаг, King Tower 2 өрөө",
    district: "Хан-Уул",
    location: "Яармаг",
    address: "Хан-Уул, 23-р хороо",
    price: 285000000,
    pricePerSqm: 285000000 / 72,
    sqm: 72,
    rooms: 2,
    createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
    submittedBy: {
      name: "Солонго",
      email: "solongo@mon1.mn",
      phone: "88001234",
    },
    agent: agents[1] ?? agents[0],
  }),
  fromApartment(2, {
    id: "mock-sale-3",
    title: "Хотын төвд оффис борлуулна",
    district: "Сүхбаатар",
    location: "1-р хороо, CBD",
    address: "Сүхбаатар, 1-р хороо",
    propertyType: "office",
    price: 610000000,
    pricePerSqm: 610000000 / 140,
    sqm: 140,
    rooms: 5,
    createdAt: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
    submittedBy: {
      name: "Номин",
      email: "nomin@mon1.mn",
      phone: "95003344",
    },
    agent: agents[2] ?? agents[0],
  }),
];
