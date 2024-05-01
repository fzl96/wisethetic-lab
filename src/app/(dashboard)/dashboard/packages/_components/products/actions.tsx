"use client";

import { DrawerDialog } from "@/components/drawer-dialog";
import { useState } from "react";
import type { Product, PackageId } from "@/server/db/schema/product";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ProductForm } from "./form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CreateProduct({
  packageId,
}: {
  packageId: PackageId;
  redirectUrl: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DrawerDialog
      title="Create Product"
      description="Create a new product"
      trigger={
        <Button size="icon" className="h-6 w-6 gap-1">
          <Icons.plusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:whitespace-nowrap ">Add Content</span>
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >
      <ProductForm
        action="create"
        close={() => setOpen(false)}
        packageId={packageId}
      />
    </DrawerDialog>
  );
}

export function ProductMenu({
  product,
  packageId,
}: {
  product: Product;
  packageId: PackageId;
}) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border-none outline-none">
          <div className="flex items-center justify-between">
            <p>{product.name}</p>
            <p>{currencyFormatter.format(product.price)}</p>
          </div>
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
        title="Update Product"
        description="Update the product details"
        open={showUpdateForm}
        setOpen={setShowUpdateForm}
      >
        <ProductForm
          action="update"
          close={() => setShowUpdateForm(false)}
          packageId={packageId}
          product={product}
        />
      </DrawerDialog>
      <DrawerDialog
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        open={showDeleteForm}
        setOpen={setShowDeleteForm}
      >
        <ProductForm
          action="delete"
          close={() => setShowDeleteForm(false)}
          packageId={packageId}
          product={product}
        />
      </DrawerDialog>
    </>
  );
}
