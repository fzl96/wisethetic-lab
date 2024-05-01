"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/server/api/products/mutations";
import {
  type ProductId,
  type NewProductParams,
  type UpdateProductParams,
  insertProductParams,
  updateProductParams,
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

const revalidateProduct = () => revalidatePath("/dashboard/packages");

export const createProductAction = async (input: NewProductParams) => {
  try {
    const payload = insertProductParams.parse(input);
    const res = await createProduct(payload);
    if (res.error) throw new Error(res.error);
    revalidateProduct();
    return { message: "Product created successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateProductAction = async (input: UpdateProductParams) => {
  try {
    const payload = updateProductParams.parse(input);
    const res = await updateProduct(payload.id, payload);

    if (res.error) throw new Error(res.error);

    revalidateProduct();
    return { message: "Product updated successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteProductAction = async (productId: ProductId) => {
  try {
    await deleteProduct(productId);
    revalidateProduct();
  } catch (e) {
    return handleErrors(e);
  }
};
