"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/drawer-dialog";
import { UpdateOrderForm } from "./form";

export function OrderMenu({
  order,
}: {
  order: {
    id: string;
    status: "pending" | "process" | "completed" | "cancelled" | null;
    notes: string | null;
    contentResult: string | null;
  };
}) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);

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
          {/* <DropdownMenuItem
            onClick={() => setShowDeleteForm(true)}
            className="cursor-pointer text-destructive"
          >
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerDialog
        title="Update Category"
        description="Update the category"
        open={showUpdateForm}
        setOpen={setShowUpdateForm}
      >
        <UpdateOrderForm order={order} close={() => setShowUpdateForm(false)} />
      </DrawerDialog>
    </>
  );
}
