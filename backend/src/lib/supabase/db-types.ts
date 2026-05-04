/** `profiles` upsert-д ашигладаг төрөл. */
export type ProfileInsert = {
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: string;
  updated_at?: string;
};

/** `agents` insert/update-д ашигладаг төрөл. */
export type AgentInsert = {
  id: string;
  profile_id: string | null;
  clerk_user_id: string;
  email: string;
  name: string;
  avatar: string;
  phone: string;
  company: string;
  rating: number;
  review_count: number;
  listings_count: number;
  verified: boolean;
  bio: string | null;
};
