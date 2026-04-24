"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fafafa]">
        <div className="flex flex-1 items-center justify-center px-4">
          <p className="text-sm font-bold text-slate-500">Уншиж байна...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const name =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Хэрэглэгч";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <main className="container mx-auto flex flex-1 flex-col px-4 py-16">
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(42, 0, 255,0.12)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#ff3bad]">
            Миний профайл
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1a0b3b]">
            {name}
          </h1>
          {email ? (
            <p className="mt-2 text-sm font-semibold text-slate-500">{email}</p>
          ) : null}
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Та агентын самбар руу орох эрхгүй байна. Хэрэв та агент бол
            удирдлагаас эрх нэмүүлнэ үү.
          </p>
          <Button
            asChild
            className="mt-8 h-12 rounded-2xl bg-[#2a00ff] font-black text-white hover:bg-[#2400d9]"
          >
            <Link href="/home">Нүүр хуудас</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
