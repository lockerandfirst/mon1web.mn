import { z } from "zod";

/**
 * Газрын зураг — зөвхөн харагдаж буй bbox доторх зарууд (хэт том bbox зөвшөөрөхгүй).
 */
export const mapListingsQuerySchema = z
  .object({
    minLat: z.coerce.number().min(-90).max(90),
    maxLat: z.coerce.number().min(-90).max(90),
    minLng: z.coerce.number().min(-180).max(180),
    maxLng: z.coerce.number().min(-180).max(180),
    limit: z.coerce.number().int().positive().max(500).default(400),
  })
  .refine((d) => d.minLat < d.maxLat && d.minLng < d.maxLng, {
    message: "bbox-ийн өргөн/урт буруу байна.",
  })
  .refine((d) => d.maxLat - d.minLat <= 2.5 && d.maxLng - d.minLng <= 2.5, {
    message: "Хэт том бүс — газрыг ойртуулна уу.",
  });

export const listListingsSortSchema = z.enum([
  "newest",
  "price-low",
  "price-high",
]);

export const listListingsQuerySchema = z
  .object({
    status: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().positive().default(1),
    /** Map and other clients may request more rows in one page (e.g. limit=200). */
    limit: z.coerce.number().int().positive().max(500).default(12),
    featured: z
      .union([z.literal("true"), z.literal("false")])
      .optional()
      .transform((value) =>
        value === "true" ? true : value === "false" ? false : undefined,
      ),
    agentId: z.string().trim().min(1).optional(),
    /** Server-side filter + sort (listings page). */
    sort: z.preprocess((val) => {
      if (val === undefined || val === null || val === "") return "newest";
      const s = String(val);
      if (s === "price-low" || s === "price-high" || s === "newest") return s;
      return "newest";
    }, listListingsSortSchema),
    q: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((s) => (s && s.length > 0 ? s : undefined)),
    priceMin: z.coerce.number().int().min(0).max(2_000_000_000).optional(),
    priceMax: z.coerce.number().int().min(0).max(2_000_000_000).optional(),
    sqmMin: z.coerce.number().int().min(0).max(100_000).optional(),
    sqmMax: z.coerce.number().int().min(0).max(100_000).optional(),
    district: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((s) =>
        s && s.length > 0 && s !== "any" ? s : undefined,
      ),
    category: z
      .string()
      .trim()
      .max(50)
      .optional()
      .transform((s) =>
        s && s.length > 0 && s !== "all" ? s : undefined,
      ),
    rentType: z
      .string()
      .trim()
      .max(50)
      .optional()
      .transform((s) =>
        s && s.length > 0 && s !== "any" ? s : undefined,
      ),
    rooms: z
      .string()
      .trim()
      .max(10)
      .optional()
      .transform((s) =>
        s && s.length > 0 && s !== "any" ? s : undefined,
      ),
    bathrooms: z
      .string()
      .trim()
      .max(10)
      .optional()
      .transform((s) =>
        s && s.length > 0 && s !== "any" ? s : undefined,
      ),
    paymentMethod: z
      .enum(["cash", "mortgage", "installment", "any"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.priceMin != null &&
      data.priceMax != null &&
      data.priceMin > data.priceMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Үнийн завсар буруу байна.",
        path: ["priceMin"],
      });
    }
    if (
      data.sqmMin != null &&
      data.sqmMax != null &&
      data.sqmMin > data.sqmMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Талбайн завсар буруу байна.",
        path: ["sqmMin"],
      });
    }
  });

export type ListListingsQuery = z.infer<typeof listListingsQuerySchema>;

export const serviceTypeSchema = z.object({
  serviceType: z.enum(["self", "agent"]),
});

/**
 * PATCH /api/listings/:id payload — бүх талбар optional.
 * `id`, `created_at`, `view_count`, `submitted_by_profile_id` зэрэг зар
 * үүсгэгч үл өөрчлөх талбаруудыг эндээс зориуд хассан.
 */
export const updateListingSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    propertyType: z.string().trim().min(1).max(50).optional(),
    price: z.coerce.number().int().nonnegative().optional(),
    paymentMethod: z
      .enum(["cash", "mortgage", "installment", "any"])
      .optional(),
    pricePerSqm: z.coerce.number().int().nonnegative().nullable().optional(),
    sqm: z.coerce.number().nonnegative().nullable().optional(),
    rooms: z.coerce.number().int().nonnegative().nullable().optional(),
    bathrooms: z.coerce.number().int().nonnegative().nullable().optional(),
    floor: z.coerce.number().int().nullable().optional(),
    totalFloors: z.coerce.number().int().nullable().optional(),
    commissionYear: z.coerce.number().int().nullable().optional(),
    location: z.string().trim().max(300).nullable().optional(),
    district: z.string().trim().max(120).nullable().optional(),
    address: z.string().trim().max(500).nullable().optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    features: z.array(z.string().trim().max(80)).max(64).optional(),
    images: z.array(z.string().trim().url().max(1000)).max(64).optional(),
    nearbyServices: z.array(z.unknown()).max(64).optional(),
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional(),
    selectedAgentId: z.string().trim().min(1).nullable().optional(),
    serviceType: z.enum(["self", "agent"]).optional(),
    /** Зар оруулагчийн утас — `submitted_by` + `profiles.phone` шинэчлэгдэнэ. */
    contactPhone: z.string().trim().max(40).optional(),
  })
  .strict();

export type UpdateListingPayload = z.infer<typeof updateListingSchema>;
