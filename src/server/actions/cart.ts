"use server";

import { revalidatePath } from "next/cache";
import {
  NewCartItemParams,
  insertCartItemParams,
  CartItemId,
} from "../db/schema/cart";
import {
  addToCart as _addToCart,
  deleteFromCart as _deleteFromCart,
  updateCart as _updateCart,
} from "../api/carts/mutations";

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

const revalidateCart = () => revalidatePath("/cart");

export async function addToCart(input: NewCartItemParams) {
  try {
    const payload = insertCartItemParams.parse(input);
    const res = await _addToCart(payload);
    if (res.error) throw new Error(res.error);
    revalidateCart();
  } catch (e) {
    return handleErrors(e);
  }
}

export async function updateCart(id: CartItemId, quantity: number) {
  try {
    const res = await _updateCart(id, quantity);
    if (res.error) throw new Error(res.error);
    revalidateCart();
  } catch (e) {
    return handleErrors(e);
  }
}

export async function deleteFromCart(id: CartItemId) {
  try {
    const res = await _deleteFromCart(id);
    if (res.error) throw new Error(res.error);
    revalidateCart();
  } catch (e) {
    return handleErrors(e);
  }
}
