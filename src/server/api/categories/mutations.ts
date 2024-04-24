import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  categories,
  insertCategorySchema,
  categoryIdSchema,
  type CategoryId,
  type NewCategoryParams,
  type UpdateCategoryParams,
} from "@/server/db/schema/product";

export const createCategory = async (category: NewCategoryParams) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const newCategory = insertCategorySchema.safeParse(category);

  if (!newCategory.success) {
    return { error: "Invalid category data" };
  }

  try {
    const res = await db
      .insert(categories)
      .values(newCategory.data)
      .returning();
    console.log("res: ", res);
    return { success: "Category created successfully" };
  } catch (error) {
    const message = (error as Error).message ?? "Category creation failed";
    if (message.includes("duplicate key value")) {
      return { error: "Category already exists" };
    }
    return { error: "Category creation failed" };
  }
};

export const updateCategory = async (
  id: CategoryId,
  category: UpdateCategoryParams,
) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const updatedCategory = insertCategorySchema.safeParse(category);

  if (!updatedCategory.success) {
    return { error: "Invalid category data" };
  }

  try {
    // TODO delete / update image on cloud
    await db
      .update(categories)
      .set(updatedCategory.data)
      .where(eq(categories.id, id));
    return { success: "Category updated successfully" };
  } catch (error) {
    const message = (error as Error).message ?? "Category update failed";
    console.error(message);
    if (message.includes("duplicate key value")) {
      return { error: "Category already exists" };
    }
    return { error: "Category update failed" };
  }
};

export const deleteCategory = async (id: CategoryId) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const { id: categoryId } = categoryIdSchema.parse({ id });
  try {
    // TODO delete image on cloud

    await db.delete(categories).where(eq(categories.id, categoryId));
    return { success: "Category deleted" };
  } catch (error) {
    const message = (error as Error).message ?? "Category deletion failed";
    console.error(message);
    return { error: "Category deletion failed" };
  }
};
