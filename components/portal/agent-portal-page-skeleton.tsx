import type { ReactNode } from "react";

import type { AgentPortalTab } from "@/components/portal/portal-types";
import {
  AgentPortalAuthContentSkeleton,
  AgentPortalTabBodySkeleton,
} from "@/components/portal/agent-portal-tab-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function AgentPortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="mt-18 flex min-h-[calc(100vh-5rem)] flex-1 flex-col overflow-x-hidden md:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r border-[#2a00ff]/10 bg-white/90 p-4 backdrop-blur-md md:flex md:py-8">
        <Skeleton className="mx-3 mb-2 h-3 w-20 rounded-md" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-14 w-full rounded-3xl bg-[#2a00ff]/8"
            />
          ))}
        </div>
        <div className="flex-1" aria-hidden />
        <Skeleton className="h-12 w-full rounded-3xl" />
      </aside>
      <section className="flex min-h-0 flex-1 flex-col bg-[#f5f3ff]">
        <header className="border-b border-[#2a00ff]/10 bg-white/80 px-4 py-6 backdrop-blur-md md:px-10 md:py-8">
          <div className="mb-3 flex justify-end md:hidden">
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-[min(100%,20rem)] max-w-md rounded-lg md:h-10" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-lg rounded-md" />
        </header>
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-10 md:pb-10">
          {children}
        </div>
      </section>
    </div>
  );
}

/**
 * Нэвтрэлт / Clerk gate — listing grid-гүй ерөнхий placeholder.
 */
export function AgentPortalPageSkeleton() {
  return (
    <AgentPortalShell>
      <AgentPortalAuthContentSkeleton />
    </AgentPortalShell>
  );
}

/**
 * Dashboard ачаалах үед — сонгосон табын skeleton (profile / buy requests тусдаа).
 */
export function AgentPortalDashboardSkeleton({
  activeTab,
}: {
  activeTab: AgentPortalTab;
}) {
  return (
    <AgentPortalShell>
      <AgentPortalTabBodySkeleton tab={activeTab} />
    </AgentPortalShell>
  );
}
