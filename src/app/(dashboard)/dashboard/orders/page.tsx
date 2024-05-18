import { Suspense } from "react";
import { OrdersTable } from "./_components/table";
import { OrderCard } from "./_components/order-card";
import SummaryCards from "./_components/order-summary-cards";
import {
  OrderCardLoader,
  OrderSummaryCardsLoader,
  OrdersTableLoader,
} from "./_components/loader";

export default function OrdersPage({
  searchParams,
}: {
  searchParams?: {
    order_id: string;
    status: string;
  };
}) {
  const orderId = searchParams?.order_id;
  const status = searchParams?.status?.split(",") ?? [];

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Suspense fallback={<OrderSummaryCardsLoader />}>
          <SummaryCards />
        </Suspense>
        <Suspense fallback={<OrdersTableLoader />}>
          <OrdersTable status={status} />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<OrderCardLoader />}>
          {orderId && <OrderCard orderId={orderId} />}
        </Suspense>
      </div>
    </div>
  );
}
