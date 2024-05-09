import { Suspense } from "react";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { CartItems } from "./_components/cart-items";

export default async function CartPage() {
  return (
    <MaxWidthWrapper className="mt-20 flex flex-col space-y-4 md:px-10">
      <h1 className="font-accent text-2xl">Your Cart</h1>
      <Suspense fallback={null}>
        <CartItems />
      </Suspense>
    </MaxWidthWrapper>
  );
}
