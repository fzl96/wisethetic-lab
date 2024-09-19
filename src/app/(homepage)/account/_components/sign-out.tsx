"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <p
      onClick={() => signOut()}
      className={cn(
        "cursor-pointer font-semibold text-muted-foreground hover:text-primary",
        className,
      )}
    >
      Sign Out
    </p>
  );
}
