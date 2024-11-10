import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  orders,
  payments,
  orderItems,
  type CreateOrderParams,
  type UpdateOrderParams,
  type OrderId,
  createOrderSchema,
  updateOrderSchema,
  meetings,
  returnAddress,
  PaymentParams,
  paymentSchema,
} from "@/server/db/schema/orders";
import { type CartExtended } from "@/server/db/schema/cart";
import { cartItems } from "@/server/db/schema/cart";
import { sendNewOrderEmail, sendOrderCompletedEmail } from "@/lib/mail";
import { MidtransClient } from "midtrans-node-client";
import { getExistingPaymentToken } from "./queries";

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

    const returnAdd = {
      orderId: order.id,
      name: newOrder.data.name,
      address: newOrder.data.address,
      additionalInformation: newOrder.data.address2,
      city: newOrder.data.city,
      province: newOrder.data.province,
      postalCode: newOrder.data.postalCode,
      phone: newOrder.data.addressPhone,
    };

    await db.transaction(async (tx) => {
      await tx.insert(orderItems).values(items);
      await tx.insert(meetings).values(meeting);
      if (newOrder.data.returnType === "yes") {
        // @ts-expect-error returnAddress is contains possibly undefined values
        await tx.insert(returnAddress).values(returnAdd);
      }
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
    await sendNewOrderEmail(orderEmail, newOrderItems, total);

    return order;
  } catch (error) {
    console.log(error);
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

  const updateOrder = updateOrderSchema.safeParse(order);

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

export const updateCheckout = async (
  orderId: OrderId,
  order: CreateOrderParams,
) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const newOrder = createOrderSchema.safeParse(order);

  if (!newOrder.success) {
    return { error: "Invalid order data" };
  }

  try {
    const meetingDate = await db.query.meetings.findFirst({
      where: (meetings, { eq }) => eq(meetings.date, newOrder.data.meetingDate),
    });

    if (meetingDate && meetingDate.orderId !== orderId) {
      return { error: "Metting time is not available" };
    }

    const [order] = await db
      .update(orders)
      .set({
        userId: user.id,
        contactName: newOrder.data.contactName,
        phone: newOrder.data.phone,
        brandName: newOrder.data.brandName,
        status: "pending",
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!order) {
      return { error: "Error creating order" };
    }

    const meeting = {
      orderId: order.id,
      type: newOrder.data.meetingType,
      date: newOrder.data.meetingDate,
      locationId: newOrder.data.locationId,
    };

    const returnAdd = {
      orderId: order.id,
      name: newOrder.data.name,
      address: newOrder.data.address,
      additionalInformation: newOrder.data.address2,
      city: newOrder.data.city,
      province: newOrder.data.province,
      postalCode: newOrder.data.postalCode,
      phone: newOrder.data.addressPhone,
    };

    console.log(returnAdd);

    await db.transaction(async (tx) => {
      await tx
        .update(meetings)
        .set(meeting)
        .where(eq(meetings.orderId, orderId));
      if (newOrder.data.returnType === "yes") {
        await tx
          .insert(returnAddress)
          // @ts-expect-error ReturnAdd contains possibly undefined
          .values(returnAdd)
          .onConflictDoUpdate({
            target: returnAddress.orderId,
            set: {
              name: returnAdd.name,
              address: returnAdd.address,
              additionalInformation: returnAdd.additionalInformation,
              city: returnAdd.city,
              province: returnAdd.province,
              postalCode: returnAdd.postalCode,
              phone: returnAdd.phone,
            },
          });
      }
      if (newOrder.data.returnType === "no") {
        await tx
          .delete(returnAddress)
          .where(eq(returnAddress.orderId, order.id));
      }
      await tx.delete(cartItems).where(eq(cartItems.cartId, user.cartId));
    });

    const orderEmail = {
      id: order.id,
      contactName: order.contactName,
      brandName: order.brandName,
    };

    // TODO: use background jobs to send email notification

    // await sendNewOrderEmail(orderEmail, newOrderItems, total);

    return order;
  } catch (error) {
    console.log(error);
    return { error: "Error creating order" };
  }
};

export const getPaymentToken = async (
  orderId: OrderId,
  payment: PaymentParams,
) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const newPayment = paymentSchema.safeParse(payment);

  if (!newPayment.success) {
    return { error: "Invalid order data" };
  }

  try {
    const existingToken = await getExistingPaymentToken(orderId);
    if (existingToken) {
      return { token: existingToken };
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        total: true,
        brandName: true,
        contactName: true,
        phone: true,
      },
      where: (orders, { eq }) => eq(orders.id, orderId),
    });

    if (!order) throw new Error("Order is not found");

    const snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: "",
        last_name: order.contactName,
        email: user.email,
        phone: order.phone,
      },
      enabled_payments: [newPayment.data.method],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderId}`,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    await db.insert(payments).values({
      orderId: order.id,
      status: "pending",
      snapToken: token,
      method: newPayment.data.method,
    });

    return { token: token };
  } catch (err) {
    if (err instanceof Error) {
      const message = err.message;
      console.log(message);
      if (message) return { error: message };

      return { error: "Cannot create payment" };
    }
  }
};
