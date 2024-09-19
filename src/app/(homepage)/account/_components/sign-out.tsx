"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <p
      onClick={() => signOut()}
      className="cursor-pointer font-semibold text-muted-foreground hover:text-primary"
    >
      Sign Out
    </p>
  );
}
