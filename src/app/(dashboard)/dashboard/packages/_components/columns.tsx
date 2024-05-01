"use client";

import { type PackageWithCategory } from "@/server/db/schema/product";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PackageWithCategory>[] = [
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
        <div className="text-right">
          {!!description ? description : "No description"}
        </div>
      );
    },
  },
];
