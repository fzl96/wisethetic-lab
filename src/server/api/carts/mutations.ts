import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import {
  cartItems,
  type NewCartItemParams,
  insertCartItemSchema,
  CartItemId,
} from "@/server/db/schema/cart";

export const addToCart = async (cartItem: NewCartItemParams) => {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  const newCartItem = insertCartItemSchema.safeParse(cartItem);

  if (!newCartItem.success) {
    throw new Error("Invalid cart item data");
  }

  try {
    const existingCart = await db.query.carts.findFirst({
      where: (carts, { eq }) => eq(carts.userId, user.id!),
    });

    if (!existingCart) {
      throw new Error("Cart not found");
    }

    const existingCartItem = await db.query.cartItems.findFirst({
      where: (cartItems, { eq }) =>
        and(
          eq(cartItems.packageId, newCartItem.data.packageId),
          eq(cartItems.cartId, existingCart?.id),
        ),
    });

    if (!existingCartItem) {
      await db.insert(cartItems).values(newCartItem.data);
      return { success: "Added to cart" };
    }

    if (
      existingCartItem?.productId === newCartItem.data.productId &&
      existingCartItem?.additionalContentQuantity ===
        newCartItem.data.additionalContentQuantity
    ) {
      throw new Error("Item already in cart");
    }

    if (
      existingCartItem?.additionalContentQuantity !==
        newCartItem.data.additionalContentQuantity ||
      existingCartItem?.productId !== newCartItem.data.productId
    ) {
      await db
        .update(cartItems)
        .set({
          ...newCartItem.data,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingCartItem.id));

      return { success: "Item updated in cart" };
    }

    return { success: "Item added to cart" };
  } catch (error) {
    const e = error as Error;
    return { error: e.message };
  }
};

export const updateCart = async (id: CartItemId, quantity: number) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(cartItems)
      .set({
        additionalContentQuantity: quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, id));
    return { success: "Item updated in cart" };
  } catch (error) {
    return { error: "Failed to update item in cart" };
  }
};

export const deleteFromCart = async (id: CartItemId) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return { success: "Item deleted from cart" };
  } catch (error) {
    return { error: "Failed to delete item from cart" };
  }
};
