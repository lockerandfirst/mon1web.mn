import { Router } from "express";
import { z } from "zod";

import { supabaseAdmin } from "../lib/supabase-admin";

const hhaRouter = Router();

const createHhaSchema = z.object({
  created_at: z.string().datetime().optional(),
});

hhaRouter.get("/", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("hha")
    .select("id, created_at")
    .order("id", { ascending: false })
    .limit(100);

  if (error) {
    return res.status(500).json({
      success: false,
      error: "Hha жагсаалт унших үед алдаа гарлаа.",
      details: error.message,
    });
  }

  return res.json({
    success: true,
    data,
  });
});

hhaRouter.post("/", async (req, res) => {
  const parsed = createHhaSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Оруулсан өгөгдөл буруу байна.",
      details: parsed.error.flatten(),
    });
  }

  const payload = parsed.data.created_at
    ? { created_at: parsed.data.created_at }
    : {};

  const { data, error } = await supabaseAdmin
    .from("hha")
    .insert(payload)
    .select("id, created_at")
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      error: "Hha бичлэг үүсгэх үед алдаа гарлаа.",
      details: error.message,
    });
  }

  return res.status(201).json({
    success: true,
    data,
  });
});

export { hhaRouter };
