import { getOrderById, getPaymentToken } from "@/server/api/orders/queries";
import { RenderPayment } from "./_components/render";

export default async function OrderPaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderId = params.orderId;
  const order = await getOrderById(orderId);

  if (!order) {
    return <div>Order not found</div>;
  }

  const token = await getPaymentToken(order);

  return <RenderPayment order={order} token={token} />;
}
