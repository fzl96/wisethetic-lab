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
import { format } from "date-fns";
import Link from "next/link";
import { TableFilter } from "./filter";

interface OrdersTableProps {
  status: string[];
}

export async function OrdersTable({ status }: OrdersTableProps) {
  const orders = await getOrders({ status: [...status] });

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
                <TableRow key={order.id} className="">
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
                    <Link href={{ query: { order_id: order.id } }}>
                      <Badge variant="secondary">View</Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
