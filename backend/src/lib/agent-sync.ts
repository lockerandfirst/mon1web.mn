import { randomUUID } from "node:crypto";

import type { User } from "@clerk/backend";

import type { AuthContext } from "../middleware/require-auth";
import { supabaseAdmin } from "./supabase-admin";

function primaryEmail(user: User): string {
  const primaryId = user.primaryEmailAddressId;
  const fromPrimary = user.emailAddresses?.find((e) => e.id === primaryId)
    ?.emailAddress;
  const first = user.emailAddresses?.[0]?.emailAddress;
  return (fromPrimary ?? first ?? "").trim().toLowerCase();
}

function displayName(user: User, auth: AuthContext): string {
  const fromAuth = (auth.fullName ?? "").trim();
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
  const primary = primaryEmail(user);
  return primary ? primary.split("@")[0] ?? "Агент" : "Агент";
}

function primaryPhone(user: User): string {
  const primaryId = user.primaryPhoneNumberId;
  const fromPrimary = user.phoneNumbers?.find((p) => p.id === primaryId)
    ?.phoneNumber;
  const first = user.phoneNumbers?.[0]?.phoneNumber;
  return (fromPrimary ?? first ?? "").trim();
}

function avatarUrl(user: User, name: string): string {
  const url = user.imageUrl?.trim();
  if (url) {
    return url;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.slice(0, 24))}&size=128&background=eef2ff&color=312e81`;
}

/**
 * Clerk + профайлын мэдээллээр `agents` мөрийг үүсгэх/шинэчлэх.
 * `clerk_user_id`-ээр олдвол update, legacy email-only мөр байвал холбох, эсвэл insert.
 */
export async function ensureAgentRowForAuth(
  auth: AuthContext,
  clerkUser: User,
): Promise<string | null> {
  const resolvedEmail = primaryEmail(clerkUser) || (auth.email ?? "").trim().toLowerCase();
  if (!resolvedEmail) {
    return null;
  }

  const name = displayName(clerkUser, auth);
  const avatar = avatarUrl(clerkUser, name);
  const phone = primaryPhone(clerkUser);

  const { data: byClerk } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("clerk_user_id", auth.clerkUserId)
    .maybeSingle();

  const rowPayload = {
    clerk_user_id: auth.clerkUserId,
    email: resolvedEmail,
    name,
    avatar,
    phone,
    company: "Мон1 агент",
    rating: 0,
    review_count: 0,
    listings_count: 0,
    verified: true,
    bio: null as string | null,
  };

  if (byClerk?.id) {
    const { error } = await supabaseAdmin
      .from("agents")
      .update({
        email: rowPayload.email,
        name: rowPayload.name,
        avatar: rowPayload.avatar,
        phone: rowPayload.phone,
        company: rowPayload.company,
      })
      .eq("id", byClerk.id);
    if (error) {
      console.log("[ensureAgentRowForAuth] update failed", error.message);
      return null;
    }
    return byClerk.id;
  }

  const { data: legacy } = await supabaseAdmin
    .from("agents")
    .select("id")
    .ilike("email", resolvedEmail)
    .is("clerk_user_id", null)
    .limit(1)
    .maybeSingle();

  if (legacy?.id) {
    const { error } = await supabaseAdmin
      .from("agents")
      .update(rowPayload)
      .eq("id", legacy.id);
    if (error) {
      console.log("[ensureAgentRowForAuth] legacy link failed", error.message);
      return null;
    }
    return legacy.id;
  }

  const newId = randomUUID();
  const { error: insertError } = await supabaseAdmin.from("agents").insert({
    id: newId,
    ...rowPayload,
  });

  if (insertError) {
    console.log("[ensureAgentRowForAuth] insert failed", insertError.message);
    return null;
  }

  return newId;
}
