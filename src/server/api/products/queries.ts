import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import {
  products,
  type ProductId,
  type PackageId,
} from "@/server/db/schema/product";
import { eq } from "drizzle-orm";

export const getProducts = async (packageId: PackageId) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await db.query.products.findMany({
    where: (products) => eq(products.packageId, packageId),
  });
};
