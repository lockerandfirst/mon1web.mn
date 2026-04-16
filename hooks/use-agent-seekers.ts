"use client";

import { useEffect, useState } from "react";

import type { BuyRequest } from "@/lib/buy-requests";
import { readBuyRequests } from "@/lib/buy-requests";

/** Нээлттэй, агент сонгоогүй «авна» хүсэлтүүд — агент хайж буй хэрэглэгчдэд ойртуулсан жагсаалт */
export function useAgentSeekers() {
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRequests(
      readBuyRequests()
        .filter(
          (r) => r.workflowStatus === "open" && r.assignedAgentId == null,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
    setReady(true);
  }, []);

  return { requests, ready };
}
