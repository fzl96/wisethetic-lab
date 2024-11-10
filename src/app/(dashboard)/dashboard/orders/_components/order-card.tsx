import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { getOrderCardDetails } from "@/server/api/orders/queries";
import { OrderMenu } from "./actions";

export async function OrderCard({ orderId }: { orderId: string }) {
  const order = await getOrderCardDetails(orderId);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <>
      {order && (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50 dark:bg-card">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-base uppercase">
                #{orderId}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription className="flex flex-col">
                <span>
                  Date: {format(new Date(order?.createdAt), "MMM dd, yyyy")}
                </span>
                <span>
                  Status: <span className="capitalize">{order.status}</span>
                </span>
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <OrderMenu
                order={{
                  id: order.id,
                  status: order.status,
                  contentResult: order.contentResult,
                  notes: order.notes,
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Order Details</div>
              <ul className="grid gap-3">
                {order.orderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <span className="flex flex-col text-muted-foreground">
                      {item.additionalContentQuantity ? (
                        <span>
                          {item.productName} + {item.additionalContentQuantity}{" "}
                          Content(s)
                        </span>
                      ) : (
                        <span>{item.productName}</span>
                      )}
                      <span>{item.packageName}</span>
                      <span>{item.categoryName}</span>
                    </span>
                    <span>
                      {currencyFormatter.format(
                        item.additionalContentQuantity * item.packagePrice +
                          item.productPrice,
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{currencyFormatter.format(order.total)}</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <span>{currencyFormatter.format(order.total)}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd>{order.contactName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href="mailto:">{order.user.email}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    {order.phone}
                    {/* <a href="tel:">+1 234 567 890</a> */}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Brand Name</dt>
                  <dd>{order.brandName}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    Method
                  </dt>
                  <dd className="capitalize">
                    {order.payment?.method?.replace(/_/g, " ")}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    Status
                  </dt>
                  <dd className="capitalize">{order.payment?.status}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Meeting</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    Location
                  </dt>
                  <dd className="capitalize">
                    {order.meeting.type === "online" ? (
                      "Online"
                    ) : (
                      <a href={order.meeting.location?.link ?? "#"}>
                        <span className="underline">
                          {order.meeting.location?.name}
                        </span>
                      </a>
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    Date
                  </dt>
                  <dd className="capitalize">
                    {format(order.meeting.date, "MMM dd, yyyy - HH:mm")}
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4 h-[0.1rem]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="font-semibold">Return Address</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  {!order.returnAddress && "Not provided"}
                  <span>{order.returnAddress?.name}</span>
                  <span>{order.returnAddress?.phone}</span>
                  <span>{order.returnAddress?.address}</span>
                  <span>{order.returnAddress?.additionalInformation}</span>
                  <span>
                    {order.returnAddress?.city}, {order.returnAddress?.province}
                    , {order.returnAddress?.postalCode}
                  </span>
                  {/* <span>{order.returnAddress ?? "-"}</span> */}
                  {/* <span>Liam Johnson</span>
                  <span>1234 Main St.</span>
                  <span>Anytown, CA 12345</span> */}
                </address>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Notes</div>
              <p className="text-muted-foreground">
                {!!order.notes ? order.notes : "No additional notes provided."}
              </p>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Content Result</div>
              <p className="text-muted-foreground">
                {!!order.contentResult ? (
                  <a
                    href={order.contentResult}
                    target="_blank"
                    className="hover:underline"
                  >
                    {order.contentResult}
                  </a>
                ) : (
                  "Content result in not provided yet."
                )}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 dark:bg-card">
            <div className="text-xs text-muted-foreground">
              Updated{" "}
              <time dateTime={format(order.updatedAt, "yyyy-MM-dd")}>
                {format(new Date(order.updatedAt), "MMM dd, yyyy")}
              </time>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
