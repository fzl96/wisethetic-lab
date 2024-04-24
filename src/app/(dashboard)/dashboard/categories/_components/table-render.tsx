"use client";

import { type Category } from "@/server/db/schema/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { convertToSlug } from "@/lib/utils";
import { useState } from "react";
import { Search } from "./search";

interface CategoryTableRenderProps {
  categories: Category[];
}

export function CategoryTableRender({ categories }: CategoryTableRenderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <Search query={query} setQuery={setQuery} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow
              key={category.id}
              className="cursor-pointer"
              onClick={() =>
                router.push(
                  `/dashboard/categories/${convertToSlug(category.name)}`,
                )
              }
            >
              <TableCell>
                <div className="font-medium">{category.name}</div>
              </TableCell>
              <TableCell className="text-right">
                {category.description ?? (
                  <Badge color="gray">No description</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
