"use client";

import { DrawerDialog } from "@/components/drawer-dialog";
import { LocationForm } from "./form";
import { useState } from "react";
import { type Location } from "@/server/db/schema/orders";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AddLocation() {
  const [open, setOpen] = useState(false);
  return (
    <DrawerDialog
      title="New Location"
      description="Add a new location"
      trigger={
        <Button size="sm" className="h-7 gap-1">
          <Icons.plusCircle className="h-3.5 w-3.5" />
          <span className="sm:not-sr-only sm:whitespace-nowrap ">
            Add Location
          </span>
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >
      <LocationForm action="create" close={() => setOpen(false)} />
    </DrawerDialog>
  );
}

export function LocationMenu({ location }: { location: Location }) {
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
        title="Update Location"
        description="Update the location"
        open={showUpdateForm}
        setOpen={setShowUpdateForm}
      >
        <LocationForm
          action="update"
          close={() => setShowUpdateForm(false)}
          location={location}
        />
      </DrawerDialog>{" "}
      <DrawerDialog
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        open={showDeleteForm}
        setOpen={setShowDeleteForm}
      >
        <LocationForm
          action="delete"
          close={() => setShowDeleteForm(false)}
          locationId={location.id}
        />
      </DrawerDialog>
    </>
  );
}
