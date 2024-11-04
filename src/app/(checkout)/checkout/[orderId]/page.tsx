import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShoppingBag } from "lucide-react";
import { UpdateOrder } from "./_components/update-checkout";
// import { OrderSummary } from "./order-summary";
// import { SubmitButton } from "./submit-button";
import { getCheckoutOrderById } from "@/server/api/orders/queries";
import { OrderSummary } from "./_components/order-summary";

export default async function CheckoutId({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const orderId = params.orderId;
  const order = await getCheckoutOrderById(orderId);

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
          <main>{order && <UpdateOrder order={order} />}</main>
          <footer></footer>
        </div>
      </div>
      <div className="mt-5 md:mt-0">
        <div className="left-auto right-auto max-w-[34rem] md:sticky md:bottom-0 md:top-0 md:p-10">
          <OrderSummary id={orderId} />
          {/* <OrderSummary cart={cart} /> */}
        </div>
      </div>
      <div className="md:hidden">{/* <SubmitButton /> */}</div>
    </div>
  );
}
