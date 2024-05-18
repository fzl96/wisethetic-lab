import { Suspense } from "react";
import { OrdersTable } from "./_components/table";
import { OrderCard } from "./_components/order-card";
import SummaryCards from "./_components/order-summary-cards";

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
        <Suspense fallback={null}>
          <SummaryCards />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <OrdersTable status={status} />
        </Suspense>
      </div>
      <div>{orderId && <OrderCard orderId={orderId} />}</div>
    </div>
  );
}
