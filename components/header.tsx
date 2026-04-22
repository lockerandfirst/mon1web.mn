"use client";

import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Одоо хаана байгааг мэдэхэд хэрэгтэй
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // classNames нэгтгэх функц
import { clerkAppearance } from "@/lib/clerk-theme";
import { ClerkAppUserButton } from "@/components/clerk-app-user-button";
import { HeaderMobileBottomNav } from "@/components/header-mobile-bottom-nav";

export function Header() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll хийхэд Header-ийн өнгө өөрчлөгдөх эффект
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Use a small hysteresis gap so sticky height changes don't bounce
      // around one exact threshold and cause a resize loop.
      setScrolled((prev) => {
        const next = prev ? currentScrollY > 8 : currentScrollY > 24;
        return next;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Нүүр", href: "/home" },
    { name: "Зарууд", href: "/listings" },
    { name: "Газрын зураг", href: "/map" },
    { name: "Мэдээ", href: "/news" },
    { name: "Агент портал", href: "/agent-portal" },
    { name: "Хянах самбар", href: "/dashboard" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 z-9999 w-full border-b py-3 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-border bg-background/80 backdrop-blur-md"
            : "border-transparent bg-background",
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
          {/* LOGO */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 lg:gap-3"
          >
            <Image
              src="/ZAAAA.png"
              alt="Mon1 logo"
              loading="eager"
              width={30}
              height={30}
              /* w-16: Mobile width (small & clean)
       md:w-25: Desktop width (original size)
    */
              className="w-16 object-contain transition-all lg:w-25"
            />
          </Link>
          {/* DESKTOP NAV */}
          <nav className="hidden items-center rounded-full border border-border/50 bg-muted/50 px-2 py-1 lg:flex">
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
          <div className="hidden items-center gap-3 lg:flex">
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
            {isSignedIn ? (
              <Link href="/add-property">
                <Button
                  size="sm"
                  className="gap-2 bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/10 rounded-full px-5"
                >
                  <Plus className="h-4 w-4" />
                  Зар нэмэх
                </Button>
              </Link>
            ) : (
              <SignInButton
                mode="modal"
                appearance={clerkAppearance}
                forceRedirectUrl="/add-property"
                fallbackRedirectUrl="/add-property"
              >
                <Button
                  size="sm"
                  className="gap-2 bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/10 rounded-full px-5"
                >
                  <Plus className="h-4 w-4" />
                  Зар нэмэх
                </Button>
              </SignInButton>
            )}
            {isSignedIn ? <ClerkAppUserButton /> : null}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            {isSignedIn ? (
              <Link href="/add-property">
                <Button
                  size="sm"
                  className="gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-md shadow-primary/15 hover:opacity-95"
                >
                  <Plus className="h-4 w-4" />
                  Зар
                </Button>
              </Link>
            ) : (
              <SignInButton
                mode="modal"
                appearance={clerkAppearance}
                forceRedirectUrl="/add-property"
                fallbackRedirectUrl="/add-property"
              >
                <Button
                  size="sm"
                  className="gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-md shadow-primary/15 hover:opacity-95"
                >
                  <Plus className="h-4 w-4" />
                  Зар
                </Button>
              </SignInButton>
            )}
            {isSignedIn ? <ClerkAppUserButton /> : null}
          </div>
        </div>
      </header>

      <HeaderMobileBottomNav isSignedIn={Boolean(isSignedIn)} />
    </>
  );
}
