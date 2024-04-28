"use client";

import { DrawerDialog } from "@/components/drawer-dialog";
import { useState } from "react";
import type { Category } from "@/server/db/schema/product";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PackageForm } from "./form";

export function CreatePackage({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <DrawerDialog
      title="Create Package"
      description="Create a new package"
      trigger={
        <Button size="sm" className="h-7 gap-1">
          <Icons.plusCircle className="h-3.5 w-3.5" />
          <span className="sm:not-sr-only sm:whitespace-nowrap ">
            Add Package
          </span>
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >
      <PackageForm
        categories={categories}
        action="create"
        close={() => setOpen(false)}
      />
    </DrawerDialog>
  );
}
