import { Suspense } from "react";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { CartItems } from "./_components/cart-items";
import { CartSkeleton } from "./_components/cart-skeleton";

export default async function CartPage() {
  return (
    <MaxWidthWrapper className="flex flex-col space-y-4 px-0">
      <div className="grid h-[190px] place-items-center bg-home-cart-banner tracking-wider">
        <h1 className="font-accent text-2xl font-medium">review your cart</h1>
      </div>

      <div className="px-5">
        <Suspense fallback={<CartSkeleton />}>
          <CartItems />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
