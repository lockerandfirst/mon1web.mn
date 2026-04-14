"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://x.com", label: "X (Twitter)" },
  ] as const;

  const quickLinks = [
    { label: "Зарууд үзэх", href: "/listings" },
    { label: "Газрын зураг", href: "/map" },
    { label: "Мэдээ", href: "/medeee" },
    { label: "Агент хайх", href: "/agents" },
    { label: "Зар нэмэх", href: "/add-property" },
  ] as const;

  const legalLinks = [
    { label: "Үйлчилгээний нөхцөл", href: "/terms" },
    { label: "Нууцлалын бодлого", href: "/privacy" },
  ] as const;

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden">
      {/* Background Decor - Зөөлөн цэнхэр туяанууд */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
          {/* Brand & Mission (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/ZAAAA.png"
                alt="Mon1 logo"
                width={30}
                height={30}
                className="w-25 object-contain " // 'invert grayscale'-ийг устгав
              />
            </Link>

            <p className="text-slate-500 text-base leading-relaxed max-w-sm font-medium italic">
              Монголын үл хөдлөх хөрөнгийн зах зээлд шинэ стандарт тогтоож буй
              хамгийн том платформ. Бид танд зөвхөн баталгаажсан зар, мэргэжлийн
              агентлагуудыг санал болгодог.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 shadow-sm transition-all duration-300"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (3 Columns) */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-[11px] mb-8 italic">
              Хурдан холбоос
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-500 hover:text-blue-600 text-sm font-bold flex items-center gap-0 hover:gap-3 transition-all duration-300 group uppercase tracking-tight"
                  >
                    <div className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter (4 Columns) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <h3 className="text-slate-900 font-black uppercase tracking-widest text-[11px] italic">
                Мэдээлэл авах
              </h3>
              <p className="text-slate-500 text-sm font-semibold">
                Шинэ заруудын мэдээллийг и-мэйлээр шууд хүлээн аваарай.
              </p>
              <div className="relative group max-w-sm">
                <Input
                  placeholder="И-мэйл хаяг..."
                  className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl focus-visible:ring-blue-600/10 focus-visible:border-blue-600 transition-all pr-14 font-medium"
                />
                <Button
                  type="button"
                  size="icon"
                  aria-label="Имэйл илгээх"
                  className="absolute right-1.5 top-1.5 h-11 w-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <a
                  href="tel:+97694948873"
                  className="text-slate-900 font-black italic text-lg tracking-tighter hover:text-blue-600 transition-colors"
                >
                  +976 94948873
                </a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <a
                  href="tel:+97694948873"
                  className="text-slate-900 font-black italic text-lg tracking-tighter hover:text-blue-600 transition-colors"
                >
                  +976 94498873
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[12px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-slate-900">Mon1.mn</span>. Бүх эрх
            хамгаалагдсан.
          </p>

          <div className="flex gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
