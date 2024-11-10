import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type CartExtended } from "@/server/db/schema/cart";

export function CartSummary({ cart }: { cart: CartExtended }) {
  const contentsTotal = cart.items?.reduce(
    (acc, item) => acc + item.package.product.price,
    0,
  );
  const additionalTotal = cart.items?.reduce(
    (acc, item) =>
      acc +
      item.package.additionalContentPrice *
        item.package.additionalContentQuantity,
    0,
  );

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <div className="space-y-10 py-5">
      <h2 className="text-xl tracking-wide">cart details</h2>
      <div className="space-y-6">
        <div className="space-y-2 text-muted-foreground">
          <div className="flex w-full items-center justify-between ">
            Package(s)
            <span>{currencyFormatter.format(contentsTotal)}</span>
          </div>
          <div className="flex w-full items-center justify-between ">
            Additional content(s)
            <span>{currencyFormatter.format(additionalTotal)}</span>
          </div>
        </div>
        <Separator className="bg-home-border" />
        <div className="flex w-full items-center justify-between ">
          Total
          <span>
            {currencyFormatter.format(contentsTotal + additionalTotal)}
          </span>
        </div>
        <Link href="/checkout" className={cn(buttonVariants(), "w-full py-6")}>
          Checkout
        </Link>
      </div>
    </div>
  );
}
