/**
 * Clerk-ийн public metadata болон session token дээрх `metadata.role`-д зориулсан төрөл.
 * Session token-д `metadata.role`-ийг Clerk Dashboard → Sessions → Customize session token-оор нэмнэ үү.
 */

declare global {
  interface UserPublicMetadata {
    role?: "agent" | "user";
  }

  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "agent" | "user";
    };
  }
}

export {};
