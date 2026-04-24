import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase-admin";
import { resolveAgentIdForAuth } from "../lib/resolve-agent-for-clerk";

export async function requireAgentRole(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const rawAuth = res.locals.auth as
    | {
        clerkUserId?: string;
        email?: string | null;
        fullName?: string | null;
        role?: "agent" | "user" | null;
      }
    | undefined;
  if (!rawAuth?.clerkUserId) {
    console.log("[requireAgentRole] rejected: no auth context");
    return res.status(401).json({
      success: false,
      error: "Нэвтрэлт шаардлагатай.",
    });
  }
  const auth = {
    clerkUserId: rawAuth.clerkUserId,
    email: rawAuth.email ?? null,
    fullName: rawAuth.fullName ?? null,
    role: rawAuth.role ?? null,
  };
  const clerkIsAgent = auth.role === "agent";

  const { data: profile, error: profileError } = await supabaseAdmin
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

  const profileIsPrivileged =
    profile != null && ["agent", "admin"].includes(profile.role);
  const resolvedAgentId = await resolveAgentIdForAuth({
    clerkUserId: auth.clerkUserId,
    email: auth.email,
    fullName: auth.fullName,
  });
  const legacyMatched = Boolean(resolvedAgentId);

  const allowed = profileIsPrivileged || clerkIsAgent || legacyMatched;

  if (!allowed) {
    console.log("[requireAgentRole] rejected: not agent", {
      clerkUserId: auth.clerkUserId,
      authRole: auth.role,
      profileRole: profile?.role ?? null,
    });
    return res.status(403).json({
      success: false,
      error: "Зөвхөн агент эрхтэй хэрэглэгч нэвтэрнэ.",
    });
  }

  console.log("[requireAgentRole] allowed", {
    clerkUserId: auth.clerkUserId,
    clerkIsAgent,
    profileRole: profile?.role ?? null,
    legacyMatched,
    resolvedAgentId,
  });
  res.locals.resolvedAgentId = resolvedAgentId;

  return next();
}
