import type { User } from "@clerk/backend";

import type { AuthContext } from "../middleware/require-auth";
import {
  getClerkPublicRoleString,
  getPrimaryEmail,
  getPrimaryPhone,
  isAgentClerkRole,
  normalizePhone,
  resolveRole,
} from "./clerk-user-sync-helpers";
import type { ProfileInsert } from "./supabase/db-types";
import { supabaseAdmin } from "./supabase-admin";
import { syncAgentRowFromClerkUser } from "./sync-agent-row";

const LOG = "[profile-sync]";

export class ProfileSyncError extends Error {
  constructor(
    message: string,
    readonly code: "supabase_select" | "supabase_upsert",
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProfileSyncError";
  }
}

export type SyncProfileInput = {
  clerkUserId: string;
  email: string | null;
  fullName: string | null;
  /** Тодорхойлогдсон үед `profiles.phone`-д бичнэ (зарын формын утас). */
  phone?: string | null;
};

function isoNow(): string {
  return new Date().toISOString();
}

/** JWT / form-аас ирсэн талбарууд — Clerk бүтэн sync-ээс өмнөх phone/avatar/role хадгална. */
export async function syncProfile(
  input: SyncProfileInput,
): Promise<{ id: string; clerk_user_id: string }> {
  const { data: existing, error: selectError } = await supabaseAdmin
    .from("profiles")
    .select("phone, avatar_url, role")
    .eq("clerk_user_id", input.clerkUserId)
    .maybeSingle();

  if (selectError) {
    console.log(LOG, "select алдаа", {
      clerkUserId: input.clerkUserId,
      message: selectError.message,
    });
    throw new ProfileSyncError(
      selectError.message,
      "supabase_select",
      selectError,
    );
  }

  const role = resolveRole({
    mode: "partial_sync",
    existingProfileRole: existing?.role,
  });

  const row: ProfileInsert = {
    clerk_user_id: input.clerkUserId,
    email: input.email,
    full_name: input.fullName,
    role,
    updated_at: isoNow(),
  };

  if (input.phone !== undefined) {
    const trimmed =
      input.phone == null ? "" : String(input.phone).trim();
    const next = normalizePhone(trimmed.length > 0 ? trimmed : null);
    row.phone = next;
  } else if (existing?.phone != null && String(existing.phone).length > 0) {
    row.phone = normalizePhone(String(existing.phone)) ?? String(existing.phone).trim();
  }

  if (
    existing?.avatar_url != null &&
    String(existing.avatar_url).length > 0
  ) {
    row.avatar_url = String(existing.avatar_url).trim();
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(row, { onConflict: "clerk_user_id" })
    .select("id, clerk_user_id")
    .single();

  if (error) {
    console.log(LOG, "upsert алдаа", {
      clerkUserId: input.clerkUserId,
      message: error.message,
    });
    throw new ProfileSyncError(error.message, "supabase_upsert", error);
  }

  if (!data) {
    throw new ProfileSyncError("Хариу хоосон байна.", "supabase_upsert");
  }

  return data;
}

export type UpsertProfileFromClerkOptions = {
  /** Агентын нэрийг JWT `full_name`-аас давуу эрэмбээр авахад ашиглана. */
  auth?: AuthContext | null;
};

/**
 * Clerk `getUser` — buyer/admin-д `profiles` mirror.
 * Агентуудыг `profiles`-д оруулахгүй; `agents` хүснэгтэд `syncAgentRowFromClerkUser` дуудна.
 */
export async function upsertProfileFromClerkUser(
  clerkUserId: string,
  clerkUser: User,
  options?: UpsertProfileFromClerkOptions,
): Promise<{ id: string; clerk_user_id: string } | null> {
  const clerkRole = getClerkPublicRoleString(clerkUser.publicMetadata);
  if (isAgentClerkRole(clerkRole)) {
    await syncAgentRowFromClerkUser({
      clerkUserId,
      user: clerkUser,
      auth: options?.auth ?? null,
    });
    return null;
  }

  const email = getPrimaryEmail(clerkUser);
  const clerkPhone = getPrimaryPhone(clerkUser);
  const fullName = clerkUser.fullName?.trim() || null;
  const clerkAvatar = clerkUser.imageUrl?.trim() || null;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("profiles")
    .select("role, avatar_url, phone")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (existingError) {
    console.log(LOG, "select алдаа (clerk mirror)", {
      clerkUserId,
      message: existingError.message,
    });
    throw new ProfileSyncError(
      existingError.message,
      "supabase_select",
      existingError,
    );
  }

  const role = resolveRole({
    mode: "clerk_mirror",
    existingProfileRole: existing?.role,
  });

  let avatar_url: string | null = clerkAvatar;
  if (
    (avatar_url == null || avatar_url.length === 0) &&
    existing?.avatar_url != null &&
    String(existing.avatar_url).trim().length > 0
  ) {
    avatar_url = String(existing.avatar_url).trim();
  }

  let phone: string | null = clerkPhone;
  if (
    (phone == null || phone.length === 0) &&
    existing?.phone != null &&
    String(existing.phone).trim().length > 0
  ) {
    phone =
      normalizePhone(String(existing.phone).trim()) ??
      String(existing.phone).trim();
  }

  const row: ProfileInsert = {
    clerk_user_id: clerkUserId,
    email,
    full_name: fullName,
    phone: phone ?? null,
    avatar_url: avatar_url ?? null,
    role,
    updated_at: isoNow(),
  };

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(row, { onConflict: "clerk_user_id" })
    .select("id, clerk_user_id")
    .single();

  if (error) {
    console.log(LOG, "upsert алдаа (clerk mirror)", {
      clerkUserId,
      message: error.message,
    });
    throw new ProfileSyncError(error.message, "supabase_upsert", error);
  }

  if (!data) {
    throw new ProfileSyncError("Хариу хоосон байна.", "supabase_upsert");
  }

  return data;
}
