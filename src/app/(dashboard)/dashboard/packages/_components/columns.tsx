"use client";

import Link from "next/link";

import { type Package } from "@/server/db/schema/product";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Package>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const id = row.original.id;
      const name = row.original.name;

      return (
        <Link href={`/dashboard/packages/${id}`}>
          <div className="font-medium">{name}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-right">Description</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      const description = row.original.description;

      return (
        <Link href={`/dashboard/packages/${id}`}>
          <div className="text-right">{description ?? "No description"}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "categoryId",
  },
];
