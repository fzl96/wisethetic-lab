"use client";

import { DrawerDialog } from "@/components/drawer-dialog";
import { CategoryForm } from "./form";
import { useState } from "react";
import type { CategoryId, Category } from "@/server/db/schema/product";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function CreateCategory() {
  const [open, setOpen] = useState(false);
  return (
    <DrawerDialog
      title="Create Category"
      description="Create a new category"
      trigger={<Button variant="outline">Add Category</Button>}
      open={open}
      setOpen={setOpen}
    >
      <CategoryForm action="create" close={() => setOpen(false)} />
    </DrawerDialog>
  );
}

export function UpdateCategory({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerDialog
      title="Update Category"
      description="Update the category"
      trigger={
        <Button variant="outline" size="icon">
          <Icons.pen className="h-4 w-4" />
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >
      <CategoryForm
        action="update"
        close={() => setOpen(false)}
        category={category}
      />
    </DrawerDialog>
  );
}

export function DeleteCategory({ categoryId }: { categoryId: CategoryId }) {
  const [open, setOpen] = useState(false);

  return (
    <DrawerDialog
      title="Delete Category"
      description="Are you sure you want to delete this category?"
      trigger={
        <Button variant="outline" size="icon">
          <Icons.trash className="h-4 w-4" />
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >
      <CategoryForm
        categoryId={categoryId}
        action="delete"
        close={() => setOpen(false)}
      />
    </DrawerDialog>
  );
}
