"use client";

import Link from "next/link";

import { convertToSlug } from "@/lib/utils";

import { type Category } from "@/server/db/schema/product";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <Link href={`/dashboard/categories/${convertToSlug(name)}`}>
          <div className="font-medium">{name}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-right">Description</div>,
    cell: ({ row }) => {
      const description = row.original.description;

      return (
        <Link
          href={`/dashboard/categories/${convertToSlug(row.original.name)}`}
        >
          <div className="text-right">{description ?? "No description"}</div>
        </Link>
      );
    },
  },
];
