import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import { type PackageId } from "@/server/db/schema/product";
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

export const getProductWithPackage = async (productId: string) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const product = await db.query.products.findFirst({
    where: (product) => eq(product.id, productId),
    with: {
      package: {
        columns: {
          id: true,
          name: true,
          description: true,
          image: true,
          categoryId: true,
          additionalContentPrice: true,
        },
      },
    },
  });

  return product;
};
