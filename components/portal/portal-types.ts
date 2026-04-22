export type AgentPortalTab =
  | "listings"
  | "saleRequests"
  | "buyRequests"
  | "profile";

export type AgentPortalPickListing = {
  id: string;
  title: string;
  district: string;
  price: number;
  imageUrl?: string;
  source: "marketplace" | "catalog" | "claimed";
};
