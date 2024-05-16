import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import crypto from "crypto";
import { orders, payments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const {
    status_code,
    transaction_status,
    payment_type,
    order_id,
    fraud_status,
    signature_key,
    gross_amount,
  } = await req.json();

  if (!order_id || typeof order_id !== "string") {
    console.log("order id problem");
    return NextResponse.json({ status: "error", message: "Invalid order_id" });
  }

  const hash = crypto
    .createHash("sha512")
    .update(
      `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
    )
    .digest("hex");

  if (!hash !== signature_key) {
    console.log("signature problem");
    return NextResponse.json({
      status: "error",
      message: "Invalid signature",
    });
  }

  console.log("status: ", transaction_status);

  if (transaction_status === "capture") {
    if (fraud_status === "accept") {
      await db
        .update(payments)
        .set({ status: "completed", method: payment_type })
        .where(eq(payments.orderId, order_id));
      await db
        .update(orders)
        .set({ status: "process" })
        .where(eq(orders.id, order_id));
    }
  } else if (transaction_status === "settlement") {
    console.log("settled");
    await db
      .update(payments)
      .set({ status: "completed", method: payment_type })
      .where(eq(payments.orderId, order_id));
    await db
      .update(orders)
      .set({ status: "process" })
      .where(eq(orders.id, order_id));
  } else if (
    transaction_status === "cancel" ||
    transaction_status === "deny" ||
    transaction_status === "expire"
  ) {
    await db
      .update(payments)
      .set({ status: "cancelled" })
      .where(eq(payments.orderId, order_id));
    await db
      .update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.id, order_id));
  } else if (transaction_status === "pending") {
    // TODO set transaction status on your database to 'pending' / waiting payment
    // and response with 200 OK
    console.log("pending");
  }

  return NextResponse.json({
    status: "success",
    message: "OK",
  });
}
