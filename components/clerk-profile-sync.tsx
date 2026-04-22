"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

import { apiFetch } from "@/lib/backend-api";

/**
 * Нэвтэрсэн Clerk хэрэглэгчийг Supabase `profiles` хүснэгтэд upsert хийнэ.
 */
export function ClerkProfileSync() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      synced.current = false;
      return;
    }
    if (synced.current) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) {
          return;
        }
        await apiFetch("/api/profile/sync", { method: "POST", token });
        if (!cancelled) {
          synced.current = true;
        }
      } catch {
        if (!cancelled) {
          synced.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
