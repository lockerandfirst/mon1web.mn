"use client";

import { ApplicationForm } from "@/components/agent-portal/application-form";
import { AgentStepsSidebar } from "@/components/agent-portal/agent-steps-sidebar";

/** Агент болох өргөдөл + алхмууд — нийтийн агент порталд */
export function PortalAgentSignupSection() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
      <ApplicationForm />
      <AgentStepsSidebar />
    </div>
  );
}
