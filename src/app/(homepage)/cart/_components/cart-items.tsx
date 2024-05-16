import { getCart } from "@/server/api/carts/queries";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AdditionalContentForm } from "./additional-content-form";
import { DeleteForm } from "./delete-form";
import { CartSummary } from "./cart-summary";

export async function CartItems() {
  const cart = await getCart();

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const cartItemsCount = cart.items?.length ?? 0;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-xl bg-home-card-background p-5 lg:col-span-2">
        <div className="space-y-10">
          {cart.items.length === 0 && (
            <div>
              {/* <Image
                src="/empty-cart.svg"
                alt="Empty Cart"
                width={500}
                height={500}
              /> */}
            </div>
          )}
          {cart.items
            ?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .map((item, index) => (
              <div
                key={item.id}
                className={cn("flex w-full items-center gap-4 md:gap-10", {
                  "border-b  pb-10": index !== cartItemsCount - 1,
                })}
              >
                <div className="h-20 w-20 overflow-hidden rounded-lg md:h-36 md:w-36">
                  <Image
                    src={item.package.image ?? "/placeholder.jpg"}
                    alt={item.package.name}
                    width={300}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full space-y-5">
                  <div className="w-full items-center justify-between space-y-2">
                    <div className="text-muted-foreground">
                      {item.package.name}
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="flex flex-col space-y-2">
                        <span className="md:text-lg">
                          {item.package.product.name}
                        </span>
                        <AdditionalContentForm item={item} />
                      </div>
                      <div className="flex flex-col space-y-2 text-right">
                        <span className="md:text-lg">
                          {currencyFormatter.format(item.package.product.price)}
                        </span>
                        <span className="flex items-center justify-end  text-sm text-muted-foreground md:text-base">
                          <Plus className="h-4 w-4" />
                          {currencyFormatter.format(
                            item.package.additionalContentPrice *
                              item.package.additionalContentQuantity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-end">
                    <DeleteForm id={item.id} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-full ">
        {cart?.items?.length !== 0 && <CartSummary cart={cart} />}
      </div>
    </div>
  );
}
