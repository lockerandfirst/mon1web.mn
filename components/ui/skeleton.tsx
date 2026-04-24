import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton primitive — reusable placeholder для loading states.
 *
 * - `pulse` (default): Tailwind-ийн `animate-pulse` — зөөлөн fade.
 * - `shimmer`: CSS-ээр зүүнээс баруун шилжих premium glass shimmer.
 * - `shimmer-brand`: Бренд өнгөөр будсан shimmer (зураг placeholder дээр).
 *
 * Бүх variant `prefers-reduced-motion: reduce`-ыг хүндэтгэнэ.
 */
type SkeletonVariant = "pulse" | "shimmer" | "shimmer-brand";

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: SkeletonVariant;
}

export function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "rounded-md bg-slate-200/60",
        variant === "pulse" && "animate-pulse",
        variant === "shimmer" && "skeleton-shimmer animate-pulse",
        variant === "shimmer-brand" &&
          "skeleton-shimmer skeleton-shimmer-brand animate-pulse bg-[#eef0ff]",
        className,
      )}
      {...props}
    />
  );
}
