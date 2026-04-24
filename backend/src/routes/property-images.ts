import { Router } from "express";
import { z } from "zod";

import { syncProfile } from "../lib/profile-sync";
import { propertyImageUpload } from "../lib/property-image-upload";
import { supabaseAdmin } from "../lib/supabase-admin";
import { requireAuth } from "../middleware/require-auth";

const propertyImagesRouter = Router();
const propertyIdSchema = z.object({
  id: z.string().min(1),
});

propertyImagesRouter.post(
  "/:id/images",
  requireAuth,
  propertyImageUpload.array("images", 10),
  async (req, res) => {
    const parsed = propertyIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "Property ID буруу байна.",
      });
    }

    const propertyId = parsed.data.id;
    const auth = res.locals.auth;
    const files = (req.files ?? []) as Express.Multer.File[];
    console.log("[property-images] incoming files", {
      propertyId,
      count: files.length,
      names: files.map((file) => file.originalname),
    });

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Ядаж нэг зураг оруулна уу.",
      });
    }

    const profile = await syncProfile({
      clerkUserId: auth.clerkUserId,
      email: auth.email,
      fullName: auth.fullName,
    });

    const { data: property, error: propertyError } = await supabaseAdmin
      .from("listings")
      .select("id, submitted_by_profile_id, agent_id, images")
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError || !property) {
      return res.status(404).json({
        success: false,
        error: "Property олдсонгүй.",
      });
    }

    const isSubmitter =
      property.submitted_by_profile_id != null &&
      property.submitted_by_profile_id === profile.id;
    let isListingAgent = false;
    if (property.agent_id && auth.clerkUserId) {
      const { data: me } = await supabaseAdmin
        .from("agents")
        .select("id")
        .eq("clerk_user_id", auth.clerkUserId)
        .maybeSingle();
      if (me?.id) {
        isListingAgent = me.id === property.agent_id;
      }
    }

    if (!isSubmitter && !isListingAgent) {
      return res.status(403).json({
        success: false,
        error: "Энэ property дээр зураг оруулах эрхгүй байна.",
      });
    }

    const rows = files.map((file, index) => {
      const imageUrl =
        (file as Express.Multer.File & { path?: string; secure_url?: string })
          .path ??
        (file as Express.Multer.File & { secure_url?: string }).secure_url ??
        null;

      return {
        property_id: propertyId,
        image_url: imageUrl,
        sort_order: index,
        uploaded_by_profile_id: profile.id,
      };
    });

    const missingUrl = rows.find((row) => !row.image_url);
    if (missingUrl) {
      console.log("[property-images] missing cloudinary url", {
        propertyId,
        rows,
      });
      return res.status(500).json({
        success: false,
        error: "Cloudinary URL үүсээгүй байна.",
      });
    }

    const prevImages: string[] = Array.isArray(property?.images)
      ? (property.images as unknown[]).filter(
          (u): u is string => typeof u === "string" && u.length > 0,
        )
      : [];

    const { data, error } = await supabaseAdmin
      .from("property_images")
      .insert(rows)
      .select("*");

    if (error) {
      console.log("[property-images] db insert failed", {
        propertyId,
        error: error.message,
      });
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    console.log("[property-images] saved", {
      propertyId,
      inserted: data?.length ?? 0,
    });

    const newUrls = rows
      .map((r) => r.image_url)
      .filter((url): url is string => Boolean(url));

    const seen = new Set<string>();
    const mergedImages: string[] = [];
    for (const u of [...prevImages, ...newUrls]) {
      if (seen.has(u)) continue;
      seen.add(u);
      mergedImages.push(u);
    }

    const { error: listingUpdateError } = await supabaseAdmin
      .from("listings")
      .update({ images: mergedImages })
      .eq("id", propertyId);

    if (listingUpdateError) {
      console.log("[property-images] listings.images sync failed", {
        propertyId,
        error: listingUpdateError.message,
      });
      return res.status(500).json({
        success: false,
        error: listingUpdateError.message,
      });
    }
    console.log("[property-images] listings.images synced", {
      propertyId,
      imageCount: mergedImages.length,
    });

    return res.status(201).json({
      success: true,
      data,
    });
  },
);

export { propertyImagesRouter };
