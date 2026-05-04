import { Router } from "express";
import { createClerkClient } from "@clerk/backend";
import { z } from "zod";

import { env } from "../config/env";
import { agentAvatarUpload } from "../lib/agent-avatar-upload";
import {
  clearResponseCacheByPrefix,
  getCachedResponse,
  setCachedResponse,
} from "../lib/response-cache";
import { resolveAgentIdForAuth } from "../lib/resolve-agent-for-clerk";
import { supabaseAdmin } from "../lib/supabase-admin";
import { requireAuth } from "../middleware/require-auth";
import { requireAgentRole } from "../middleware/require-agent-role";

const agentsRouter = Router();
const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
const AGENTS_ME_CACHE_TTL_MS = 15_000;

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: "Агент", lastName: "" };
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { firstName: parts[0] ?? "Агент", lastName: "" };
  }
  return {
    firstName: parts[0] ?? "Агент",
    lastName: parts.slice(1).join(" "),
  };
}

async function syncAgentProfileToClerk(input: {
  clerkUserId: string;
  name: string;
  phone: string;
  avatar: string;
}) {
  const { firstName, lastName } = splitName(input.name);
  await clerkClient.users.updateUser(input.clerkUserId, {
    firstName,
    lastName: lastName || undefined,
    publicMetadata: {
      syncedAgentProfile: {
        name: input.name,
        phone: input.phone,
        avatar: input.avatar,
      },
      phone: input.phone,
      avatar: input.avatar,
    },
  });

  // Clerk dashboard avatar uses profile image, not public metadata.
  const avatarUrl = input.avatar.trim();
  if (!avatarUrl || !/^https?:\/\//i.test(avatarUrl)) {
    return;
  }

  const imageRes = await fetch(avatarUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to fetch avatar image: ${imageRes.status}`);
  }
  const imageType = imageRes.headers.get("content-type") || "image/jpeg";
  const imageBuffer = await imageRes.arrayBuffer();
  const imageBlob = new Blob([imageBuffer], { type: imageType });
  const form = new FormData();
  form.append("file", imageBlob, "avatar.jpg");

  const clerkImageRes = await fetch(
    `https://api.clerk.com/v1/users/${encodeURIComponent(input.clerkUserId)}/profile_image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
      },
      body: form,
    },
  );
  if (!clerkImageRes.ok) {
    const body = await clerkImageRes.text();
    throw new Error(
      `Failed to update Clerk profile image: ${clerkImageRes.status} ${body}`,
    );
  }
}

function scheduleClerkSync(input: {
  clerkUserId: string;
  name: string;
  phone: string;
  avatar: string;
}) {
  // Run Clerk sync in background so API response is not blocked by remote image fetch/upload.
  setTimeout(() => {
    void syncAgentProfileToClerk(input).catch((e) => {
      console.log("[agents] async clerk sync failed", {
        clerkUserId: input.clerkUserId,
        error: e instanceof Error ? e.message : "unknown",
      });
    });
  }, 0);
}

function mapAgentRowToClient(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ""),
    profileId:
      row.profile_id == null || String(row.profile_id).length === 0
        ? null
        : String(row.profile_id),
    name: String(row.name ?? ""),
    avatar: String(row.avatar ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    bio: typeof row.bio === "string" ? row.bio : "",
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    listingsCount: Number(row.listings_count ?? 0),
    verified: Boolean(row.verified ?? false),
  };
}

const updateAgentMeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional(),
  bio: z.string().trim().max(1200).optional(),
  avatar: z.union([z.string().trim().url().max(1000), z.literal("")]).optional(),
});

agentsRouter.get("/me", requireAuth, requireAgentRole, async (_req, res) => {
  const auth = res.locals.auth as {
    clerkUserId: string;
    email?: string | null;
    fullName?: string | null;
  };
  const preResolved = res.locals.resolvedAgentId;
  const resolvedAgentId =
    typeof preResolved === "string" && preResolved.trim().length > 0
      ? preResolved
      : await resolveAgentIdForAuth(auth);
  if (!resolvedAgentId) {
    return res.status(404).json({
      success: false,
      error: "Агентын мөр олдсонгүй.",
    });
  }
  const cacheKey = `agents:me:${resolvedAgentId}`;
  const cached = getCachedResponse<Record<string, unknown>>(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }
  const { data, error } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", resolvedAgentId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  if (!data) {
    return res.status(404).json({
      success: false,
      error: "Агентын мөр олдсонгүй.",
    });
  }

  const payload = mapAgentRowToClient(data as Record<string, unknown>);
  setCachedResponse(cacheKey, payload, AGENTS_ME_CACHE_TTL_MS);
  return res.json({ success: true, data: payload });
});

