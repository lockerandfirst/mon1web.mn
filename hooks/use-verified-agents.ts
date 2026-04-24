"use client";

import { useEffect, useState } from "react";

import type { Agent } from "@/lib/data";
import { apiFetch } from "@/lib/backend-api";
import { debug } from "@/lib/debug";

/**
 * Supabase-ээс баталгаажсан агентуудыг татаж авах hook.
 * `add-property` болон бусад агент сонгох UI-д ашиглана.
 */
export function useVerifiedAgents(limit = 12) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch<{
          success: boolean;
          data: Agent[];
        }>(
          `/api/agents?verified=true&limit=${encodeURIComponent(String(limit))}`,
        );
        if (cancelled) return;
        setAgents(response.data ?? []);
      } catch (error) {
        debug.error("useVerifiedAgents", "fetch failed", {
          message: error instanceof Error ? error.message : "unknown",
        });
        if (!cancelled) setAgents([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { agents, isLoading };
}
