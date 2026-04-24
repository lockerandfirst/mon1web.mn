"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AVATAR_IMAGE_FALLBACK,
  LISTING_IMAGE_FALLBACK,
  fallbackLogoClassName,
  type ImageFallbackKind,
} from "@/lib/image-fallbacks";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "onError"
> & {
  src?: string | null;
  variant?: ImageFallbackKind;
};

export function SafeImage({
  src,
  variant = "listing",
  className,
  alt = "",
  ...rest
}: SafeImageProps) {
  const fallback =
    variant === "avatar" ? AVATAR_IMAGE_FALLBACK : LISTING_IMAGE_FALLBACK;
  const normalized = src?.trim() ? src.trim() : fallback;
  const [current, setCurrent] = useState(normalized);

  useEffect(() => {
    setCurrent(src?.trim() ? src.trim() : fallback);
  }, [src, fallback]);

  const onError = useCallback(() => {
    setCurrent(fallback);
  }, [fallback]);

  const showingLogoFallback = current === fallback;

  return (
    <img
      src={current}
      alt={alt}
      className={cn(
        className,
        showingLogoFallback &&
          cn(
            fallbackLogoClassName(variant),
            (variant === "listing" || variant === "listingThumb") &&
              "max-h-full max-w-full",
          ),
      )}
      onError={onError}
      {...rest}
    />
  );
}
