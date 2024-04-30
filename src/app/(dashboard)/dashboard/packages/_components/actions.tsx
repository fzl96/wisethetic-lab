"use client";

import { DrawerDialog } from "@/components/drawer-dialog";
import { useState } from "react";
import type { Package, Category } from "@/server/db/schema/product";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PackageForm } from "./form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CreatePackage({
  categories,
  redirectUrl,
}: {
  categories: Category[];
  redirectUrl: string;
}) {
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
        redirectUrl={redirectUrl}
      />
    </DrawerDialog>
  );
}

export function PackageMenu({
  pkg,
  categories,
  redirectUrl,
}: {
  pkg: Package;
  categories: Category[];
  redirectUrl: string;
}) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="h-8 w-8">
            <Icons.moreVertical className="h-3.5 w-3.5" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setShowUpdateForm(true)}
            className="cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteForm(true)}
            className="cursor-pointer text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerDialog
        title="Update Category"
        description="Update the category"
        open={showUpdateForm}
        setOpen={setShowUpdateForm}
      >
        <PackageForm
          action="update"
          close={() => setShowUpdateForm(false)}
          pkg={pkg}
          categories={categories}
          redirectUrl={redirectUrl}
        />
      </DrawerDialog>{" "}
      <DrawerDialog
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        open={showDeleteForm}
        setOpen={setShowDeleteForm}
      >
        <PackageForm
          action="delete"
          close={() => setShowDeleteForm(false)}
          packageId={pkg.id}
          redirectUrl={redirectUrl}
        />
      </DrawerDialog>
    </>
  );
}
