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

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7834/ingest/78590180-74c3-4b1d-a39f-896d406574be", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "96ab0a",
      },
      body: JSON.stringify({
        sessionId: "96ab0a",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "components/header.tsx:31",
        message: "Header state snapshot",
        data: { pathname, scrolled, isSignedIn: Boolean(isSignedIn) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [pathname, scrolled, isSignedIn]);
  // #endregion

  // #region agent log
  useEffect(() => {
    const headerEl = document.querySelector("header");
    if (!headerEl || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextHeight = Math.round(entry.contentRect.height);
      fetch(
        "http://127.0.0.1:7834/ingest/78590180-74c3-4b1d-a39f-896d406574be",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "96ab0a",
          },
          body: JSON.stringify({
            sessionId: "96ab0a",
            runId: "pre-fix",
            hypothesisId: "H5",
            location: "components/header.tsx:57",
            message: "Header height observed",
            data: { pathname, nextHeight, scrolled },
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
    });

    observer.observe(headerEl);
    return () => observer.disconnect();
  }, [pathname, scrolled]);
  // #endregion

  // Scroll хийхэд Header-ийн өнгө өөрчлөгдөх эффект
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Use a small hysteresis gap so sticky height changes don't bounce
      // around one exact threshold and cause a resize loop.
      setScrolled((prev) => {
        const next = prev ? currentScrollY > 8 : currentScrollY > 24;
        if (prev !== next) {
          // #region agent log
          fetch(
            "http://127.0.0.1:7834/ingest/78590180-74c3-4b1d-a39f-896d406574be",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "96ab0a",
              },
              body: JSON.stringify({
                sessionId: "96ab0a",
                runId: "pre-fix",
                hypothesisId: "H1",
                location: "components/header.tsx:50",
                message: "Scrolled state changed",
                data: { currentScrollY, prev, next },
                timestamp: Date.now(),
              }),
            },
          ).catch(() => {});
          // #endregion
        }

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
            className="flex items-center gap-2 md:gap-3 group shrink-0"
          >
            <Image
              src="/ZAAAA.png"
              alt="Mon1 logo"
              width={30}
              height={30}
              /* w-16: Mobile width (small & clean)
       md:w-25: Desktop width (original size)
    */
              className="w-16 md:w-25 object-contain transition-all"
            />
          </Link>
          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center bg-muted/50 rounded-full px-2 py-1 border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  // #region agent log
                  fetch(
                    "http://127.0.0.1:7834/ingest/78590180-74c3-4b1d-a39f-896d406574be",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "X-Debug-Session-Id": "96ab0a",
                      },
                      body: JSON.stringify({
                        sessionId: "96ab0a",
                        runId: "pre-fix",
                        hypothesisId: "H6",
                        location: "components/header.tsx:149",
                        message: "Desktop nav link clicked",
                        data: {
                          href: link.href,
                          pathnameBeforeClick: pathname,
                        },
                        timestamp: Date.now(),
                      }),
                    },
                  ).catch(() => {});
                  // #endregion
                }}
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
            {isSignedIn ? <ClerkAppUserButton /> : null}
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/add-property">
              <Button
                size="sm"
                className="gap-2 rounded-xl bg-[#2a00ff] px-4 font-bold text-white hover:bg-[#ff3bad]"
              >
                <Plus className="h-4 w-4" />
                Зар
              </Button>
            </Link>
            {isSignedIn ? <ClerkAppUserButton /> : null}
          </div>
        </div>
      </header>

      <HeaderMobileBottomNav isSignedIn={Boolean(isSignedIn)} />
    </>
  );
}
