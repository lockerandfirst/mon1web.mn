"use client";

import { useAuth, useUser } from "@clerk/nextjs";

import { Footer } from "@/components/footer";
import { AgentHero } from "@/components/agent-portal/agent-hero";
import { AgentLoginForm } from "@/components/agent-portal/agent-login-form";
import { PortalAgentSignupSection } from "@/components/portal/portal-agent-signup-section";
import { AgentPortalDashboard } from "@/components/portal/agent-portal-dashboard";
import { isAgent } from "@/lib/auth";

function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] selection:bg-blue-600/10">
      {children}
    </div>
  );
}

export default function AgentPortalPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const isPortalAgent =
    authLoaded &&
    userLoaded &&
    isSignedIn &&
    isAgent({ publicMetadata: user?.publicMetadata ?? null });

  if (!authLoaded || (isSignedIn && !userLoaded)) {
    return (
      <PortalShell>
        <div className="flex flex-1 items-center justify-center px-4 py-24">
          <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
        </div>
      </PortalShell>
    );
  }

  if (isPortalAgent) {
    return (
      <PortalShell>
        <main className="flex flex-1 flex-col">
          <AgentPortalDashboard />
        </main>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <main className="flex-1 overflow-x-hidden">
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 pt-16 pb-14 md:px-0 md:pt-18 md:pb-16">
          <div className="container relative z-10 mx-auto w-full px-4 md:px-0">
            <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
              <AgentHero />
              <AgentLoginForm />
            </div>
          </div>
        </section>
        <section
          id="agent-apply"
          className="container mx-auto w-full scroll-mt-24 px-4 py-14 md:px-0 md:py-18"
        >
          <PortalAgentSignupSection />
        </section>
      </main>
    </PortalShell>
  );
}