agentsRouter.patch("/me", requireAuth, requireAgentRole, async (req, res) => {
  const auth = res.locals.auth as {
    clerkUserId: string;
    email?: string | null;
    fullName?: string | null;
  };
  const parsed = updateAgentMeSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Профайлын өгөгдөл буруу байна.",
      details: parsed.error.flatten(),
    });
  }

  const preResolved = res.locals.resolvedAgentId;
  const resolvedAgentId =
    typeof preResolved === "string" && preResolved.trim().length > 0
      ? preResolved
      : await resolveAgentIdForAuth(auth);
  if (!resolvedAgentId) {
    return res.status(404).json({
      success: false,
      error: "Агентын мөр олдсонгүй.",
    });
  }

  const { data: current, error: currentErr } = await supabaseAdmin
    .from("agents")
    .select("id, avatar")
    .eq("id", resolvedAgentId)
    .maybeSingle();

  if (currentErr) {
    return res.status(500).json({ success: false, error: currentErr.message });
  }
  if (!current?.id) {
    return res.status(404).json({
      success: false,
      error: "Агентын мөр олдсонгүй.",
    });
  }

  const payload = parsed.data;
  const { data, error } = await supabaseAdmin
    .from("agents")
    .update({
      name: payload.name,
      phone: payload.phone ?? "",
      bio: payload.bio ?? "",
      avatar: payload.avatar ?? current.avatar ?? "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.id)
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  clearResponseCacheByPrefix(`agents:me:${current.id}`);

  scheduleClerkSync({
    clerkUserId: auth.clerkUserId,
    name: data.name ?? "",
    phone: data.phone ?? "",
    avatar: data.avatar ?? "",
  });

  return res.json({
    success: true,
    data: mapAgentRowToClient(data as Record<string, unknown>),
  });
});

agentsRouter.post(
  "/me/avatar",
  requireAuth,
  requireAgentRole,
  agentAvatarUpload.single("avatar"),
  async (req, res) => {
    const auth = res.locals.auth as {
      clerkUserId: string;
      email?: string | null;
      fullName?: string | null;
    };
    const file = req.file as Express.Multer.File & {
      path?: string;
      secure_url?: string;
    };

    const imageUrl = file?.path ?? file?.secure_url ?? "";
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Зураг upload хийгдээгүй байна.",
      });
    }

    const preResolved = res.locals.resolvedAgentId;
    const resolvedAgentId =
      typeof preResolved === "string" && preResolved.trim().length > 0
        ? preResolved
        : await resolveAgentIdForAuth(auth);
    if (!resolvedAgentId) {
      return res.status(404).json({
        success: false,
        error: "Агентын мөр олдсонгүй.",
      });
    }

    const { data: current, error: currentErr } = await supabaseAdmin
      .from("agents")
      .select("id")
      .eq("id", resolvedAgentId)
      .maybeSingle();

    if (currentErr) {
      return res.status(500).json({ success: false, error: currentErr.message });
    }
    if (!current?.id) {
      return res.status(404).json({
        success: false,
        error: "Агентын мөр олдсонгүй.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("agents")
      .update({
        avatar: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    clearResponseCacheByPrefix(`agents:me:${current.id}`);

    scheduleClerkSync({
      clerkUserId: auth.clerkUserId,
      name: data.name ?? "",
      phone: data.phone ?? "",
      avatar: data.avatar ?? "",
    });

    return res.json({
      success: true,
      data: mapAgentRowToClient(data as Record<string, unknown>),
    });
  },
);

const listAgentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  verified: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) =>
      value === "true" ? true : value === "false" ? false : undefined,
    ),
});

agentsRouter.get("/", async (req, res) => {
  const parsed = listAgentsQuerySchema.safeParse({
    page: req.query.page,
    limit: req.query.limit,
    verified: req.query.verified,
  });

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Шүүлтийн параметр буруу байна.",
      details: parsed.error.flatten(),
    });
  }

  const { page, limit, verified } = parsed.data;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("agents")
    .select("*", { count: "exact" })
    .order("rating", { ascending: false })
    .range(from, to);

  if (verified !== undefined) {
    query = query.eq("verified", verified);
  }

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({
    success: true,
    data: (data ?? []).map((row) => mapAgentRowToClient(row as Record<string, unknown>)),
    meta: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    },
  });
});

agentsRouter.get("/:id", async (req, res) => {
  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !agent) {
    return res.status(404).json({
      success: false,
      error: "Agent олдсонгүй.",
    });
  }

  const { data: listings } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("agent_id", req.params.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return res.json({
    success: true,
    data: {
      ...agent,
      listings: listings ?? [],
    },
  });
});

export { agentsRouter };
