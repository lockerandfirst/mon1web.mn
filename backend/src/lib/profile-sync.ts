import type { User } from "@clerk/backend";

import { supabaseAdmin } from "./supabase-admin";

type SyncProfileInput = {
  clerkUserId: string;
  email: string | null;
  fullName: string | null;
  /** Тодорхойлогдсон үед `profiles.phone`-д бичнэ (зарын формын утас). */
  phone?: string | null;
};

function readClerkPublicRole(
  publicMetadata: User["publicMetadata"],
): string | null {
  if (!publicMetadata || typeof publicMetadata !== "object") {
    return null;
  }
  const r = (publicMetadata as Record<string, unknown>).role;
  return typeof r === "string" ? r : null;
}

function isAgentRole(role: string | null): boolean {
  return role === "agent";
}

/** JWT / form-аас ирсэн талбарууд — Clerk бүтэн sync-ээс өмнөх phone/avatar/role хадгална. */
export async function syncProfile(input: SyncProfileInput) {
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("phone, avatar_url, role")
    .eq("clerk_user_id", input.clerkUserId)
    .maybeSingle();

  const role: "buyer" | "agent" | "admin" =
    existing?.role === "admin" || existing?.role === "agent"
      ? existing.role
      : "buyer";

  const row: Record<string, unknown> = {
    clerk_user_id: input.clerkUserId,
    email: input.email,
    full_name: input.fullName,
    role,
  };

  if (input.phone !== undefined) {
    const next = (input.phone ?? "").trim();
    row.phone = next.length > 0 ? next : null;
  } else if (existing?.phone != null && String(existing.phone).length > 0) {
    row.phone = existing.phone;
  }
  if (existing?.avatar_url != null && String(existing.avatar_url).length > 0) {
    row.avatar_url = existing.avatar_url;
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(row, { onConflict: "clerk_user_id" })
    .select("id, clerk_user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/** Clerk `getUser` — profiles мөрийг бүрэн таньж upsert (нэвтэрсэн бүрт). */
export async function upsertProfileFromClerkUser(
  clerkUserId: string,
  clerkUser: User,
): Promise<{ id: string; clerk_user_id: string } | null> {
  const primaryEmailId = clerkUser.primaryEmailAddressId;
  const email =
    clerkUser.emailAddresses
      ?.find((e) => e.id === primaryEmailId)
      ?.emailAddress?.trim()
      .toLowerCase() ??
    clerkUser.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase() ??
    null;

  const primaryPhoneId = clerkUser.primaryPhoneNumberId;
  const phone =
    clerkUser.phoneNumbers
      ?.find((p) => p.id === primaryPhoneId)
      ?.phoneNumber?.trim() ??
    clerkUser.phoneNumbers?.[0]?.phoneNumber?.trim() ??
    null;

  const fullName = clerkUser.fullName?.trim() || null;
  const avatarUrl = clerkUser.imageUrl?.trim() || null;
  const clerkRole = readClerkPublicRole(clerkUser.publicMetadata);

  /**
   * `profiles` хүснэгтэд зөвхөн агент БИШ хэрэглэгчдийг mirror хийнэ.
   * Агентын мэдээлэл `agents` хүснэгтээр тусдаа явна.
   */
  if (isAgentRole(clerkRole)) {
    return null;
  }

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  let role: "buyer" | "agent" | "admin" = "buyer";
  if (existing?.role === "admin") {
    role = "admin";
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        clerk_user_id: clerkUserId,
        email,
        full_name: fullName,
        phone,
        avatar_url: avatarUrl,
        role,
      },
      { onConflict: "clerk_user_id" },
    )
    .select("id, clerk_user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
