import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  orders,
  orderItems,
  type NewOrderParams,
  type CreateOrderParams,
  type OrderId,
  insertOrderParams,
  UpdateOrderParams,
  updateOrderParams,
  createOrderSchema,
  meetings,
} from "@/server/db/schema/orders";
import { type CartExtended } from "@/server/db/schema/cart";
import { cartItems } from "@/server/db/schema/cart";
import { sendNewOrderEmail, sendOrderCompletedEmail } from "@/lib/mail";

export const createOrder = async (
  order: CreateOrderParams,
  cart: CartExtended,
) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const newOrder = createOrderSchema.safeParse(order);

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
    const returnAddress = `${newOrder.data.name}, ${newOrder.data.addressPhone}, ${newOrder.data.address}, ${newOrder.data.address2}, ${newOrder.data.city}, ${newOrder.data.province}, ${newOrder.data.postalCode}`;

    const meetingDate = await db.query.meetings.findFirst({
      where: (meetings, { eq }) => eq(meetings.date, newOrder.data.meetingDate),
    });

    if (meetingDate) {
      return { error: "Metting time is not available" };
    }

    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        contactName: newOrder.data.contactName,
        phone: newOrder.data.phone,
        brandName: newOrder.data.brandName,
        returnAddress: returnAddress,
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

    const meeting = {
      orderId: order.id,
      type: newOrder.data.meetingType,
      date: newOrder.data.meetingDate,
      locationId: newOrder.data.locationId,
    };

    await db.transaction(async (tx) => {
      await tx.insert(orderItems).values(items);
      await tx.insert(meetings).values(meeting);
      await tx.delete(cartItems).where(eq(cartItems.cartId, user.cartId));
    });

    const orderEmail = {
      id: order.id,
      contactName: order.contactName,
      brandName: order.brandName,
    };

    const newOrderItems = items.map((item) => ({
      packageName: item.packageName,
      categoryName: item.categoryName,
      productName: item.productName,
      additionalContentQuantity: item.additionalContentQuantity,
      total:
        item.packagePrice * item.additionalContentQuantity + item.productPrice,
    }));

    // TODO: use background jobs to send email notification

    console.log(total);
    await sendNewOrderEmail(orderEmail, newOrderItems, total);

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
