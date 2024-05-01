"use client";

import { type Category } from "@/server/db/schema/product";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;

      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-right">Description</div>,
    cell: ({ row }) => {
      const description = row.original.description;

      return (
        <div className="text-right">{description ?? "No description"}</div>
      );
    },
  },
];
