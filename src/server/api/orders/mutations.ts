import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  orders,
  orderItems,
  type NewOrderParams,
  type OrderId,
  insertOrderParams,
} from "@/server/db/schema/orders";
import { type CartExtended } from "@/server/db/schema/cart";
import { cartItems } from "@/server/db/schema/cart";

export const createOrder = async (
  order: NewOrderParams,
  cart: CartExtended,
) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const newOrder = insertOrderParams.safeParse(order);

  if (!newOrder.success) {
    return { error: "Invalid order data" };
  }

  const total = cart.items.reduce(
    (acc, item) =>
      acc +
      item.package.product.price +
      item.package.additionalContentPrice *
        item.package.additionalContentQuantity,
    0,
  );

  try {
    const [order] = await db
      .insert(orders)
      .values({
        ...newOrder.data,
        userId: user.id,
        total: total,
        status: "pending",
      })
      .returning();

    if (!order) {
      return { error: "Error creating order" };
    }
    const items = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.package.product.id,
      productName: item.package.product.name,
      productPrice: item.package.product.price,
      packageId: item.package.id,
      packageName: item.package.name,
      packagePrice: item.package.additionalContentPrice,
      packageImg: item.package.image,
      additionalContentQuantity: item.package.additionalContentQuantity,
    }));

    await db.insert(orderItems).values(items);
    await db.delete(cartItems).where(eq(cartItems.cartId, user.cartId));

    // return { success: "Order created" };
    return order;
  } catch (error) {
    return { error: "Error creating order" };
  }
};
