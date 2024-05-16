import { Badge } from "@/components/ui/badge";
import { getOrderByIdWithItems } from "@/server/api/orders/queries";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

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
    <div className="rounded-xl bg-home-card-background p-10">
      {order && (
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
              <Separator className="col-span-2 bg-[#1c1c1c]" />
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
              <Separator className="col-span-2 bg-[#1c1c1c]" />
              <span>Subtotal:</span>
              <span>{currencyFormatter.format(order.total)}</span>
              <Separator className="col-span-2 bg-[#1c1c1c]" />
              <span>Payment Method:</span>
              <span className="capitalize">
                {order.payment?.method?.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
