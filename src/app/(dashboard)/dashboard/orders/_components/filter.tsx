"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

const status: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "process", label: "Process" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function TableFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const [statuses, setStatuses] = useState<string[]>(
    statusParam ? statusParam.split(",") : [],
  );

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (statuses.includes(value)) {
      const current = statuses.filter((status) => status !== value);
      setStatuses((statuses) => statuses.filter((status) => status !== value));
      if (current.length === 0) {
        params.delete("status");
      } else {
        params.set("status", current.join(","));
      }
      router.push(`${pathname}?${params.toString()}`);
    } else {
      const current = [...statuses, value];
      setStatuses((statuses) => [...statuses, value]);
      params.set("status", current.join(","));

      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {status.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={statuses.includes(item.value)}
            onCheckedChange={() => handleFilter(item.value)}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
