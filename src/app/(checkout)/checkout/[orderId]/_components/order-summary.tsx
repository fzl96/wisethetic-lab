import Image from "next/image";
import { getCheckoutSummary } from "@/server/api/orders/queries";

export async function OrderSummary({ id }: { id: string }) {
  const orderItems = await getCheckoutSummary(id);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const contentsTotal = orderItems.reduce(
    (acc, item) => acc + item.productPrice,
    // (acc, item) => acc + item.package.product.price,
    0,
  );
  const additionalTotal = orderItems.reduce(
    (acc, item) => acc + item.packagePrice * item.additionalContentQuantity,
    0,
  );
  return (
    <div>
      <section className="relative">
        <div className="grid gap-8">
          <div className="grid gap-8">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id}>
                  <div className="grid grid-cols-[auto,_1fr] gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-md">
                      <Image
                        src={item.packageImg ?? "/placeholder.jpg"}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                        alt={item.packageName}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="grid">
                        <div>
                          <span className="text-[15px]">
                            {item.productName}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm leading-4 text-[hsl(0,0%,44%)]">
                            {item.packageName}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm leading-4 text-[hsl(0,0%,44%)]">
                            {item.additionalContentQuantity} additional
                            content(s)
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[15px]">
                          {currencyFormatter.format(
                            item.productPrice +
                              item.packagePrice *
                                item.additionalContentQuantity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <section className="">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px]">
                      Subtotal{" "}
                      <span>
                        ({orderItems.length}
                        {orderItems.length > 1 ? " items" : " item"})
                      </span>
                    </div>
                    <div>
                      <span className="text-[15px]">
                        {currencyFormatter.format(
                          contentsTotal + additionalTotal,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-semibold">
                  <div>Total</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-sm font-normal text-[rgba(0,0,0,0.56)]">
                      <span>IDR</span>
                    </div>
                    <div>
                      <span>
                        {currencyFormatter.format(
                          contentsTotal + additionalTotal,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div></div>
        </div>
      </section>
    </div>
  );
}
