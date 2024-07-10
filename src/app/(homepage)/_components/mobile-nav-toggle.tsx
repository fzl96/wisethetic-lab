"use client";

import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";

import { useMenuState } from "@/store/menu";

export function MobileNavToggle() {
  const setOpen = useMenuState((state) => state.setOpen);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
        className="text-base"
      >
        {/* Menu */}
        <RiMenu4Fill className="h-5 w-5" />
      </Button>
    </>
  );
}
