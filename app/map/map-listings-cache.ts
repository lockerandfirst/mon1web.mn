import type { Apartment } from "@/lib/data";
import type { MapBoundsLiteral } from "./map-bounds";

/** SPA session дотор хадгалагдана — /map-аас гарсан ч буцаж ороход дахин ачаалахгүй. */
const listingById: Record<string, Apartment> = {};

/** Ижил bbox-д хэт олон дахин fetch хийхгүй (ms). */
const BOUNDS_FETCH_TTL_MS = 90_000;

/** Түлхүүрүүдийн дээд хязгаар — санах ой. */
const MAX_TRACKED_BOUND_KEYS = 120;

const fetchedAtByBoundsKey = new Map<string, number>();

const KEY_DECIMALS = 3;

export function mapBoundsQueryCacheKey(b: MapBoundsLiteral): string {
  return [b.south, b.north, b.west, b.east]
    .map((n) => n.toFixed(KEY_DECIMALS))
    .join("|");
}

export function listingInQueryBounds(
  apartment: Apartment,
  queryBounds: MapBoundsLiteral,
): boolean {
  const { lat, lng } = apartment.coordinates;
  return (
    lat >= queryBounds.south &&
    lat <= queryBounds.north &&
    lng >= queryBounds.west &&
    lng <= queryBounds.east
  );
}

/** Кэшээс тухайн API bbox-д орсон заруудыг шүүж буцаана. */
export function pickListingsInQueryBounds(
  queryBounds: MapBoundsLiteral,
): Apartment[] {
  return Object.values(listingById).filter((a) =>
    listingInQueryBounds(a, queryBounds),
  );
}

export function mergeMapListingsIntoCache(apartments: Apartment[]): void {
  for (const a of apartments) {
    listingById[a.id] = a;
  }
}

export function shouldSkipMapListingFetch(boundsKey: string): boolean {
  const at = fetchedAtByBoundsKey.get(boundsKey);
  if (at === undefined) return false;
  return Date.now() - at < BOUNDS_FETCH_TTL_MS;
}

export function markMapListingsFetched(boundsKey: string): void {
  fetchedAtByBoundsKey.set(boundsKey, Date.now());
  while (fetchedAtByBoundsKey.size > MAX_TRACKED_BOUND_KEYS) {
    const first = fetchedAtByBoundsKey.keys().next().value;
    if (first === undefined) break;
    fetchedAtByBoundsKey.delete(first);
  }
}
