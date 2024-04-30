"use server";

import { revalidatePath } from "next/cache";
import {
  createPackage,
  updatePackage,
  deletePackage,
} from "@/server/api/packages/mutations";
import {
  type PackageId,
  type NewPackageParams,
  type UpdatePackageParams,
  packageIdSchema,
  insertPackageParams,
  updatePackageParams,
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

const revalidatePackage = () => revalidatePath("/dashboard/categories");

export const createPackageAction = async (input: NewPackageParams) => {
  try {
    const payload = insertPackageParams.parse(input);
    const res = await createPackage(payload);
    if (res.error) throw new Error(res.error);
    revalidatePackage();
    return { message: "Package created successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePackageAction = async (input: UpdatePackageParams) => {
  try {
    const payload = updatePackageParams.parse(input);
    const res = await updatePackage(payload.id, payload);

    if (res.error) throw new Error(res.error);

    revalidatePackage();
    return { message: "Package updated successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePackageAction = async (packageId: PackageId) => {
  try {
    const payload = packageIdSchema.parse({ id: packageId });
    await deletePackage(payload.id);
    revalidatePackage();
  } catch (e) {
    return handleErrors(e);
  }
};
