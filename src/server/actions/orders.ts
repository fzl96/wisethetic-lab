"use server";

import { revalidatePath } from "next/cache";
import { createOrder } from "@/server/api/orders/mutations";
import {
  insertOrderParams,
  type NewOrderParams,
} from "@/server/db/schema/orders";
import { type CartExtended } from "../db/schema/cart";

const handleErrors = (e: unknown) => {
  const errMsg = { error: "An error occurred" };
  if (e instanceof Error) {
    const err = { error: e.message };
    return e.message.length > 0 ? err : errMsg;
  }
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? { error: errAsStr } : errMsg;
  }
  return errMsg;
};

const revalidateOrder = () => revalidatePath("/cart");

export const createOrderAction = async (
  input: NewOrderParams,
  cart: CartExtended,
) => {
  try {
    const payload = insertOrderParams.parse(input);
    const res = await createOrder(payload, cart);

    // if (res.error) throw new Error(res.error);
    revalidateOrder();
    return res;
  } catch (e) {
    return handleErrors(e);
  }
};