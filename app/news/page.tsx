import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Newspaper, Sparkles, ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Mon1.mn - Мэдээ мэдээлэл",
  description:
    "Үл хөдлөх хөрөнгө, зах зээл, санхүүтэй холбоотой хамгийн сүүлийн үеийн мэдээ мэдээлэл.",
};

const newsItems = [
  {
    title: "News.mn дээрх сүүлийн үеийн мэдээнүүд",
    description:
      "Ерөнхий мэдээ, эдийн засаг, үл хөдлөхийн холбоотой нийтлэлүүдийг эндээс үзээрэй.",
    href: "https://news.mn/",
    source: "News.mn",
  },
  {
    title: "SAK.mn дээрх сүүлийн үеийн мэдээнүүд",
    description:
      "Үл хөдлөх хөрөнгө, зах зээл, санхүүтэй холбоотой хамгийн сүүлийн үеийн мэдээ мэдээлэл.",
    href: "https://sak.mn/",
    source: "SAK.mn",
  },
  {
    title: "News.mn дээрх сүүлийн үеийн мэдээнүүд",
    description:
      "Ерөнхий мэдээ, эдийн засаг, үл хөдлөхийн холбоотой нийтлэлүүдийг эндээс үзээрэй.",
    href: "https://news.mn/",
    source: "News.mn",
  },
  {
    title: "Ikon.mn эдийн засгийн булан",
    description:
      "Зах зээлийн хөдөлгөөн, санхүү, барилгын салбарын мэдээллийг унших холбоос.",
    href: "https://ikon.mn/l/2",
    source: "Ikon.mn",
  },
  {
    title: "Unread Today бизнесийн тойм",
    description:
      "Тренд, бизнес, хөрөнгө оруулалтын агуулгатай нийтлэлүүдийн хуудас.",
    href: "https://unread.today/",
    source: "Unread Today",
  },
  {
    title: "Montsame эдийн засгийн мэдээ",
    description:
      "Албан эх сурвалжийн эдийн засаг, бүтээн байгуулалтын мэдээллийг харах холбоос.",
    href: "https://montsame.mn/mn/economy",
    source: "Montsame",
  },
] as const;

export default function MedeeePage() {
  return (
    <div className="min-h-screen bg-[#fff9fd]">
      <Header />

      <main>
        <section className="relative overflow-hidden px-4 py-20 md:py-32">
          {/* --- BRAND BACKGROUND --- */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(42,0,255,0.11),transparent_52%),radial-gradient(circle_at_bottom_left,rgba(255,0,200,0.22),transparent_56%)]" />

          <div className="relative z-10 container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              {/* --- FITTED BADGE --- */}
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#2a00ff]/10 bg-[#eeebff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#2a00ff] shadow-sm">
                <Newspaper className="h-3.5 w-3.5" />
                <span className="leading-none text-[#2a00ff]">
                  Мэдээ мэдээлэл
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl md:text-7xl">
                Зах зээлийн <span className="text-[#ff00c8] italic">тойм</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-sm font-medium leading-relaxed text-[#ff3ccf] sm:text-base">
                Үл хөдлөх хөрөнгө болон эдийн засгийн салбарын хамгийн
                найдвартай эх сурвалжуудын нэгдсэн холбоос.
              </p>
            </div>

            {/* --- NEWS GRID --- */}
            <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
              {newsItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white bg-white/70 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#ff00c8]/30 hover:shadow-[0_40px_80px_-20px_rgba(255,0,200,0.15)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#fff1f9] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#ff00c8]">
                        <Sparkles className="h-3 w-3" />
                        {item.source}
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-2.5 text-[#2a00ff] transition-all duration-300 group-hover:bg-[#2a00ff] group-hover:text-white">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-[#2a00ff]">
                      {item.title}
                    </h2>

                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
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
            <div className="mt-16 text-center">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#2a00ff] hover:shadow-xl hover:shadow-[#2a00ff]/30 active:scale-95"
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
