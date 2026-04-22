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
      .select("id, submitted_by_profile_id")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return res.status(404).json({
        success: false,
        error: "Property олдсонгүй.",
      });
    }

    if (property.submitted_by_profile_id && property.submitted_by_profile_id !== profile.id) {
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

    const { data: uploadedImages, error: uploadedImagesError } = await supabaseAdmin
      .from("property_images")
      .select("image_url, sort_order")
      .eq("property_id", propertyId)
      .order("sort_order", { ascending: true });

    if (uploadedImagesError) {
      console.log("[property-images] readback failed", {
        propertyId,
        error: uploadedImagesError.message,
      });
      return res.status(500).json({
        success: false,
        error: uploadedImagesError.message,
      });
    }

    const orderedUrls = (uploadedImages ?? [])
      .map((row) => row.image_url)
      .filter((url): url is string => Boolean(url));

    const { error: listingUpdateError } = await supabaseAdmin
      .from("listings")
      .update({ images: orderedUrls })
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
      imageCount: orderedUrls.length,
    });

    return res.status(201).json({
      success: true,
      data,
    });
  },
);

export { propertyImagesRouter };
