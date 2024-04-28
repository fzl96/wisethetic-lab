import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  packages,
  insertPackageSchema,
  packageIdSchema,
  type PackageId,
  type CategoryId,
  type NewPackageParams,
  type UpdateCategoryParams,
} from "@/server/db/schema/product";

export const createPackage = async (pkg: NewPackageParams) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const newPackage = insertPackageSchema.safeParse(pkg);

  if (!newPackage.success) {
    return { error: "Invalid package data" };
  }

  try {
    await db.insert(packages).values(pkg).returning();

    return { success: "Package created successfully" };
  } catch (error) {
    const message = (error as Error).message ?? "Package creation failed";
    if (message.includes("duplicate key value")) {
      return { error: "Package already exists" };
    }
    return { error: "Package creation failed" };
  }
};

export const updatePackage = async (
  id: PackageId,
  pkg: UpdateCategoryParams,
) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const updatedPackage = insertPackageSchema.safeParse({
    ...pkg,
  });

  if (!updatedPackage.success) {
    return { error: "Invalid package data" };
  }

  try {
    await db
      .update(packages)
      .set({ ...updatedPackage.data })
      .where(eq(packages.id, id));

    return { success: "Package updated successfully" };
  } catch (error) {
    return { error: "Package update failed" };
  }
};

export const deletePackage = async (id: PackageId) => {
  const user = await currentUser();
  if (user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(packages).where(eq(packages.id, id));
    return { success: "Package deleted successfully" };
  } catch (error) {
    return { error: "Package deletion failed" };
  }
};
