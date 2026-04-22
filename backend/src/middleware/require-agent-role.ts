import type { NextFunction, Request, Response } from "express";
import { createClerkClient } from "@clerk/backend";

import { ensureAgentRowForAuth } from "../lib/agent-sync";
import { syncProfile } from "../lib/profile-sync";
import { env } from "../config/env";
import { supabaseAdmin } from "../lib/supabase-admin";

function readPublicRole(
  publicMetadata: Record<string, unknown> | null | undefined,
): string | null {
  const role = publicMetadata?.role;
  return typeof role === "string" ? role : null;
}

export async function requireAgentRole(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  const auth = res.locals.auth as
    | {
        clerkUserId?: string;
        email?: string | null;
        fullName?: string | null;
      }
    | undefined;
  if (!auth?.clerkUserId) {
    console.log("[requireAgentRole] rejected: no auth context");
    return res.status(401).json({
      success: false,
      error: "Нэвтрэлт шаардлагатай.",
    });
  }

  let clerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(auth.clerkUserId);
  } catch (e) {
    console.log("[requireAgentRole] clerk getUser failed", {
      clerkUserId: auth.clerkUserId,
      error: e instanceof Error ? e.message : "unknown",
    });
    return res.status(503).json({
      success: false,
      error: "Эрх шалгах үед түр хүлээнэ үү.",
    });
  }

  const clerkIsAgent = readPublicRole(clerkUser.publicMetadata as Record<string, unknown>) === "agent";

  let { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, email")
    .eq("clerk_user_id", auth.clerkUserId)
    .maybeSingle();

  if (profileError) {
    console.log("[requireAgentRole] profile lookup error", {
      clerkUserId: auth.clerkUserId,
      error: profileError.message,
    });
    return res.status(403).json({
      success: false,
      error: "Эрх шалгах үед алдаа гарлаа.",
    });
  }

  if (!profile) {
    try {
      await syncProfile({
        clerkUserId: auth.clerkUserId,
        email: auth.email ?? null,
        fullName: auth.fullName ?? null,
      });
      const refetch = await supabaseAdmin
        .from("profiles")
        .select("role, email")
        .eq("clerk_user_id", auth.clerkUserId)
        .maybeSingle();
      profile = refetch.data ?? null;
    } catch (e) {
      console.log("[requireAgentRole] syncProfile failed", {
        clerkUserId: auth.clerkUserId,
        error: e instanceof Error ? e.message : "unknown",
      });
      return res.status(403).json({
        success: false,
        error: "Профайл үүсгэхэд алдаа гарлаа.",
      });
    }
  }

  const profileIsPrivileged =
    profile != null && ["agent", "admin"].includes(profile.role);

  const emailFromAuth = (auth.email ?? "").trim().toLowerCase();
  const emailFromProfile = (profile?.email ?? "").trim().toLowerCase();
  const primaryId = clerkUser.primaryEmailAddressId;
  const emailFromClerk =
    clerkUser.emailAddresses
      ?.find((item) => item.id === primaryId)
      ?.emailAddress?.trim()
      .toLowerCase() ??
    clerkUser.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase() ??
    "";
  let resolvedEmail = emailFromAuth || emailFromProfile || emailFromClerk;

  if (!resolvedEmail) {
    console.log("[requireAgentRole] rejected: no resolvable email", {
      clerkUserId: auth.clerkUserId,
    });
    return res.status(403).json({
      success: false,
      error: "Зөвхөн агент эрхтэй хэрэглэгч нэвтэрнэ.",
    });
  }

  let legacyMatched = false;
  if (!profileIsPrivileged && !clerkIsAgent) {
    const { data: agentMatch } = await supabaseAdmin
      .from("agents")
      .select("id")
      .ilike("email", resolvedEmail)
      .limit(1);
    legacyMatched = (agentMatch ?? []).length > 0;
  }

  const allowed = profileIsPrivileged || clerkIsAgent || legacyMatched;

  if (!allowed) {
    console.log("[requireAgentRole] rejected: not agent", {
      clerkUserId: auth.clerkUserId,
      resolvedEmail,
    });
    return res.status(403).json({
      success: false,
      error: "Зөвхөн агент эрхтэй хэрэглэгч нэвтэрнэ.",
    });
  }

  if ((clerkIsAgent || legacyMatched) && profile?.role !== "admin") {
    await supabaseAdmin
      .from("profiles")
      .update({ role: "agent" })
      .eq("clerk_user_id", auth.clerkUserId);
  }

  const needsAgentRow =
    clerkIsAgent || profile?.role === "agent" || legacyMatched;

  if (needsAgentRow) {
    const agentId = await ensureAgentRowForAuth(auth, clerkUser);
    if (!agentId) {
      console.log("[requireAgentRole] ensureAgentRowForAuth returned null", {
        clerkUserId: auth.clerkUserId,
      });
      return res.status(503).json({
        success: false,
        error: "Агентын бүртгэлийг шинэчлэхэд алдаа гарлаа.",
      });
    }
  }

  console.log("[requireAgentRole] allowed", {
    clerkUserId: auth.clerkUserId,
    clerkIsAgent,
    profileRole: profile?.role ?? null,
    legacyMatched,
    needsAgentRow,
  });

  return next();
}
