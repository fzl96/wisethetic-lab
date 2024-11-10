import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShoppingBag } from "lucide-react";
import { OrderSummary } from "../_components/order-summary";
import { OrderInformation } from "./_components/information";
import { PaymentForm } from "./_components/payment-form";

export default function PaymentPage({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const orderId = params.orderId;
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
          <main className="space-y-8">
            <OrderInformation orderId={orderId} />
            <PaymentForm orderId={orderId} />
          </main>
          <footer></footer>
        </div>
      </div>
      <div className="mt-5 md:mt-0">
        <div className="left-auto right-auto max-w-[34rem] md:sticky md:bottom-0 md:top-0 md:p-10">
          <OrderSummary id={orderId} />
        </div>
      </div>
      <div className="md:hidden">{/* <SubmitButton /> */}</div>
    </div>
  );
}
