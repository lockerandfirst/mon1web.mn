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
    { label: "Мэдээ", href: "/news" },
    { label: "Зар нэмэх", href: "/add-property" },
  ] as const;

  const legalLinks = [
    { label: "Үйлчилгээний нөхцөл", href: "/terms" },
    { label: "Нууцлалын бодлого", href: "/privacy" },
  ] as const;

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* TIGHTENED: pt-6 on mobile to keep it from feeling like a whole page */}
      <div className="container mx-auto px-6 pt-6 md:pt-24 pb-8 md:pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-16 lg:gap-12">
          {/* Brand & Socials */}
          <div className="lg:col-span-5 space-y-4 md:space-y-8">
            <div className="flex items-center justify-between md:block">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/ZAAAA.png"
                  alt="Mon1 logo"
                  width={30}
                  height={30}
                  className="w-16 md:w-25 object-contain"
                />
              </Link>
              {/* Socials moved to same line as logo on mobile to save space */}
              <div className="flex gap-2 md:mt-8 md:gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm transition-all"
                  >
                    <item.icon className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  </a>
                ))}
              </div>
            </div>

            <p className="hidden md:block text-slate-500 text-base leading-relaxed max-w-sm font-medium italic">
              Монголын үл хөдлөх хөрөнгийн зах зээлд шинэ стандарт тогтоож буй
              хамгийн том платформ.
            </p>
          </div>

          {/* Quick Links & Phone numbers combined in a grid on mobile to stay 'small' */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-4">
            <div>
              <h3 className="text-slate-900 font-black uppercase tracking-widest text-[9px] md:text-[11px] mb-3 md:mb-8 italic">
                Хурдан холбоос
              </h3>
              <ul className="space-y-2 md:space-y-4">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-blue-600 text-[10px] md:text-sm font-bold flex items-center gap-0 group uppercase tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:mt-10">
              <h3 className="text-slate-900 font-black uppercase tracking-widest text-[9px] md:text-[11px] mb-3 italic md:hidden">
                Холбоо барих
              </h3>
              <div className="space-y-2 md:space-y-4">
                <a
                  href="tel:+97694948873"
                  className="flex items-center gap-2 text-slate-900 font-black italic text-[11px] md:text-lg tracking-tighter"
                >
                  <Phone className="h-3 w-3 text-blue-600 md:hidden" /> 94948873
                </a>
                <a
                  href="tel:+97694498873"
                  className="flex items-center gap-2 text-slate-900 font-black italic text-[11px] md:text-lg tracking-tighter"
                >
                  <Phone className="h-3 w-3 text-blue-600 md:hidden" /> 94498873
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter - Simplified for mobile */}
          <div className="lg:col-span-4 space-y-4 md:space-y-10">
            <div className="relative group w-full">
              <Input
                placeholder="И-мэйл..."
                className="bg-slate-50 border-slate-100 h-10 md:h-14 rounded-xl md:rounded-2xl pr-12 text-xs"
              />
              <Button
                type="button"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 md:h-11 md:w-11 bg-blue-600 text-white rounded-lg md:rounded-xl"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Very compact on mobile */}
        <div className="mt-6 md:mt-20 pt-4 border-t border-slate-50 flex justify-between items-center">
          <p className="text-slate-400 text-[9px] md:text-[12px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()}{" "}
            <span className="hidden md:inline">Mon1.mn</span>
          </p>

          <div className="flex gap-4 md:gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-slate-900 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-colors"
              >
                {/* Shortened text for mobile */}
                <span className="md:hidden">{link.label.split(" ")[0]}</span>
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
