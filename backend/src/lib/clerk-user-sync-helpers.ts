import type { User } from "@clerk/backend";

import type { AuthContext } from "../middleware/require-auth";
import { PROFILE_ROLE, type ProfileRole } from "./user-roles";

/** Clerk `publicMetadata.role` — зөвшөөрөгдсөн утга. */
export function getClerkPublicRoleString(
  publicMetadata: User["publicMetadata"],
): string | null {
  if (!publicMetadata || typeof publicMetadata !== "object") {
    return null;
  }
  const role = (publicMetadata as { role?: unknown }).role;
  return typeof role === "string" ? role.trim() : null;
}

export function isAgentClerkRole(clerkPublicRole: string | null): boolean {
  return clerkPublicRole === PROFILE_ROLE.agent;
}

/**
 * JWT / form-аас ирсэн хэсэгчилсэн sync: одоогийн DB `role`-оос admin/agent хадгална,
 * бусад тохиолдолд buyer.
 */
export function resolveRole(
  input:
    | { mode: "partial_sync"; existingProfileRole: string | null | undefined }
    | {
        mode: "clerk_mirror";
        existingProfileRole: string | null | undefined;
      },
): ProfileRole {
  if (input.mode === "partial_sync") {
    const r = input.existingProfileRole;
    if (r === PROFILE_ROLE.admin || r === PROFILE_ROLE.agent) {
      return r;
    }
    return PROFILE_ROLE.buyer;
  }
  if (input.existingProfileRole === PROFILE_ROLE.admin) {
    return PROFILE_ROLE.admin;
  }
  return PROFILE_ROLE.buyer;
}

export function getPrimaryEmail(user: User): string | null {
  const primaryEmailId = user.primaryEmailAddressId;
  const raw =
    user.emailAddresses?.find((e) => e.id === primaryEmailId)?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    null;
  if (raw == null) {
    return null;
  }
  const t = raw.trim().toLowerCase();
  return t.length > 0 ? t : null;
}

export function getPrimaryPhone(user: User): string | null {
  const primaryPhoneId = user.primaryPhoneNumberId;
  const raw =
    user.phoneNumbers?.find((p) => p.id === primaryPhoneId)?.phoneNumber ??
    user.phoneNumbers?.[0]?.phoneNumber ??
    null;
  return normalizePhone(raw);
}

/** Утас: таслал, зай, хаалт зэргийг цэвэрлэж, хоосон бол null. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (raw == null) {
    return null;
  }
  let s = raw.trim();
  if (!s) {
    return null;
  }
  s = s.replace(/[\s().-]/g, "");
  if (!s) {
    return null;
  }
  return s;
}

export function getAgentDisplayName(user: User, auth: AuthContext | null): string {
  const fromAuth = (auth?.fullName ?? "").trim();
  if (fromAuth) {
    return fromAuth;
  }
  const fromClerk = user.fullName?.trim();
  if (fromClerk) {
    return fromClerk;
  }
  const fn = user.firstName?.trim() ?? "";
  const ln = user.lastName?.trim() ?? "";
  const combined = `${fn} ${ln}`.trim();
  if (combined) {
    return combined;
  }
  const primary = getPrimaryEmail(user);
  return primary ? (primary.split("@")[0] ?? "Агент") : "Агент";
}

export function getAgentAvatarFromClerk(user: User): string {
  const url = user.imageUrl?.trim();
  if (url) {
    return url;
  }
  const meta = user.publicMetadata as { avatar?: unknown } | null | undefined;
  const fromMeta = meta?.avatar;
  if (typeof fromMeta === "string" && fromMeta.trim()) {
    return fromMeta.trim();
  }
  return "";
}

export function getAgentPhoneFromClerk(user: User): string {
  const meta = user.publicMetadata as { phone?: unknown } | null | undefined;
  const fromMeta = meta?.phone;
  const metaStr =
    typeof fromMeta === "string" ? normalizePhone(fromMeta) ?? "" : "";
  const fromPrimary = getPrimaryPhone(user) ?? "";
  return (fromPrimary || metaStr || "").trim();
}
