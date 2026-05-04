import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    API_PORT: z.coerce.number().default(4000),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    FRONTEND_ORIGIN: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (process.env.NODE_ENV === "production" && !data.FRONTEND_ORIGIN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Production орчинд FRONTEND_ORIGIN (CORS) заавал тохируулна.",
        path: ["FRONTEND_ORIGIN"],
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const messages = parsed.error.issues.map((issue) => {
    const key = issue.path.join(".") || "unknown";
    return `${key}: ${issue.message}`;
  });
  throw new Error(`Environment variables invalid:\n${messages.join("\n")}`);
}

export const env = parsed.data;
