"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AgentHero } from "@/components/agent-portal/agent-hero";
import { ApplicationForm } from "@/components/agent-portal/application-form";
import { AgentLoginForm } from "@/components/agent-portal/agent-login-form";
import { AgentStepsSidebar } from "@/components/agent-portal/agent-steps-sidebar";

// Sub-components

export default function AgentPortalPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-600/10 flex flex-col">
      <Header />

      <main className="flex-1 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] w-full flex items-center justify-center bg-slate-50 overflow-hidden pt-20 pb-20">
          {/* Background visuals remain in the Hero component or as a shared background wrapper */}
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <AgentHero />
              <AgentLoginForm />
            </div>
          </div>
        </section>

        {/* APPLICATION SECTION */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <ApplicationForm />
            <AgentStepsSidebar />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
