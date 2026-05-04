/** `profiles.role` болон Clerk `publicMetadata.role`-тай нийцэх тогтмолууд. */
export const PROFILE_ROLE = {
  buyer: "buyer",
  agent: "agent",
  admin: "admin",
} as const;

export type ProfileRole =
  (typeof PROFILE_ROLE)[keyof typeof PROFILE_ROLE];
