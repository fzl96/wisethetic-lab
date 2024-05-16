import { Suspense } from "react";
import { OrdersTable } from "./_components/table";

export default async function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersTable />
    </Suspense>
  );
}
