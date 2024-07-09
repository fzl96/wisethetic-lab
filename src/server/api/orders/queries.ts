import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import { OrderId, payments, orders } from "@/server/db/schema/orders";
import { MidtransClient } from "midtrans-node-client";
import { sum, count, sql, inArray } from "drizzle-orm";

export const getUserOrders = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const orders = await db.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.userId, user.id ?? ""),
    columns: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
    },
    with: {
      payment: true,
    },
    orderBy: (orders, { desc }) => desc(orders.createdAt),
  });

  return orders;
};

export const getOrderByIdWithItems = async (id: OrderId) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      orderItems: true,
      payment: true,
    },
  });

  if (order?.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return order;
};

export const getOrderByIdWithItemsAndUser = async (id: OrderId) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      orderItems: true,
      payment: true,
      user: true,
    },
  });

  return order;
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
    with: {
      payment: true,
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

export const getOrdersPage = async ({ status }: { status: string[] }) => {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (status.length !== 0) {
    const [countRes] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as("count"),
      })
      .from(orders)
      .where(
        inArray(
          orders.status,
          status as ("pending" | "process" | "completed" | "cancelled")[],
        ),
      );

    return countRes?.count ? Math.ceil(countRes.count / 5) : 1;
  }
  const [countRes] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as("count"),
    })
    .from(orders);

  return countRes?.count ? Math.ceil(countRes.count / 5) : 1;
};

export const getOrders = async ({
  status,
  page,
}: {
  status: string[];
  page: number;
}) => {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    if (status.length !== 0) {
      const orders = await db.query.orders.findMany({
        columns: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          contactName: true,
          brandName: true,
        },
        with: {
          payment: true,
          user: {
            columns: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        where: (orders, { inArray }) =>
          inArray(
            orders.status,
            status as ("pending" | "process" | "completed" | "cancelled")[],
          ),
        orderBy: (orders, { desc }) => desc(orders.createdAt),
        limit: 5,
        offset: (page - 1) * 5,
      });

      return orders;
    }

    const orders = await db.query.orders.findMany({
      columns: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        contactName: true,
        brandName: true,
      },
      with: {
        payment: true,
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: (orders, { desc }) => desc(orders.createdAt),
      limit: 5,
      offset: (page - 1) * 5,
    });

    return orders;
  } catch (err) {
    return [];
  }
};

export const getOrdersSummary = async () => {
  const user = await currentUser();

  if (user?.role !== "ADMIN") {
    throw new Error("unauthorized");
  }

  const [ordersCount] = await db
    .select({
      total: count(),
      sum: sum(
        sql`CASE WHEN ${orders.status} = 'completed' THEN ${orders.total} END`,
      ),
      process: count(sql`CASE WHEN ${orders.status} = 'process' THEN 1 END`),
      completed: count(
        sql`CASE WHEN ${orders.status} = 'completed' THEN 1 END`,
      ),
    })
    .from(orders);

  return ordersCount;
};
