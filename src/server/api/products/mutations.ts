import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  products,
  insertProductSchema,
  type ProductId,
  type NewProductParams,
  type UpdateProductParams,
} from "@/server/db/schema/product";

export const createProduct = async (product: NewProductParams) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const newProduct = insertProductSchema.safeParse(product);

  if (!newProduct.success) {
    return { error: "Invalid product data" };
  }

  try {
    await db.insert(products).values(product).returning();

    return { success: "Product created successfully" };
  } catch (error) {
    const message = (error as Error).message ?? "Product creation failed";
    if (message.includes("duplicate key value")) {
      return { error: "Product already exists" };
    }
    return { error: "Product creation failed" };
  }
};

export const updateProduct = async (
  id: ProductId,
  product: UpdateProductParams,
) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const updatedProduct = insertProductSchema.safeParse({
    ...product,
  });

  if (!updatedProduct.success) {
    return { error: "Invalid product data" };
  }

  try {
    await db
      .update(products)
      .set({ ...updatedProduct.data })
      .where(eq(products.id, id));

    return { success: "Product updated successfully" };
  } catch (error) {
    return { error: "Product update failed" };
  }
};

export const deleteProduct = async (id: ProductId) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(products).where(eq(products.id, id));

    return { success: "Product deleted successfully" };
  } catch (error) {
    return { error: "Product deletion failed" };
  }
};
