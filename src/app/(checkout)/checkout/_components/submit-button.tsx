"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function SubmitButton() {
  return (
    <Button
      type="submit"
      form="hook-form"
      className="w-full bg-[#998373] py-8 text-lg"
    >
      Proceed to payment
    </Button>
  );
}
