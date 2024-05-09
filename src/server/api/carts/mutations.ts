import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  cartItems,
  type NewCartItemParams,
  insertCartItemSchema,
  CartItemId,
} from "@/server/db/schema/cart";

export const addToCart = async (cartItem: NewCartItemParams) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const newCartItem = insertCartItemSchema.safeParse(cartItem);

  if (!newCartItem.success) {
    return { error: "Invalid cart item data" };
  }

  try {
    const existingCartItem = await db.query.cartItems.findFirst({
      where: (cartItems, { eq }) =>
        eq(cartItems.packageId, newCartItem.data.packageId),
    });

    console.log(existingCartItem);

    if (!existingCartItem) {
      await db.insert(cartItems).values(newCartItem.data);
      return { success: "Added to cart" };
    }

    if (
      existingCartItem?.productId === newCartItem.data.productId &&
      existingCartItem?.additionalContentQuantity ===
        newCartItem.data.additionalContentQuantity
    ) {
      return { error: "Item already exists in cart" };
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
    console.log("error", error);
    return { error: "Failed to add item to cart" };
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
