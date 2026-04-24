"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Map,
  Newspaper,
  LayoutDashboard,
  BriefcaseBusiness,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { clerkAppearance } from "@/lib/clerk-theme";
import { isAgent } from "@/lib/auth";

type HeaderMobileBottomNavProps = {
  isSignedIn: boolean;
};

type NavLinkItem = {
  kind: "link";
  name: string;
  href: string;
  icon: LucideIcon;
};

type NavCell = NavLinkItem | { kind: "signin" };

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  }
  if (href === "/agent-portal") {
    return (
      pathname === "/agent-portal" || pathname.startsWith("/agent-portal/")
    );
  }
  return pathname === href;
}

export function HeaderMobileBottomNav({
  isSignedIn,
}: HeaderMobileBottomNavProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { sessionClaims } = useAuth();
  const isAgentPortalRoute = pathname.startsWith("/agent-portal");

  if (isAgentPortalRoute) {
    return null;
  }

  const hasAgentRole = isSignedIn
    ? isAgent({ sessionClaims }) ||
      (isLoaded && isAgent({ publicMetadata: user?.publicMetadata ?? null }))
    : false;

  const baseLinks: NavLinkItem[] = [
    { kind: "link", name: "Нүүр", href: "/home", icon: Home },
    { kind: "link", name: "Зарууд", href: "/listings", icon: LayoutGrid },
    { kind: "link", name: "Газрын зураг", href: "/map", icon: Map },
  ];

  let cells: NavCell[];

  if (!isSignedIn) {
    cells = [
      ...baseLinks,
      { kind: "link", name: "Мэдээ", href: "/news", icon: Newspaper },
      { kind: "signin" },
    ];
  } else if (hasAgentRole) {
    cells = [
      ...baseLinks,
      {
        kind: "link",
        name: "Самбар",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        kind: "link",
        name: "Агент",
        href: "/agent-portal",
        icon: BriefcaseBusiness,
      },
    ];
  } else {
    cells = [
      ...baseLinks,
      { kind: "link", name: "Мэдээ", href: "/news", icon: Newspaper },
      {
        kind: "link",
        name: "Самбар",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ];
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-9998 border-t border-border/80 bg-background/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1 rounded-4xl border border-border/60 bg-background/80 p-2">
        {cells.map((cell) => {
          if (cell.kind === "signin") {
            return (
              <SignInButton
                key="signin"
                mode="modal"
                appearance={clerkAppearance}
              >
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
            );
          }

          const active = isActivePath(pathname, cell.href);
          const Icon = cell.icon;

          return (
            <Link
              key={cell.href}
              href={cell.href}
              prefetch={false}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition-colors",
                active ? "bg-[#2a00ff]/10 text-[#2a00ff]" : "text-[#ff3bad]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{cell.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
