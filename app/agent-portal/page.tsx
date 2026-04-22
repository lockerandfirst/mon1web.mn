"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AgentHero } from "@/components/agent-portal/agent-hero";
import { AgentLoginForm } from "@/components/agent-portal/agent-login-form";
import { PortalAgentSignupSection } from "@/components/portal/portal-agent-signup-section";
import { AgentPortalDashboard } from "@/components/portal/agent-portal-dashboard";
import { apiFetch } from "@/lib/backend-api";

function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f3ff] selection:bg-[#2a00ff]/15">
      {children}
    </div>
  );
}

type PortalGate = "loading" | "allow" | "deny";
const AGENT_PORTAL_GATE_CACHE_KEY = "agent-portal-gate-v1";
const AGENT_PORTAL_GATE_TTL_MS = 5 * 60 * 1000;

function readGateCache(): { allow: boolean; ts: number } | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(AGENT_PORTAL_GATE_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { allow?: boolean; ts?: number };
    if (typeof parsed.allow !== "boolean" || typeof parsed.ts !== "number") {
      return null;
    }
    return { allow: parsed.allow, ts: parsed.ts };
  } catch {
    return null;
  }
}

function writeGateCache(allow: boolean) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(
    AGENT_PORTAL_GATE_CACHE_KEY,
    JSON.stringify({ allow, ts: Date.now() }),
  );
}

export default function AgentPortalPage() {
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const [gate, setGate] = useState<PortalGate>("loading");

  useEffect(() => {
    if (!authLoaded) {
      return;
    }
    if (!isSignedIn) {
      setGate("deny");
      writeGateCache(false);
      return;
    }

    let cancelled = false;
    const cached = readGateCache();
    if (cached?.allow && Date.now() - cached.ts < AGENT_PORTAL_GATE_TTL_MS) {
      setGate("allow");
    } else {
      setGate("loading");
    }

    void (async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (!cancelled) {
            setGate("deny");
            writeGateCache(false);
          }
          return;
        }
        await apiFetch("/api/agents/me", { token });
        if (!cancelled) {
          setGate("allow");
          writeGateCache(true);
        }
      } catch {
        if (!cancelled) {
          setGate("deny");
          writeGateCache(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoaded, isSignedIn, getToken]);

  if (!authLoaded) {
    return (
      <PortalShell>
        <div className="flex flex-1 items-center justify-center px-4 py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2a00ff]/20 bg-white px-4 py-2 text-sm font-bold text-[#2a00ff]/80 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Түр хүлээнэ үү...
          </div>
        </div>
      </PortalShell>
    );
  }

  if (isSignedIn && gate === "loading") {
    return (
      <PortalShell>
        <div className="flex flex-1 items-center justify-center px-4 py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2a00ff]/20 bg-white px-4 py-2 text-sm font-bold text-[#2a00ff]/80 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Түр хүлээнэ үү...
          </div>
        </div>
      </PortalShell>
    );
  }

  if (isSignedIn && gate === "allow") {
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
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f0edff] px-4 pt-16 pb-14 md:px-0 md:pt-18 md:pb-16">
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
