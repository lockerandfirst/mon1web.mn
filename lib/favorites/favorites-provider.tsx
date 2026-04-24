"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { apiFetch } from "@/lib/backend-api";
import { debug } from "@/lib/debug";

import {
  FavoritesContext,
  type FavoritesContextValue,
} from "./favorites-context";

/**
 * `FavoritesProvider` — `/api/saved-listings`-ыг frontend-той sync-т барих context.
 *
 * - Signed-in хэрэглэгчийн favorites-ыг эхний mount-д нэг удаа татна (idsOnly=true).
 * - `toggle(id)` — optimistic update + сервер рүү POST/DELETE.
 * - `bulkToggle(ids, action)` — `/api/saved-listings/bulk` дуудна, серверийн буцаасан
 *   id-уудаар дахин syncлэнэ.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();

  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());
  const [isReady, setIsReady] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const inflightRef = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setIds(new Set());
      setIsReady(true);
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        setIds(new Set());
        setIsReady(true);
        return;
      }
      const res = await apiFetch<{ success: boolean; data: string[] }>(
        "/api/saved-listings?idsOnly=true",
        { token },
      );
      setIds(new Set(res.data ?? []));
    } catch (error) {
      debug.warn("FavoritesProvider", "refresh failed", {
        message: error instanceof Error ? error.message : "unknown",
      });
      setIds(new Set());
    } finally {
      setIsReady(true);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!userLoaded) return;
    void refresh();
  }, [userLoaded, refresh]);

  const toggle = useCallback(
    async (listingId: string) => {
      if (!listingId || !isSignedIn) return;
      if (inflightRef.current.has(listingId)) return;
      inflightRef.current.add(listingId);

      const previous = ids;
      const next = new Set(previous);
      const wasFavorite = next.has(listingId);
      if (wasFavorite) next.delete(listingId);
      else next.add(listingId);
      setIds(next);
      setIsMutating(true);

      try {
        const token = await getToken();
        if (!token) throw new Error("Нэвтрэх токен алга.");
        await apiFetch("/api/saved-listings", {
          method: wasFavorite ? "DELETE" : "POST",
          token,
          body: { listingId },
        });
      } catch (error) {
        debug.warn("FavoritesProvider", "toggle failed", {
          listingId,
          message: error instanceof Error ? error.message : "unknown",
        });
        setIds(previous);
      } finally {
        inflightRef.current.delete(listingId);
        setIsMutating(false);
      }
    },
    [getToken, ids, isSignedIn],
  );

  const bulkToggle = useCallback(
    async (listingIds: string[], action: "add" | "remove" | "toggle") => {
      const cleaned = Array.from(new Set(listingIds.filter(Boolean)));
      if (cleaned.length === 0 || !isSignedIn) return;

      const previous = ids;
      const optimistic = new Set(previous);
      for (const id of cleaned) {
        if (action === "add") optimistic.add(id);
        else if (action === "remove") optimistic.delete(id);
        else if (optimistic.has(id)) optimistic.delete(id);
        else optimistic.add(id);
      }
      setIds(optimistic);
      setIsMutating(true);

      try {
        const token = await getToken();
        if (!token) throw new Error("Нэвтрэх токен алга.");
        const res = await apiFetch<{
          success: boolean;
          data: { action: string; listingIds: string[] };
        }>("/api/saved-listings/bulk", {
          method: "POST",
          token,
          body: { listingIds: cleaned, action },
        });
        setIds(new Set(res.data?.listingIds ?? []));
      } catch (error) {
        debug.warn("FavoritesProvider", "bulkToggle failed", {
          action,
          count: cleaned.length,
          message: error instanceof Error ? error.message : "unknown",
        });
        setIds(previous);
      } finally {
        setIsMutating(false);
      }
    },
    [getToken, ids, isSignedIn],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds: ids,
      isReady,
      isMutating,
      isFavorite: (id: string) => ids.has(id),
      toggle,
      bulkToggle,
      refresh,
    }),
    [ids, isReady, isMutating, toggle, bulkToggle, refresh],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
