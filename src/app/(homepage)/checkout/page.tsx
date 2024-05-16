import { Suspense } from "react";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { CheckoutForm } from "./_components/form";
import { getCart } from "@/server/api/carts/queries";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <MaxWidthWrapper className="mt-20 flex flex-col px-6 md:px-10">
      <h1 className="font-accent text-lg">Checkout</h1>
      <Suspense fallback={null}>
        <CheckoutForm />
      </Suspense>
    </MaxWidthWrapper>
  );
}
