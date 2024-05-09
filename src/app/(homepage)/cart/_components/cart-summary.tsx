import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cart = {
  id: string | undefined;
  items: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    package: {
      id: string;
      name: string;
      image: string | null;
      additionalContentPrice: number;
      additionalContentQuantity: number;
      product: {
        id: string;
        name: string;
        price: number;
      };
    };
  }[];
};

export function CartSummary({ cart }: { cart: Cart }) {
  const contentsTotal = cart.items.reduce(
    (acc, item) => acc + item.package.product.price,
    0,
  );
  const additionalTotal = cart.items.reduce(
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
    <Card className="border-none bg-home-card-background">
      <CardHeader>
        <CardTitle>Cart Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex w-full items-center justify-between ">
            Package(s)
            <span>{currencyFormatter.format(contentsTotal)}</span>
          </div>
          <div className="flex w-full items-center justify-between ">
            Additional content(s)
            <span>{currencyFormatter.format(additionalTotal)}</span>
          </div>
          <div className="flex w-full items-center justify-between ">
            Total
            <span>
              {currencyFormatter.format(contentsTotal + additionalTotal)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/checkout" className={cn(buttonVariants(), "w-full")}>
          Checkout
        </Link>
      </CardFooter>
    </Card>
  );
}
