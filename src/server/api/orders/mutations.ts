import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  orders,
  orderItems,
  type NewOrderParams,
  type OrderId,
  insertOrderParams,
  UpdateOrderParams,
  updateOrderParams,
} from "@/server/db/schema/orders";
import { type CartExtended } from "@/server/db/schema/cart";
import { cartItems } from "@/server/db/schema/cart";
import { sendOrderCompletedEmail } from "@/lib/mail";
import { getOrderById } from "./queries";

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
      categoryName: item.package.categoryName,
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

export const updateOrder = async (
  orderId: OrderId,
  order: UpdateOrderParams,
) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const updateOrder = updateOrderParams.safeParse(order);

  if (!updateOrder.success) {
    return { error: "Invalid order data" };
  }

  try {
    const updatedOrder = await db
      .update(orders)
      .set({ ...updateOrder.data, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      return { error: "Error updating order" };
    }

    const order = await db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.id, orderId),
      with: {
        user: true,
      },
    });

    if (!order) {
      return { error: "Error updating order" };
    }

    if (
      updateOrder.data.contentResult &&
      updateOrder.data.status === "completed"
    ) {
      await sendOrderCompletedEmail(
        order.user.email,
        order.user.name ?? order.contactName,
        updateOrder.data.contentResult,
      );
    }

    return updatedOrder;
  } catch (error) {
    return { error: "Error updating order" };
  }
};
