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
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // classNames нэгтгэх функц

export function Header() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll хийхэд Header-ийн өнгө өөрчлөгдөх эффект
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Нүүр", href: "/home", icon: Home },
    { name: "Зарууд", href: "/listings", icon: LayoutGrid },
    { name: "Газрын зураг", href: "/map", icon: Map },
    { name: "Агент портал", href: "/agent-portal", icon: BriefcaseBusiness },
    { name: "Хянах самбар", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border py-2"
          : "bg-background border-transparent py-4",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-all active:scale-95"
        >
          {/* Square Container (W=H) */}
          <div className="bg-primary rounded-2xl overflow-hidden w-12 h-12 flex items-center justify-center shadow-lg shadow-black/5 p-1 border border-border/50 group-hover:shadow-black/10 transition-shadow">
            <Image
              src="/forwebyg.png" // Чиний w=h лого
              alt="Mon1.mn Real Estate"
              width={48} // Контейнертэй ижил (w-12 = 48px)
              height={48}
              className="w-full h-full object-contain" // Контейнертээ яг таарна
              priority
            />
          </div>
          {/* Логоны хажууд Брэндийн нэр (Орчин үеийн UX) */}
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground leading-none">
              Mon1.mn
            </span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              apartments & real estate in Mongolia
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center bg-muted/50 rounded-full px-2 py-1 border border-border/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all",
                pathname === link.href
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
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
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-muted font-medium"
                >
                  <User className="h-4 w-4 text-primary" />
                  Нэвтрэх
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium rounded-full px-5"
                >
                  Бүртгүүлэх
                </Button>
              </SignUpButton>
            </>
          )}{" "}
          <Link href="/add-property">
            <Button
              size="sm"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 rounded-full px-5"
            >
              <Plus className="h-4 w-4" />
              Зар нэмэх
            </Button>
          </Link>
          {isSignedIn && (
            <>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full hover:bg-muted"
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
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border mt-2">
              {!isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl"
                    >
                      Нэвтрэх
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl"
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
                      className="w-full gap-2 rounded-xl"
                    >
                      Хянах самбар
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10",
                        },
                      }}
                    />
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
