"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/backend-api";
import type { BuyRequest } from "@/lib/buy-requests";
import { debug } from "@/lib/debug";
import { buyRequestFromSupabaseRow } from "@/lib/portal/map-supabase-buy-request";

/**
 * Нээлттэй, агент сонгоогүй «авна» хүсэлтүүд — агент хайж буй хэрэглэгчдэд ойртуулсан жагсаалт.
 * Supabase-ийн `/api/buy-requests?status=open` -ыг дуудна.
 */
export function useAgentSeekers() {
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await apiFetch<{
          success: boolean;
          data: Record<string, unknown>[];
        }>("/api/buy-requests?status=open&limit=50");

        if (cancelled) return;

        const mapped = (response.data ?? [])
          .map((row) => buyRequestFromSupabaseRow(row))
          .filter(
            (r) => r.workflowStatus === "open" && r.assignedAgentId == null,
          )
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setRequests(mapped);
      } catch (error) {
        debug.error("useAgentSeekers", "fetch failed", {
          message: error instanceof Error ? error.message : "unknown",
        });
        if (!cancelled) setRequests([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { requests, ready };
}
