"use client";

import { PortalRequestCard } from "@/components/portal/portal-request-card";
import { useAgentSeekers } from "@/hooks/use-agent-seekers";

export function AgentSeekersGrid() {
  const { requests, ready } = useAgentSeekers();

  if (!ready) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-sm font-bold text-slate-500">
          Уншиж байна...
        </p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-4xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-black text-[#1a0b3b]">
            Одоогоор нээлттэй хүсэлт алга
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Хэрэглэгчид «Авна» хүсэлт оруулахад энд харагдана.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <p className="mb-8 text-center text-[10px] font-black uppercase tracking-[0.25em] text-[#ff3bad]">
        Нийт {requests.length} хүсэлт
      </p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {requests.map((request, index) => (
          <PortalRequestCard
            key={request.id}
            request={request}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
