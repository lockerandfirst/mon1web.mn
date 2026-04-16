/**
 * Агент эрх шалгах — сервер (middleware, Server Component) болон клиентэд ашиглана.
 * `sessionClaims`: `auth()` эсвэл middleware-ийн `auth().sessionClaims`
 * `publicMetadata`: `useUser().user.publicMetadata`
 */

export function isAgent(
  input:
    | { sessionClaims: CustomJwtSessionClaims | null | undefined }
    | { publicMetadata: UserPublicMetadata | null | undefined },
): boolean {
  if ("sessionClaims" in input) {
    return roleFromSessionClaims(input.sessionClaims) === "agent";
  }
  return input.publicMetadata?.role === "agent";
}

function roleFromSessionClaims(
  sessionClaims: CustomJwtSessionClaims | null | undefined,
): "agent" | "user" | null {
  if (!sessionClaims) {
    return null;
  }

  const fromMeta = sessionClaims.metadata?.role;
  if (fromMeta === "agent" || fromMeta === "user") {
    return fromMeta;
  }

  const claims = sessionClaims as CustomJwtSessionClaims & {
    publicMetadata?: UserPublicMetadata;
    public_metadata?: UserPublicMetadata;
  };
  const pm = claims.publicMetadata ?? claims.public_metadata;
  const fromPm = pm?.role;
  if (fromPm === "agent" || fromPm === "user") {
    return fromPm;
  }

  return null;
}
