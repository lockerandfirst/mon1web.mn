import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  children: ReactNode;
};

export function AuthShell({
  badge,
  title,
  description,
  highlights,
  children,
}: AuthShellProps) {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(42, 0, 255,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,59,173,0.16),transparent_42%),linear-gradient(180deg,rgba(255,249,253,0.88)_0%,rgba(255,255,255,0.98)_100%)]" />
        <div className="absolute -top-16 right-0 h-80 w-80 rounded-full bg-[#d8d0ff]/60 blur-[110px]" />
        <div className="absolute -bottom-12 left-0 h-72 w-72 rounded-full bg-[#ffd5ec]/70 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-3 py-2 shadow-[0_16px_40px_-24px_rgba(42, 0, 255,0.35)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg shadow-[#2a00ff]/20">
              <Image
                src="/ok.png"
                alt="Mon1 logo"
                width={40}
                height={40}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-brand-gradient">
                Mon1.mn
              </p>
              <p className="text-xs font-semibold text-[#a25691]">
                Үл хөдлөхийн дижитал marketplace
              </p>
            </div>
          </Link>

          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-bold text-[#2a00ff] shadow-[0_16px_40px_-24px_rgba(42, 0, 255,0.35)] backdrop-blur-xl transition-all hover:border-[#ff9cd5] hover:text-[#ff3bad]"
          >
            <ArrowLeft className="h-4 w-4" />
            Нүүр рүү буцах
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 p-6 shadow-[0_32px_80px_-30px_rgba(42, 0, 255,0.33)] backdrop-blur-xl md:p-8 lg:p-10">
            <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-[#d7ceff]/50 blur-[70px]" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#ffd5ec]/55 blur-[65px]" />

            <div className="relative max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#eeebff] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#2a00ff]">
                <Sparkles className="h-4 w-4 " />
                {badge}
              </div>

              <h1 className="max-w-lg text-4xl font-black leading-[0.94] tracking-tight text-[#2a00ff] sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#965289] sm:text-lg">
                {description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-[#e7dcff] bg-[#f8f6ff] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#2a00ff]">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-[0.24em]">
                      Аюулгүй Нэвтрэлт
                    </p>
                  </div>
                  <p className="text-sm font-medium leading-6 text-[#8f4d88]">
                    Clerk authentication одоо Mon1-ийн өнгө төрхөд ууссан тул
                    хэрэглэгч эхний click-ээсээ л танай бүтээгдэхүүн дотор байна
                    гэсэн мэдрэмж авна.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-[#ffd6eb] bg-[#fff5fb] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#ff3bad]">
                    <Building2 className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-[0.24em]">
                      Mon1-д Тааруулсан
                    </p>
                  </div>
                  <p className="text-sm font-medium leading-6 text-[#8f4d88]">
                    Өнгө, өнцөг, contrast, CTA button-ууд бүгд homepage болон
                    header-ийн нэг visual system-ийг дагаж шинэчлэгдсэн.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_24px_50px_-30px_rgba(42, 0, 255,0.26)]">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#ff3bad]">
                  Яагаад Илүү Зохицож Байгаа Вэ
                </p>
                <div className="space-y-3">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2a00ff]" />
                      <p className="text-sm font-semibold leading-6 text-[#6f4b86]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-6 top-6 h-24 rounded-full bg-[#d8d0ff]/50 blur-[55px]" />
            <div className="relative rounded-[2.5rem] border border-white/80 bg-white/78 p-4 shadow-[0_36px_90px_-34px_rgba(42, 0, 255,0.35)] backdrop-blur-xl sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
