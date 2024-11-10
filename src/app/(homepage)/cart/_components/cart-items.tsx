import Link from "next/link";
import { getCart } from "@/server/api/carts/queries";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AdditionalContentForm } from "./additional-content-form";
import { DeleteForm } from "./delete-form";
import { CartSummary } from "./cart-summary";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export async function CartItems() {
  const cart = await getCart();

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const cartItemsCount = cart.items?.length ?? 0;

  if (cart.items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="grid gap-10 md:mx-20 lg:grid-cols-3">
      <div className="rounded-xl py-5 lg:col-span-2">
        <div className="space-y-5">
          {cart.items
            ?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .map((item, index) => (
              <>
                <div
                  key={item.id}
                  className={cn("flex w-full items-center gap-4 md:gap-10")}
                >
                  <div className="h-20 w-20 overflow-hidden rounded-lg md:h-36 md:w-36">
                    <Image
                      src={item.package.image ?? "/placeholder.jpg"}
                      alt={item.package.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-full space-y-5">
                    <div className="w-full items-center justify-between">
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
                            {currencyFormatter.format(
                              item.package.product.price,
                            )}
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
                {index !== cartItemsCount - 1 && (
                  <Separator className="bg-home-border" />
                )}
              </>
            ))}
        </div>
      </div>
      <div className="w-full ">
        {cart?.items?.length !== 0 && <CartSummary cart={cart} />}
      </div>
    </div>
  );
}

function CartEmpty() {
  return (
    <div className="grid place-items-center gap-10 py-10">
      <p className="text-2xl font-medium tracking-wider">your cart is empty</p>
      <Link
        href="/services"
        className={cn(
          buttonVariants({
            size: "lg",
          }),
        )}
      >
        see services
      </Link>
    </div>
  );
}
