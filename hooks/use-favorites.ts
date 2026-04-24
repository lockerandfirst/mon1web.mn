"use client";

import { useContext } from "react";

import {
  FavoritesContext,
  type FavoritesContextValue,
} from "@/lib/favorites/favorites-context";

/**
 * `FavoritesProvider`-ээс хадгалсан зарын төлөвийг уншина.
 *
 * Хэрэв provider-оос гадуур дуудвал `undefined` буцаахгүй, харин empty set-тэй
 * stub context буцаах — callers «signed-out» горим шиг харагдана (no-op toggle).
 */
const FALLBACK: FavoritesContextValue = {
  favoriteIds: new Set(),
  isReady: true,
  isMutating: false,
  isFavorite: () => false,
  toggle: async () => {},
  bulkToggle: async () => {},
  refresh: async () => {},
};

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  return ctx ?? FALLBACK;
}
