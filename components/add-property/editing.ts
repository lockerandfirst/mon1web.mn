import type { FormData } from "@/components/add-property/types";
import type { MarketplaceListing } from "@/lib/marketplace";
import { stripGpsPrefixFromLocationText } from "@/lib/strip-gps-location-text";

type UpdateField = <K extends keyof FormData>(
  field: K,
  value: FormData[K],
) => void;

/**
 * `/edit-listing/[id]` эсвэл `/add-property?edit=ID` горимд зарыг API-аас татаад формыг урьдчилан бөглөнө.
 */
export function applyListingToForm(
  listing: MarketplaceListing,
  updateField: UpdateField,
) {
  updateField("title", listing.title || "");
  updateField("propertyType", listing.propertyType || "apartment");
  updateField("district", listing.district || "");
  updateField(
    "location",
    stripGpsPrefixFromLocationText(listing.location || ""),
  );
  updateField(
    "address",
    stripGpsPrefixFromLocationText(listing.address || listing.location || ""),
  );
  updateField("price", `${listing.price || ""}`);
  updateField("sqm", `${listing.sqm || ""}`);
  updateField("rooms", `${listing.rooms || ""}`);
  updateField("bathrooms", `${listing.bathrooms || ""}`);
  updateField("floor", `${listing.floor || ""}`);
  updateField("totalFloors", `${listing.totalFloors || ""}`);
  updateField("commissionYear", `${listing.commissionYear || ""}`);
  updateField("description", listing.description || "");
  updateField("contactPhone", listing.submittedBy?.phone || "");
  updateField("serviceType", listing.serviceType ?? "self");
  updateField("selectedAgentId", listing.selectedAgentId ?? null);
  updateField("features", listing.features ?? []);
  updateField("surroundings", []);
  updateField("nearbyServices", listing.nearbyServices ?? []);
  updateField("imageUrls", (listing.images ?? []).join("\n"));
  updateField("paymentFlexible", listing.paymentMethod === "any");
  updateField(
    "paymentMethods",
    listing.paymentMethod === "any" ? [] : [listing.paymentMethod],
  );
}
