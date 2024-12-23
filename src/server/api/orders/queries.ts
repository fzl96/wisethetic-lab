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
    orderBy: (orders, { desc }) => desc(orders.createdAt),
  });

  return orders;
};

export const getUserOrderDetails = async (orderId: OrderId) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    with: {
      orderItems: true,
      returnAddress: true,
      payment: true,
      meeting: {
        with: {
          location: true,
        },
      },
    },
    where: (orders, { eq }) => eq(orders.id, orderId),
  });

  if (order?.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  return order;
};

export const getOrderCardDetails = async (id: OrderId) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      orderItems: true,
      payment: true,
      meeting: {
        with: {
          location: {
            columns: {
              name: true,
              link: true,
            },
          },
        },
      },
      returnAddress: true,
      user: {
        columns: {
          email: true,
        },
      },
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

export const getCheckoutOrderById = async (id: OrderId) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      meeting: true,
      returnAddress: true,
    },
  });

  return order;
};

export const getCheckoutSummary = async (id: OrderId) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const orderItems = await db.query.orderItems.findMany({
    where: (orderItems, { eq }) => eq(orderItems.orderId, id),
  });

  return orderItems;
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
    credit_card: {
      secure: true,
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

export async function getOrderForPayment(orderId: OrderId) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orders.findFirst({
    columns: {
      id: true,
      contactName: true,
      brandName: true,
    },
    where: (orders, { eq }) => eq(orders.id, orderId),
  });

  return order;
}

export async function getExistingPaymentToken(orderId: OrderId) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const res = await db.query.payments.findFirst({
    columns: {
      snapToken: true,
    },
    where: (payments, { eq }) => eq(payments.orderId, orderId),
  });

  const token = res?.snapToken;

  return token;
}

export async function getPayment(orderId: OrderId) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const payment = await db.query.payments.findFirst({
    where: (payments, { eq }) => eq(payments.orderId, orderId),
  });

  return payment;
}
