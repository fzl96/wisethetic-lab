import { getCart } from "@/server/api/carts/queries";
import { CheckoutFormClient } from "./form-client";

export async function CheckoutForm() {
  const cart = await getCart();

  return cart && <CheckoutFormClient cart={cart} />;
}
