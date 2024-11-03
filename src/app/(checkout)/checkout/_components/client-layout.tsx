import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShoppingBag } from "lucide-react";
import { Input } from "./ui/input";
import { CheckoutFormClient } from "./form";
import { getCart } from "@/server/api/carts/queries";
import { redirect } from "next/navigation";
import { OrderSummary } from "./order-summary";
import { SubmitButton } from "./submit-button";

export async function ClientLayout() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return redirect("/cart");
  }

  return (
    <div className="grid min-h-screen p-5 md:p-0 lg:grid-cols-[minmax(min-content,_54%)_1fr]">
      <div className="flex justify-end bg-[#fafafa]">
        <div className="h-full w-full max-w-[40rem] border-checkout-border md:border-r md:p-10">
          <header className="mb-20 flex w-full items-center justify-between">
            <Link
              href="/"
              className="font-firaSans uppercase tracking-[0.25em] text-primary-accent md:text-xl"
            >
              {siteConfig.name}
            </Link>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-primary-accent" />
            </Link>
          </header>
          <main>
            <CheckoutFormClient cart={cart} />
          </main>
          <footer></footer>
        </div>
      </div>
      <div className="mt-5">
        <div className="left-auto right-auto max-w-[34rem] md:sticky md:bottom-0 md:top-0 md:p-10">
          <OrderSummary cart={cart} />
        </div>
      </div>
      <div className="md:hidden">
        <SubmitButton />
      </div>
    </div>
  );
}
