"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Social() {
  const onClick = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };
  return (
    <Button
      type="button"
      variant="outline"
      className="flex w-full gap-2"
      onClick={onClick}
    >
      <span>
        <Image
          src="/google-icon.svg"
          alt="Google"
          width="24"
          height="24"
          className="inline-block h-5 w-5"
        />
      </span>
      Continue with Google
    </Button>
  );
}
