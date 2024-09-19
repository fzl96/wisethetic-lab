import { Badge } from "@/components/ui/badge";
import { getOrderByIdWithItems } from "@/server/api/orders/queries";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function OrderIdPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderByIdWithItems(params.id);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <Card>
      <CardHeader className="p-4"></CardHeader>
      <CardContent>
        {order && (
          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-sm leading-8 md:leading-5">
                Order #{" "}
                <span className="uppercase">
                  <Badge variant="accent" className="rounded-sm">
                    {order.id}
                  </Badge>
                </span>{" "}
                was placed on{" "}
                <span>
                  <Badge variant="accent" className="rounded-sm">
                    {format(order.createdAt, "MMM dd, yyyy")}
                  </Badge>
                </span>{" "}
                and is currently{" "}
                <span>
                  <Badge variant={order.status} className="p-0 text-sm">
                    {order.status}
                  </Badge>
                </span>
              </h2>
              <h1 className="font-accent text-2xl">Order Details</h1>
              <div className="">
                <div className="grid w-full grid-cols-2 gap-4 text-sm">
                  <span>Product(s)</span>
                  <span>Total</span>
                  <Separator className="col-span-2 bg-home-border" />
                  {order.orderItems.map((item) => (
                    <>
                      <div className="grid gap-0 text-sm" key={item.id}>
                        <span>{item.productName}</span>
                        <span className="text-muted-foreground">
                          {item.packageName}
                        </span>
                        <span className="text-muted-foreground">
                          {item.categoryName}
                        </span>
                      </div>
                      <div>
                        <span>
                          {currencyFormatter.format(
                            item.additionalContentQuantity * item.packagePrice +
                              item.productPrice,
                          )}
                        </span>
                      </div>
                    </>
                  ))}
                  <Separator className="col-span-2 bg-home-border" />
                  <span>Subtotal:</span>
                  <span>{currencyFormatter.format(order.total)}</span>
                  <Separator className="col-span-2 bg-home-border" />
                  <span>Payment Method:</span>
                  <span className="capitalize">
                    {order.payment?.method?.replace(/_/g, " ")}
                  </span>
                  <Separator className="col-span-2 bg-home-border" />
                  <span>Total:</span>
                  <span>{currencyFormatter.format(order.total)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="font-accent text-2xl">Return Address</h3>
              <span className="break-all text-sm">
                {!!order.returnAddress ? (
                  order.returnAddress
                ) : (
                  <span className="text-muted-foreground">
                    No return address provided
                  </span>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="font-accent text-2xl">Payment Info</h3>
              <div className="text-muted-foreground">
                <span className="text-sm">Payment Status:</span>{" "}
                <span className="text-sm capitalize text-home-foreground">
                  {order.payment?.status === "pending"
                    ? "Unpaid"
                    : order.payment?.status === "completed"
                      ? "Paid"
                      : "Cancelled"}
                </span>
              </div>
              {order.payment?.method && (
                <div className="text-muted-foreground">
                  <span className="text-sm">Payment Method:</span>{" "}
                  <span className="text-sm capitalize text-home-foreground">
                    {order.payment.method.replace(/_/g, " ")}
                  </span>
                </div>
              )}
              {order.payment?.status === "completed" && (
                <a
                  href={`https://app.sandbox.midtrans.com/snap/v4/redirection/${order.payment?.snapToken}`}
                  className="text-logo text-wrap break-all text-sm hover:underline"
                >
                  {`https://app.sandbox.midtrans.com/snap/v4/redirection/${order.payment?.snapToken}`}
                </a>
              )}
              {order.payment?.status === "pending" && (
                <Link
                  href={`/checkout/payment/${order.id}`}
                  className="text-sm text-primary-accent hover:underline"
                >
                  Click here to pay
                </Link>
              )}
            </div>
            {order.payment?.status === "completed" ? (
              <div className="flex flex-col gap-5">
                <h3 className="font-accent text-2xl">Content Result</h3>
                {!order.contentResult ? (
                  <span className="text-sm text-muted-foreground">
                    In progress
                  </span>
                ) : (
                  <a
                    href={order.contentResult}
                    className="text-wrap break-all text-sm text-primary-accent hover:underline"
                  >
                    {order.contentResult}
                  </a>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
