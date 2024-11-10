import { Suspense } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { OrderDetails } from "./_components/order-details";
import { OrderDetailsSkeleton } from "./_components/order-details-skeleton";

export default async function OrderIdPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="sr-only">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<OrderDetailsSkeleton />}>
          <OrderDetails orderId={params.id} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
