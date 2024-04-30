"use client";

import Link from "next/link";

import { type PackageWithCategory } from "@/server/db/schema/product";

import { convertToSlug } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PackageWithCategory>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const category = convertToSlug(row.original.category.name ?? "");
      const pkg = convertToSlug(row.original.name ?? "");
      const name = row.original.name;

      return (
        <Link href={`/dashboard/packages/${category}/${pkg}`}>
          <div className="font-medium">{name}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-right">Description</div>,
    cell: ({ row }) => {
      const category = convertToSlug(row.original.category.name ?? "");
      const pkg = convertToSlug(row.original.name ?? "");
      const description = row.original.description;

      return (
        <Link href={`/dashboard/packages/${category}/${pkg}`}>
          <div className="text-right">
            {!!description ? description : "No description"}
          </div>
        </Link>
      );
    },
  },
];
