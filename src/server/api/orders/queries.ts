import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import { Order, OrderId, payments } from "@/server/db/schema/orders";
import { MidtransClient } from "midtrans-node-client";

export const getUserOrders = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const orders = await db.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.userId, user.id ?? ""),
    with: {
      orderItems: true,
    },
  });

  return { orders };
};

export const getOrderById = async (id: OrderId) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    columns: {
      id: true,
      createdAt: true,
      total: true,
    },
  });

  return order;
};

export const getPaymentToken = async (order: {
  id: string;
  total: number;
  createdAt: Date;
}) => {
  const payment = await db.query.payments.findFirst({
    where: (payments, { eq }) => eq(payments.orderId, order.id),
  });

  if (payment?.snapToken) {
    return payment.snapToken;
  }

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
  };

  const token = await snap.createTransactionToken(parameter);
  await db.insert(payments).values({
    orderId: order.id,
    status: "pending",
    snapToken: token,
  });

  return token;
};
