"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function ViewOrderButton({ orderId }: { orderId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createUrl = (orderId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("order_id", orderId);

    return `${pathname}?${params.toString()}`;
  };

  return (
    <Link href={createUrl(orderId)}>
      <Badge variant="secondary">View</Badge>
    </Link>
  );
}
