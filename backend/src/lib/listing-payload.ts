import type { UpdateListingPayload } from "../routes/listings.schemas";

/**
 * `POST /api/listings` -ийн хэрэглэгчийн `payload` -ыг Supabase `listings` row-руу хөрвүүлнэ.
 */
export function buildListingInsertRow(
  payload: Record<string, unknown>,
  opts: {
    profileId: string;
    isAgentSale: boolean;
  },
) {
  const isAgentSale = opts.isAgentSale;
  const listingAgentId = isAgentSale
    ? null
    : ((payload.agentId as string | undefined) ?? null);

  const submittedBy = payload.submittedBy as
    | Record<string, unknown>
    | null
    | undefined;
  const phoneFromForm =
    typeof submittedBy?.phone === "string" ? submittedBy.phone.trim() : "";
  const contactPhone =
    phoneFromForm.length > 0 ? phoneFromForm : null;

  return {
    id: (payload.id as string | undefined) ?? `listing-${Date.now()}`,
    title: payload.title,
    property_type: payload.propertyType,
    price: payload.price,
    payment_method: payload.paymentMethod ?? "cash",
    price_per_sqm: payload.pricePerSqm ?? null,
    sqm: payload.sqm ?? null,
    rooms: payload.rooms ?? null,
    bathrooms: payload.bathrooms ?? null,
    floor: payload.floor ?? null,
    total_floors: payload.totalFloors ?? null,
    commission_year: payload.commissionYear ?? null,
    location: payload.location ?? null,
    district: payload.district ?? null,
    address: payload.address ?? null,
    description: payload.description ?? null,
    features: payload.features ?? [],
    images: payload.images ?? payload.imageUrls ?? [],
    verified: isAgentSale,
    featured: false,
    agent_id: listingAgentId,
    nearby_services: payload.nearbyServices ?? [],
    latitude:
      (payload.coordinates as { lat?: number } | undefined)?.lat ?? null,
    longitude:
      (payload.coordinates as { lng?: number } | undefined)?.lng ?? null,
    workflow_status: isAgentSale ? "pending" : "published",
    selected_agent_id: isAgentSale
      ? null
      : ((payload.selectedAgentId as string | undefined) ?? null),
    service_type: payload.serviceType ?? "self",
    submitted_by: payload.submittedBy ?? null,
    submitted_by_profile_id: opts.profileId,
    contact_phone: contactPhone,
  };
}

/**
 * PATCH /api/listings/:id payload-ын camelCase-г Supabase snake_case update-руу буулгана.
 * `undefined`-тэй талбар бичихгүй — зөвхөн өөрчлөгдсөн талбарууд update-д орно.
 */
export function buildListingUpdateRow(payload: UpdateListingPayload) {
  const row: Record<string, unknown> = {};
  const set = <K extends string>(key: K, value: unknown) => {
    if (value !== undefined) {
      row[key] = value;
    }
  };

  set("title", payload.title);
  set("property_type", payload.propertyType);
  set("price", payload.price);
  set("payment_method", payload.paymentMethod);
  set("price_per_sqm", payload.pricePerSqm);
  set("sqm", payload.sqm);
  set("rooms", payload.rooms);
  set("bathrooms", payload.bathrooms);
  set("floor", payload.floor);
  set("total_floors", payload.totalFloors);
  set("commission_year", payload.commissionYear);
  set("location", payload.location);
  set("district", payload.district);
  set("address", payload.address);
  set("description", payload.description);
  set("features", payload.features);
  set("images", payload.images);
  set("nearby_services", payload.nearbyServices);
  set("selected_agent_id", payload.selectedAgentId);
  set("service_type", payload.serviceType);
  if (payload.coordinates) {
    row.latitude = payload.coordinates.lat;
    row.longitude = payload.coordinates.lng;
  }
  return row;
}
