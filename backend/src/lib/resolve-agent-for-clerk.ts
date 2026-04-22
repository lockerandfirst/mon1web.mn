import { createClerkClient } from "@clerk/backend";

import { env } from "../config/env";
import type { AuthContext } from "../middleware/require-auth";
import { supabaseAdmin } from "./supabase-admin";

export async function resolveAgentIdForAuth(
  auth: AuthContext,
): Promise<string | null> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .eq("clerk_user_id", auth.clerkUserId)
    .maybeSingle();

  let resolvedEmail = (auth.email ?? profile?.email ?? "").trim().toLowerCase();
  if (!resolvedEmail) {
    try {
      const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
      const user = await clerk.users.getUser(auth.clerkUserId);
      const primaryEmailId = user.primaryEmailAddressId;
      resolvedEmail =
        user.emailAddresses
          .find((item) => item.id === primaryEmailId)
          ?.emailAddress?.trim()
          .toLowerCase() ??
        user.emailAddresses[0]?.emailAddress?.trim().toLowerCase() ??
        "";
    } catch {
      resolvedEmail = "";
    }
  }

  const { data: byClerk } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("clerk_user_id", auth.clerkUserId)
    .maybeSingle();

  if (byClerk?.id) {
    return byClerk.id;
  }

  if (!resolvedEmail) {
    return null;
  }

  const { data: rows } = await supabaseAdmin
    .from("agents")
    .select("id")
    .ilike("email", resolvedEmail)
    .limit(1);

  return rows?.[0]?.id ?? null;
}
