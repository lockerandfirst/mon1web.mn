import type { FormData } from "@/components/add-property/types";
import type { MarketplaceListing } from "@/lib/marketplace";

type UpdateField = <K extends keyof FormData>(field: K, value: FormData[K]) => void;

export function applyListingToForm(
  listing: MarketplaceListing,
  updateField: UpdateField,
) {
  updateField("title", listing.title || "");
  updateField("propertyType", listing.propertyType || "apartment");
  updateField("district", listing.district || "");
  updateField("location", listing.location || "");
  updateField("address", listing.address || listing.location || "");
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

export function upsertEditedListing(
  editListingId: string | null | undefined,
  nextListing: MarketplaceListing,
  currentListings: MarketplaceListing[],
) {
  if (!editListingId) {
    return {
      didEdit: false,
      listings: [nextListing, ...currentListings],
    };
  }

  const target = currentListings.find((listing) => listing.id === editListingId);
  if (!target) {
    return {
      didEdit: false,
      listings: [nextListing, ...currentListings],
    };
  }

  const updatedListing: MarketplaceListing = {
    ...nextListing,
    id: target.id,
    createdAt: target.createdAt,
    workflowStatus: target.workflowStatus,
    takingAgentId: target.takingAgentId ?? null,
  };

  return {
    didEdit: true,
    listings: currentListings.map((listing) =>
      listing.id === editListingId ? updatedListing : listing,
    ),
  };
}
