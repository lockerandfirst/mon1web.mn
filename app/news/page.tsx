import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Newspaper, Sparkles, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { fetchNewsItems } from "@/lib/news";

export const metadata: Metadata = {
  title: "Mon1.mn - Мэдээ мэдээлэл",
  description:
    "Үл хөдлөх хөрөнгө, зах зээл, санхүүтэй холбоотой хамгийн сүүлийн үеийн мэдээ мэдээлэл.",
};

export const revalidate = 120;

export default async function MedeeePage() {
  const newsItems = await fetchNewsItems();

  return (
    <div className="min-h-screen bg-[#fff9fd]">
      <main>
        <section className="relative overflow-hidden px-4 pb-28 pt-24 md:py-32">
          {/* --- BRAND BACKGROUND --- */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(42, 0, 255,0.11),transparent_52%),radial-gradient(circle_at_bottom_left,rgba(255,0,200,0.22),transparent_56%)]" />

          <div className="relative z-10 container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              {/* --- FITTED BADGE --- */}
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#2a00ff]/10 bg-[#eeebff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#2a00ff] shadow-sm">
                <Newspaper className="h-3.5 w-3.5" />
                <span className="leading-none text-[#2a00ff]">
                  Мэдээ мэдээлэл
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-5xl md:text-7xl">
                Зах зээлийн <span className="text-[#ff00c8] italic">тойм</span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-[13px] font-medium leading-relaxed text-[#ff3ccf] sm:text-base">
                Үл хөдлөх хөрөнгө болон эдийн засгийн салбарын хамгийн
                найдвартай эх сурвалжуудын нэгдсэн холбоос.
              </p>
            </div>

            {/* --- NEWS GRID --- */}
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:mt-16 md:gap-6 md:grid-cols-2">
              {newsItems.length === 0 ? (
                <div className="col-span-full rounded-4xl border border-dashed border-[#2a00ff]/20 bg-white/60 px-6 py-16 text-center text-sm font-medium text-slate-600 backdrop-blur-md md:rounded-[2.5rem] md:px-10 md:text-base">
                  Мэдээний жагсаалт одоогоор хоосон байна эсвэл тохиргоо дутуу
                  байна. Админ Supabase дээрх{" "}
                  <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                    news
                  </code>{" "}
                  хүснэгт болон орчны хувьсагчийг шалгана уу.
                </div>
              ) : null}
              {newsItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-4xl border border-white bg-white/70 p-5 shadow-[0_20px_40px_-16px_rgba(42, 0, 255,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#ff00c8]/30 hover:shadow-[0_40px_80px_-20px_rgba(255,0,200,0.15)] md:rounded-[2.5rem] md:p-8 md:shadow-[0_32px_64px_-16px_rgba(42, 0, 255,0.1)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#fff1f9] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ff00c8] md:mb-5 md:gap-2 md:px-3 md:py-1.5 md:tracking-[0.18em]">
                        <Sparkles className="h-3 w-3" />
                        {item.source}
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2 text-[#2a00ff] transition-all duration-300 group-hover:bg-[#2a00ff] group-hover:text-white md:rounded-2xl md:p-2.5">
                        <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>

                    <h2 className="text-xl font-black leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-[#2a00ff] md:text-2xl">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-500 md:mt-4 md:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 md:mt-8 md:pt-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8]">
                      Үзэх
                    </span>
                    <span className="truncate text-xs font-bold text-slate-400 group-hover:text-[#2a00ff] transition-colors">
                      {item.href.replace("https://", "")}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* --- BACK BUTTON --- */}
            <div className="mt-10 text-center md:mt-16">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-[#2a00ff] hover:shadow-xl hover:shadow-[#2a00ff]/30 active:scale-95 md:px-8 md:py-4 md:text-xs md:tracking-[0.2em]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Нүүр хуудас
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
