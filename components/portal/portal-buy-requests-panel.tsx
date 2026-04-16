"use client";

import type { BuyRequest } from "@/lib/buy-requests";

import { PortalRequestCard } from "@/components/portal/portal-request-card";

export function PortalBuyRequestsPanel({
  requests,
}: {
  requests: BuyRequest[];
}) {
  if (requests.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-black text-[#1a0b3b]">
          Нээлттэй хүсэлт байхгүй
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Хэрэглэгчид шинэ хүсэлт оруулахад энд жагсаагдана.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {requests.map((request, index) => (
        <PortalRequestCard key={request.id} request={request} index={index} />
      ))}
    </div>
  );
}
