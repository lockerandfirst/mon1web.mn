import { randomUUID } from "node:crypto";

import type { User } from "@clerk/backend";

import type { AuthContext } from "../middleware/require-auth";
import {
  getAgentAvatarFromClerk,
  getAgentDisplayName,
  getAgentPhoneFromClerk,
  getPrimaryEmail,
} from "./clerk-user-sync-helpers";
import type { AgentInsert } from "./supabase/db-types";
import { supabaseAdmin } from "./supabase-admin";

const LOG = "[sync-agent-row]";

export type SyncAgentRowInput = {
  clerkUserId: string;
  user: User;
  auth: AuthContext | null;
};

/**
 * Clerk + (сонголтоор) JWT auth-аас `agents` мөрийг үүсгэх/шинэчлэх.
 * `clerk_user_id`-ээр олдвол шинэчилнэ; legacy email-only мөрийг холбоно; эсвэл insert.
 */
export async function syncAgentRowFromClerkUser(
  input: SyncAgentRowInput,
): Promise<string | null> {
  const { clerkUserId, user, auth } = input;
  const resolvedEmail = getPrimaryEmail(user) ?? (auth?.email ?? "").trim().toLowerCase();
  if (!resolvedEmail) {
    console.log(LOG, "алгасав: имэйл байхгүй", { clerkUserId });
    return null;
  }

  const name = getAgentDisplayName(user, auth);
  const clerkAvatar = getAgentAvatarFromClerk(user);
  const clerkPhoneRaw = getAgentPhoneFromClerk(user);

  const [{ data: profile }, { data: byClerk }] = await Promise.all([
    supabaseAdmin.from("profiles").select("id").eq("clerk_user_id", clerkUserId).maybeSingle(),
    supabaseAdmin.from("agents").select("id, avatar, phone").eq("clerk_user_id", clerkUserId).maybeSingle(),
  ]);

  const avatar =
    clerkAvatar.length > 0
      ? clerkAvatar
      : (byClerk?.avatar != null && String(byClerk.avatar).trim().length > 0
          ? String(byClerk.avatar).trim()
          : "");

  const phone =
    clerkPhoneRaw.length > 0
      ? clerkPhoneRaw
      : (byClerk?.phone != null && String(byClerk.phone).trim().length > 0
          ? String(byClerk.phone).trim()
          : "");

  const basePayload: Omit<AgentInsert, "id"> = {
    profile_id: profile?.id ?? null,
    clerk_user_id: clerkUserId,
    email: resolvedEmail,
    name,
    avatar,
    phone,
    company: "Мон1 агент",
    rating: 0,
    review_count: 0,
    listings_count: 0,
    verified: true,
    bio: null,
  };

  if (byClerk?.id) {
    const { error } = await supabaseAdmin
      .from("agents")
      .update({
        profile_id: basePayload.profile_id,
        email: basePayload.email,
        name: basePayload.name,
        avatar: basePayload.avatar,
        phone: basePayload.phone,
      })
      .eq("id", byClerk.id);
    if (error) {
      console.log(LOG, "update алдаа", { clerkUserId, message: error.message });
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
      .update(basePayload)
      .eq("id", legacy.id);
    if (error) {
      console.log(LOG, "legacy холболт алдаа", { clerkUserId, message: error.message });
      return null;
    }
    return legacy.id;
  }

  const newId = randomUUID();
  const insertRow: AgentInsert = { id: newId, ...basePayload };
  const { error: insertError } = await supabaseAdmin.from("agents").insert(insertRow);
  if (insertError) {
    console.log(LOG, "insert алдаа", { clerkUserId, message: insertError.message });
    return null;
  }

  return newId;
}
