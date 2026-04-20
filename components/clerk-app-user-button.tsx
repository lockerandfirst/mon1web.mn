"use client";

import { UserButton } from "@clerk/nextjs";
import { BriefcaseBusiness } from "lucide-react";
import { clerkUserButtonAppearance } from "@/lib/clerk-theme";

export function ClerkAppUserButton() {
  return (
    <UserButton appearance={clerkUserButtonAppearance}>
      <UserButton.MenuItems>
        <UserButton.Link
          href="/agent-portal"
          label="Агент портал"
          labelIcon={<BriefcaseBusiness className="h-4 w-4" />}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
