import type { Agent, Apartment } from "@/lib/data";

const PREFIX = "mon1:dashboard:v1:";
const TTL_MS = 3 * 60 * 1000;

export type DashboardSessionSnapshot = {
  agent: Agent;
  listings: Apartment[];
  favorites: Apartment[];
  savedAt: number;
};

function key(userId: string) {
  return `${PREFIX}${userId}`;
}

export function readDashboardSessionCache(
  userId: string,
): DashboardSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DashboardSessionSnapshot;
    if (!parsed?.savedAt || !parsed.agent) return null;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      sessionStorage.removeItem(key(userId));
      return null;
    }
    return {
      agent: parsed.agent,
      listings: Array.isArray(parsed.listings) ? parsed.listings : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

export function writeDashboardSessionCache(
  userId: string,
  snapshot: Omit<DashboardSessionSnapshot, "savedAt">,
) {
  if (typeof window === "undefined") return;
  try {
    const payload: DashboardSessionSnapshot = {
      ...snapshot,
      savedAt: Date.now(),
    };
    sessionStorage.setItem(key(userId), JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function patchDashboardSessionListings(
  userId: string,
  listings: Apartment[],
) {
  const prev = readDashboardSessionCache(userId);
  if (!prev) return;
  writeDashboardSessionCache(userId, {
    agent: prev.agent,
    listings,
    favorites: prev.favorites,
  });
}
