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
    <div className="rounded-xl bg-home-card-background p-10">
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow className="border-[#1c1c1c]">
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="sr-only">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-[#1c1c1c]">
              <TableCell className="py-5 font-accent text-sm uppercase text-muted-foreground">
                {order.id}
              </TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.status}
                  className="p-0 text-sm capitalize"
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{currencyFormatter.format(order.total)}</TableCell>
              <TableCell>
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
