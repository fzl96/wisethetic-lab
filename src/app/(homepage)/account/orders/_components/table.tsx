import { getUserOrders } from "@/server/api/orders/queries";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export async function OrdersTable() {
  const orders = await getUserOrders();

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <div className="rounded-xl bg-home-card-background p-5 md:p-10">
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow className="border-[#1c1c1c]">
            <TableHead className="hidden md:table-cell">Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="sr-only hidden md:table-cell">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-[#1c1c1c]">
              <TableCell className="hidden py-5 font-accent text-sm uppercase text-muted-foreground md:table-cell">
                {order.id}
              </TableCell>
              <TableCell>
                <Link href={`/account/orders/${order.id}`}>
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.status}
                  className="p-0 text-sm capitalize"
                >
                  <Link href={`/account/orders/${order.id}`}>
                    {order.status}
                  </Link>
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/account/orders/${order.id}`}>
                  {currencyFormatter.format(order.total)}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Link
                  href={`/account/orders/${order.id}`}
                  className={buttonVariants({
                    size: "xs",
                    variant: "secondary",
                  })}
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
