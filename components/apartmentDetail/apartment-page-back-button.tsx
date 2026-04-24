"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  className?: string;
};

/** «Буцах» товчны хэмжээнд ойролцоо — `ApartmentDetailSkeleton`-ийн дээд мөртэй тааруулсан. */
export function ApartmentPageBackButtonSkeleton({ className }: Props) {
  return (
    <Skeleton
      className={cn(
        "h-9 w-24 shrink-0 rounded-[18px] md:h-10 md:w-28",
        className,
      )}
    />
  );
}

/** Галерей, skeleton-тэй ижил өргөн дээр — fixed биш, зөөлөн текст товч. */
export function ApartmentPageBackButton({ className }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "inline-flex items-center md:text-[18px] text-[16px] gap-1.5 rounded-[18px] px-2 py-1.5 text-sm font-bold  text-[#2a00ff] transition-colors hover:bg-[#ff3bad]/10 hover:text-[#2a00ff] active:bg-slate-100",
        className,
      )}
    >
      <ArrowLeft
        className="h-4 w-4 shrink-0 text-[#2a00ff]"
        strokeWidth={4}
        aria-hidden
      />
      Буцах
    </button>
  );
}
