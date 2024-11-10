import { getOrderForPayment } from "@/server/api/orders/queries";
import Link from "next/link";

export async function OrderInformation({ orderId }: { orderId: string }) {
  const order = await getOrderForPayment(orderId);
  return (
    <div className="space-y-2 rounded-[5px] border border-checkout-border bg-white p-3 text-sm">
      <div className="grid grid-cols-4 border-b border-checkout-border pb-2">
        <div className="font-light text-checkout-secondary-foreground">
          Contact Name
        </div>
        <div className="col-span-3 flex items-center justify-between">
          <div>{order?.contactName}</div>
          <Link
            href={`/checkout/${orderId}`}
            className="text-xs font-light underline"
          >
            Change
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-4">
        <div className="font-light text-checkout-secondary-foreground">
          Brand Name
        </div>
        <div className="col-span-3 flex items-center justify-between">
          <div>{order?.brandName}</div>
          <Link
            href={`/checkout/${orderId}`}
            className="text-xs font-light underline"
          >
            Change
          </Link>
        </div>
      </div>
    </div>
  );
}
