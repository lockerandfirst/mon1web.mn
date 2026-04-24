/**
 * Алдаатай/хоосон зурагны оронд — `Header`-той ижил Mon1 лого (`object-cover` ихэнх layout-д зохино).
 */
export const LISTING_IMAGE_FALLBACK = "/ZAAAA.png";

/** Агент / хэрэглэгч — ижил брэнд лого (дугуй crop-д төвлөрнө). */
export const AVATAR_IMAGE_FALLBACK = "/ZAAAA.png";

export type ImageFallbackKind = "listing" | "listingThumb" | "avatar";

/** Лого `object-cover`-оор таслагдахгүй — агуулга + илүү padding (агент дээр илүү). */
export function fallbackLogoClassName(variant: ImageFallbackKind): string {
  if (variant === "avatar") {
    return "object-contain bg-[#f5f3ff] p-[10%] sm:p-[12%] md:p-[14%] box-border";
  }
  if (variant === "listingThumb") {
    return "object-contain bg-[#fff1f9]/60 p-[38%] sm:p-[40%] box-border";
  }
  return "object-contain bg-[#fff9fd] p-[26%] sm:p-[28%] md:p-[30%] lg:p-[32%] box-border";
}

export function isAppLogoFallbackUrl(url: string): boolean {
  return url === LISTING_IMAGE_FALLBACK || url === AVATAR_IMAGE_FALLBACK;
}

export function coalesceImageSrc(
  src: string | null | undefined,
  kind: ImageFallbackKind = "listing",
): string {
  const t = typeof src === "string" ? src.trim() : "";
  if (t.length > 0) return t;
  return kind === "avatar" ? AVATAR_IMAGE_FALLBACK : LISTING_IMAGE_FALLBACK;
}

/** API-ээс ирсэн зургийн жагсаалтыг хоосон бол fallback-оор бөглөнө. */
export function ensureListingImageUrls(images: unknown): string[] {
  const arr = Array.isArray(images)
    ? (images as unknown[])
        .map((u) => (typeof u === "string" ? u.trim() : String(u ?? "").trim()))
        .filter((s) => s.length > 0)
    : [];
  if (arr.length === 0) return [LISTING_IMAGE_FALLBACK];
  return arr;
}
