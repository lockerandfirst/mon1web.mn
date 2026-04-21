import type { NearbyService } from "@/lib/data";

/** OSM дээр `name` байхгүй үед — форм дээр засварлаж болно */
export const NEARBY_SERVICE_UNNAMED_LABEL = "Нэргүй цэг";

type Coordinates = { lat: number; lng: number };

type OverpassElement = {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const RADIUS_METERS = 1200;

function haversineMeters(a: Coordinates, b: Coordinates) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const r = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const p =
    s1 * s1 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * r * Math.atan2(Math.sqrt(p), Math.sqrt(1 - p));
}

function toDistanceText(meters: number) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)}км`;
  return `${Math.round(meters)}м`;
}

function toWalkTimeText(meters: number) {
  const minutes = Math.max(1, Math.round(meters / 80));
  return `${minutes} мин`;
}

function classifyService(
  tags: Record<string, string> | undefined,
): NearbyService["type"] | null {
  if (!tags) return null;
  const amenity = tags.amenity || "";
  const shop = tags.shop || "";
  const highway = tags.highway || "";
  const publicTransport = tags.public_transport || "";

  if (amenity === "school" || amenity === "kindergarten") return "school";
  if (shop === "supermarket" || shop === "convenience") return "supermarket";
  if (highway === "bus_stop" || publicTransport === "platform") return "bus";
  if (amenity === "hospital" || amenity === "clinic") return "hospital";
  return null;
}

function normalizeElementCoordinates(el: OverpassElement): Coordinates | null {
  if (typeof el.lat === "number" && typeof el.lon === "number") {
    return { lat: el.lat, lng: el.lon };
  }
  if (el.center) {
    return { lat: el.center.lat, lng: el.center.lon };
  }
  return null;
}

export async function fetchNearbyServicesFromOsm(
  coordinates: Coordinates,
): Promise<NearbyService[]> {
  const query = `
    [out:json][timeout:20];
    (
      node(around:${RADIUS_METERS},${coordinates.lat},${coordinates.lng})["amenity"~"school|kindergarten|hospital|clinic"];
      node(around:${RADIUS_METERS},${coordinates.lat},${coordinates.lng})["shop"~"supermarket|convenience"];
      node(around:${RADIUS_METERS},${coordinates.lat},${coordinates.lng})["highway"="bus_stop"];
      node(around:${RADIUS_METERS},${coordinates.lat},${coordinates.lng})["public_transport"="platform"];
      way(around:${RADIUS_METERS},${coordinates.lat},${coordinates.lng})["amenity"~"school|kindergarten|hospital|clinic"];
      way(around:${RADIUS_METERS},${coordinates.lat},${coordinates.lng})["shop"~"supermarket|convenience"];
    );
    out body center;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error("Nearby services fetch failed");
  }

  const data = (await response.json()) as { elements?: OverpassElement[] };
  const candidates = (data.elements ?? [])
    .map((element) => {
      const type = classifyService(element.tags);
      const point = normalizeElementCoordinates(element);
      if (!type || !point) return null;
      const meters = haversineMeters(coordinates, point);
      const name = element.tags?.name || NEARBY_SERVICE_UNNAMED_LABEL;
      return { type, meters, name };
    })
    .filter((item): item is { type: NearbyService["type"]; meters: number; name: string } => Boolean(item))
    .sort((a, b) => a.meters - b.meters);

  const nearestByType = new Map<NearbyService["type"], { meters: number; name: string }>();
  for (const item of candidates) {
    if (!nearestByType.has(item.type)) {
      nearestByType.set(item.type, { meters: item.meters, name: item.name });
    }
  }

  return (["school", "supermarket", "bus", "hospital"] as NearbyService["type"][])
    .map((type) => {
      const value = nearestByType.get(type);
      if (!value) return null;
      return {
        type,
        name: value.name,
        distance: toDistanceText(value.meters),
        walkTime: toWalkTimeText(value.meters),
      };
    })
    .filter((item): item is NearbyService => Boolean(item));
}
