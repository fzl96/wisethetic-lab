import { Suspense } from "react";
import { OrdersTable } from "./orders/_components/table";
import { OrderCard } from "./orders/_components/order-card";
import SummaryCards from "./orders/_components/order-summary-cards";
import {
  OrderCardLoader,
  OrderSummaryCardsLoader,
  OrdersTableLoader,
} from "./orders/_components/loader";
import { Pagination } from "@/components/ui/pagination";

export default function Dashboard({
  searchParams,
}: {
  searchParams?: {
    order_id: string;
    status: string;
    page: string;
  };
}) {
  const orderId = searchParams?.order_id;
  const status = searchParams?.status?.split(",") ?? [];
  const page = isNaN(Number(searchParams?.page))
    ? 1
    : Number(searchParams?.page);

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Suspense fallback={<OrderSummaryCardsLoader />}>
          <SummaryCards />
        </Suspense>
        <Suspense fallback={<OrdersTableLoader />}>
          <OrdersTable status={status} page={page} orderId={orderId ?? ""} />
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
