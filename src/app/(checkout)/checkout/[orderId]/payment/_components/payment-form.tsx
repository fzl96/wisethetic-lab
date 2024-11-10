import { getPayment } from "@/server/api/orders/queries";
import { PaymentFormClient } from "./payment-form-client";

interface PaymentFormProps {
  orderId: string;
}

export async function PaymentForm({ orderId }: PaymentFormProps) {
  const payment = await getPayment(orderId);

  return <PaymentFormClient orderId={orderId} payment={payment} />;
}
