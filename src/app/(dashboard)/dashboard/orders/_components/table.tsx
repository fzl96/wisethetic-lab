import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders } from "@/server/api/orders/queries";
import { getOrdersPage } from "@/server/api/orders/queries";
import { format } from "date-fns";
import Link from "next/link";
import { TableFilter } from "./filter";
import { TablePagination } from "./table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewOrderButton } from "./view-order-button";
import { cn } from "@/lib/utils";

interface OrdersTableProps {
  status: string[];
  page: number;
  orderId: string;
}

export async function OrdersTable({ status, page, orderId }: OrdersTableProps) {
  const orders = await getOrders({ status: [...status], page });
  const totalPages = await getOrdersPage({ status: [...status] });

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto ">
        <TableFilter />
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="">Amount</TableHead>
                <TableHead className="sr-only hidden md:table-cell">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className={cn(orderId === order.id && "bg-muted/50")}
                >
                  <TableCell>
                    <Link href={{ query: { order_id: order.id } }}>
                      <div className="font-medium">{order.contactName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.user.email}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Link href={{ query: { order_id: order.id } }}>
                      <Badge
                        className="p-0 text-sm capitalize"
                        variant={order.status}
                      >
                        {order.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Link href={{ query: { order_id: order.id } }}>
                      {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </Link>
                  </TableCell>
                  <TableCell className="">
                    <Link href={{ query: { order_id: order.id } }}>
                      {currencyFormatter.format(order.total)}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <ViewOrderButton orderId={order.id} key={order.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Suspense
        fallback={
          <div className="grid place-items-center">
            <Skeleton className="h-6 w-80 text-center" />
          </div>
        }
      >
        <TablePagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
