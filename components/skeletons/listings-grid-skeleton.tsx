import { ListingCardSkeleton } from "./listing-card-skeleton";

/**
 * `ListingCardSkeleton`-ийг ижил grid layout дор давтан харуулах wrapper.
 *
 * `<Suspense fallback={<ListingsGridSkeleton />}>` эсвэл `loading.tsx`-д
 * шууд ашиглах боломжтой.
 */
export function ListingsGridSkeleton({
  count = 6,
  variant = "default",
  className = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-8",
}: {
  count?: number;
  variant?: "default" | "compact";
  className?: string;
}) {
  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label="Зарууд ачаалж байна"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
