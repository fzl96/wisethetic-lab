import { getUserOrders } from "@/server/api/orders/queries";

export default async function OrdersPage() {
  const orders = await getUserOrders();
  return (
    <div>
      <pre>
        <code>{JSON.stringify(orders, null, 2)}</code>
      </pre>
    </div>
  );
}
