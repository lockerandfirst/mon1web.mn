"use client";

import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Одоо хаана байгааг мэдэхэд хэрэгтэй
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Plus,
  Home,
  Map,
  LayoutGrid,
  BriefcaseBusiness,
  LayoutDashboard,
  Newspaper,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // classNames нэгтгэх функц
import { clerkAppearance, clerkUserButtonAppearance } from "@/lib/clerk-theme";

export function Header() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll хийхэд Header-ийн өнгө өөрчлөгдөх эффект
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Use a small hysteresis gap so sticky height changes don't bounce
      // around one exact threshold and cause a resize loop.
      setScrolled((prev) => {
        if (prev) {
          return currentScrollY > 8;
        }

        return currentScrollY > 24;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Нүүр", href: "/home", icon: Home },
    { name: "Зарууд", href: "/listings", icon: LayoutGrid },
    { name: "Газрын зураг", href: "/map", icon: Map },
    { name: "Мэдээ", href: "/news", icon: Newspaper },
    { name: "Агент портал", href: "/agent-portal", icon: BriefcaseBusiness },
    { name: "Хянах самбар", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b py-3 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/ZAAAA.png"
            alt="Mon1 logo"
            width={30}
            height={30}
            className="w-25 object-contain " // 'invert grayscale'-ийг устгав
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center bg-muted/50 rounded-full px-2 py-1 border border-border/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-[16px] font-bold rounded-full transition-all",
                pathname === link.href
                  ? "bg-background text-[#2a00ff] shadow-sm"
                  : "text-[#ff3bad] hover:text-[#2a00ff]",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          {!isSignedIn && (
            <>
              <SignInButton mode="modal" appearance={clerkAppearance}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-muted font-bold text-[#ff3bad] hover:text-[#2a00ff]"
                >
                  <User className="h-4 w-4 text-[#2a00ff] font-bold" />
                  Нэвтрэх
                </Button>
              </SignInButton>
              <SignUpButton mode="modal" appearance={clerkAppearance}>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-bold rounded-full  px-5 text-[#2a00ff] border-[#2a00ff]/30 hover:text-[#ff3bad]"
                >
                  Бүртгүүлэх
                </Button>
              </SignUpButton>
            </>
          )}{" "}
          <Link href="/add-property">
            <Button
              size="sm"
              className="gap-2 bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/10 rounded-full px-5"
            >
              <Plus className="h-4 w-4" />
              Зар нэмэх
            </Button>
          </Link>
          {isSignedIn && (
            <>
              <UserButton appearance={clerkUserButtonAppearance} />
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full text-[#ff3bad] hover:bg-muted hover:text-[#2a00ff]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16.25 bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-[#2a00ff]"
                    : "text-[#ff3bad]",
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border mt-2">
              {!isSignedIn && (
                <>
                  <SignInButton mode="modal" appearance={clerkAppearance}>
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl text-[#ff3bad] border-[#2a00ff]/30 hover:text-[#2a00ff]"
                    >
                      Нэвтрэх
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal" appearance={clerkAppearance}>
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl text-[#2a00ff] border-[#2a00ff]/30 hover:text-[#ff3bad]"
                    >
                      Бүртгүүлэх
                    </Button>
                  </SignUpButton>
                </>
              )}
              {isSignedIn && (
                <>
                  <Link href="/agent-portal" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl text-[#ff3bad] border-[#2a00ff]/30 hover:text-[#2a00ff]"
                    >
                      Хянах самбар
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center">
                    <UserButton appearance={clerkUserButtonAppearance} />
                  </div>
                </>
              )}
              <Link href="/add-property" className="w-full">
                <Button className="w-full gap-2 rounded-xl">Зар нэмэх</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
