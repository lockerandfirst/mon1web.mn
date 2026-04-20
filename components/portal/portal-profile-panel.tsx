"use client";

import { useUser } from "@clerk/nextjs";
import { Mail, User } from "lucide-react";

import { ClerkAppUserButton } from "@/components/clerk-app-user-button";

export function PortalProfilePanel() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  const name =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Агент";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(42,0,255,0.15)]">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <ClerkAppUserButton />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#ff3bad]">
            Профайл
          </p>
          <h2 className="text-2xl font-black tracking-tight text-[#1a0b3b]">
            {name}
          </h2>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 rounded-3xl bg-[#f8f6ff] px-4 py-3">
          <User className="h-5 w-5 shrink-0 text-[#2a00ff]" />
          <div className="min-w-0 text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
              Нэр
            </p>
            <p className="truncate font-bold text-[#1a0b3b]">{name}</p>
          </div>
        </div>
        {email ? (
          <div className="flex items-center gap-3 rounded-3xl bg-[#fff9fd] px-4 py-3">
            <Mail className="h-5 w-5 shrink-0 text-[#2a00ff]" />
            <div className="min-w-0 text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
                И-мэйл
              </p>
              <p className="truncate font-bold text-[#1a0b3b]">{email}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
