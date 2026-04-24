import { useEffect, useState } from "react";

import type { Apartment } from "@/lib/data";
import { debug } from "@/lib/debug";
import { apiFetch } from "@/lib/backend-api";
import { apartmentFromApiListing } from "@/lib/portal/apartment-from-api-listing";

const FEATURED_POOL_MIN = 12;
const FEATURED_ROTATION_WINDOW_MS = 5 * 60 * 1000;
const FEATURED_SEED_STORAGE_KEY = "mon1-featured-seed-v1";

function readUserSeed(): number {
  if (typeof window === "undefined") return 0;
  const existing = window.localStorage.getItem(FEATURED_SEED_STORAGE_KEY);
  if (existing) {
    const parsed = Number.parseInt(existing, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  const next = Math.floor(Math.random() * 1_000_000);
  window.localStorage.setItem(FEATURED_SEED_STORAGE_KEY, String(next));
  return next;
}

function pickRotatingApartments(
  apartments: Apartment[],
  limit: number,
  seed: number,
): Apartment[] {
  if (apartments.length <= limit) {
    return apartments.slice(0, limit);
  }
  const bucket = Math.floor(Date.now() / FEATURED_ROTATION_WINDOW_MS);
  const start = (seed + bucket) % apartments.length;
  return Array.from({ length: limit }, (_, index) => {
    return apartments[(start + index) % apartments.length];
  });
}

export function useFeaturedApartments(limit = 3) {
  const [data, setData] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rotationTick, setRotationTick] = useState(() =>
    Math.floor(Date.now() / FEATURED_ROTATION_WINDOW_MS),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRotationTick(Math.floor(Date.now() / FEATURED_ROTATION_WINDOW_MS));
    }, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const poolLimit = Math.max(FEATURED_POOL_MIN, limit * 4);
        const response = await apiFetch<{
          success: boolean;
          data: Record<string, unknown>[];
        }>(
          `/api/listings?status=published&featured=true&limit=${encodeURIComponent(String(poolLimit))}`,
        );
        if (cancelled) return;
        const apartments = (response.data ?? []).map(
          (row) => apartmentFromApiListing(row).apartment,
        );
        const seed = readUserSeed();
        setData(pickRotatingApartments(apartments, limit, seed));
      } catch (error) {
        debug.error("useFeaturedApartments", "fetch failed", {
          message: error instanceof Error ? error.message : "unknown",
        });
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [limit, rotationTick]);

  return { data, isLoading };
}
