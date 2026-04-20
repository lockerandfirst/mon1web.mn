"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Map,
  Newspaper,
  LayoutDashboard,
  User,
} from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { clerkAppearance } from "@/lib/clerk-theme";
import { isAgent } from "@/lib/auth";

type HeaderMobileBottomNavProps = {
  isSignedIn: boolean;
};

export function HeaderMobileBottomNav({
  isSignedIn,
}: HeaderMobileBottomNavProps) {
  const pathname = usePathname();
  const isAgentPortalRoute = pathname.startsWith("/agent-portal");

  if (isAgentPortalRoute) {
    return null;
  }

  const { user, isLoaded } = useUser();
  const hasAgentRole =
    pathname.startsWith("/agent-portal") ||
    (isSignedIn &&
      isLoaded &&
      isAgent({ publicMetadata: user?.publicMetadata ?? null }));

  const mainLinks = [
    { name: "Нүүр", href: "/home", icon: Home },
    { name: "Зарууд", href: "/listings", icon: LayoutGrid },
    { name: "Газрын зураг", href: "/map", icon: Map },
    hasAgentRole
      ? { name: "Агент", href: "/agent-portal", icon: LayoutDashboard }
      : { name: "Мэдээ", href: "/news", icon: Newspaper },
  ];

  const dashboardActive = hasAgentRole
    ? pathname === "/agent-portal" || pathname.startsWith("/agent-portal/")
    : pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-9998 border-t border-border/80 bg-background/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1 rounded-4xl border border-border/60 bg-background/80 p-2">
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition-colors",
              pathname === link.href
                ? "bg-[#2a00ff]/10 text-[#2a00ff]"
                : "text-[#ff3bad]",
            )}
          >
            <link.icon className="h-4 w-4" />
            <span className="truncate">{link.name}</span>
          </Link>
        ))}

        {isSignedIn ? (
          <Link
            href={hasAgentRole ? "/agent-portal" : "/dashboard"}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition-colors",
              dashboardActive
                ? "bg-[#2a00ff]/10 text-[#2a00ff]"
                : "text-[#ff3bad]",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="truncate">Хянах самбар</span>
          </Link>
        ) : (
          <SignInButton mode="modal" appearance={clerkAppearance}>
            <button
              type="button"
              className={cn(
                "flex w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition-colors",
                pathname.startsWith("/sign-in")
                  ? "bg-[#2a00ff]/10 text-[#2a00ff]"
                  : "text-[#ff3bad]",
              )}
            >
              <User className="h-4 w-4" />
              <span className="truncate">Нэвтрэх</span>
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
