/** Leaflet `getBounds()`-тай ижил түлхүүрүүд (south/west/north/east). */
export type MapBoundsLiteral = {
  south: number;
  north: number;
  west: number;
  east: number;
};

/** Харагдаж буй хүрээнээс бага зэрэг томруулж ирж буй pin-үүд алдагдахгүй болгоно. */
export function padMapBounds(bounds: MapBoundsLiteral, ratio = 0.1): MapBoundsLiteral {
  const latPad = (bounds.north - bounds.south) * ratio;
  const lngPad = (bounds.east - bounds.west) * ratio;
  return {
    south: bounds.south - latPad,
    north: bounds.north + latPad,
    west: bounds.west - lngPad,
    east: bounds.east + lngPad,
  };
}

/**
 * `/api/listings/map` нь хэт том bbox-ийг зөвшөөрдөггүй.
 * Хол зайнаас харахад padding + том хүрээ 400 өгч зарууд цэвэрлэгддэг тул
 * харагдаж буй төвийг хадгалж хүрээг API-ийн дээд хэмжээнд багтаана.
 */
export function clampMapBoundsToMaxSpan(
  bounds: MapBoundsLiteral,
  maxLatSpan = 2.45,
  maxLngSpan = 2.45,
): MapBoundsLiteral {
  let { south, north, west, east } = bounds;
  const latSpan = north - south;
  const lngSpan = east - west;

  if (latSpan > maxLatSpan) {
    const mid = (south + north) / 2;
    const half = maxLatSpan / 2;
    south = mid - half;
    north = mid + half;
  }

  if (lngSpan > maxLngSpan) {
    const mid = (west + east) / 2;
    const half = maxLngSpan / 2;
    west = mid - half;
    east = mid + half;
  }

  return { south, north, west, east };
}

/** Padding + API-д багтах clamp — газрын зураг бүх зум дээр ажиллана. */
export function boundsForMapListingsQuery(bounds: MapBoundsLiteral): MapBoundsLiteral {
  return clampMapBoundsToMaxSpan(padMapBounds(bounds));
}
