"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/server/api/categories/mutations";
import {
  type CategoryId,
  type NewCategoryParams,
  type UpdateCategoryParams,
  categoryIdSchema,
  insertCategoryParams,
  updateCategoryParams,
} from "@/server/db/schema/product";

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

const revalidateCategory = () => revalidatePath("/dashboard/categories");

export const createCategoryAction = async (input: NewCategoryParams) => {
  try {
    const payload = insertCategoryParams.parse(input);
    const res = await createCategory(payload);
    if (res.error) throw new Error(res.error);
    revalidateCategory();
    return { message: "Category created successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCategoryAction = async (input: UpdateCategoryParams) => {
  try {
    const payload = updateCategoryParams.parse(input);
    const res = await updateCategory(payload.id, payload);

    if (res.error) throw new Error(res.error);

    revalidateCategory();
    return { message: "Category updated successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCategoryAction = async (categoryId: CategoryId) => {
  try {
    const payload = categoryIdSchema.parse({ id: categoryId });
    await deleteCategory(payload.id);
    revalidateCategory();
  } catch (e) {
    return handleErrors(e);
  }
};
