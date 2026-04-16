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
  source: "marketplace" | "catalog";
};
