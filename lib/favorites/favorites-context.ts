"use client";

import { createContext } from "react";

export interface FavoritesContextValue {
  /** Бүх хадгалсан зарын id-ууд. */
  favoriteIds: ReadonlySet<string>;
  /** Серверээс эхний татлага дуусав уу. */
  isReady: boolean;
  /** Аль нэг үйлдэл хүлээгдэж байгаа эсэх (bulk эсвэл toggle). */
  isMutating: boolean;
  /** Тухайн зар хадгалсан эсэх. */
  isFavorite(listingId: string): boolean;
  /** Нэг зарыг toggle — optimistic шинэчлэлттэй. */
  toggle(listingId: string): Promise<void>;
  /** Олон зарыг нэг дор: action = add | remove | toggle. */
  bulkToggle(
    listingIds: string[],
    action: "add" | "remove" | "toggle",
  ): Promise<void>;
  /** Серверээс дахин татаж refresh хийх. */
  refresh(): Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);
