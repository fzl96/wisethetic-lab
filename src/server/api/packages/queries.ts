import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import {
  packages,
  type PackageId,
  type CategoryId,
  categories,
} from "@/server/db/schema/product";
import { type SearchParams } from "@/lib/validations";
import { count, eq, ilike, desc } from "drizzle-orm";

export const getPackages = async ({ query = "", page = 1 }: SearchParams) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await db.query.packages.findMany({
    where: (packages, { ilike }) => ilike(packages.name, `%${query}%`),
    orderBy: (packages, { desc }) => desc(packages.updatedAt),
    limit: 6,
    offset: (page - 1) * 6,
  });
};

export const getPackagesWithCategory = async (categoryName = "") => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  let pkgs;
  if (categoryName) {
    pkgs = await db
      .select()
      .from(packages)
      .innerJoin(categories, eq(packages.categoryId, categories.id))
      .where(eq(categories.name, categoryName))
      .orderBy(desc(packages.updatedAt));
  } else {
    pkgs = await db
      .select()
      .from(packages)
      .innerJoin(categories, eq(packages.categoryId, categories.id))
      .orderBy(desc(packages.updatedAt));
  }

  const result = pkgs.map((pkg) => {
    return {
      id: pkg.package.id,
      name: pkg.package.name,
      description: pkg.package.description,
      image: pkg.package.image,
      createdAt: pkg.package.createdAt,
      updatedAt: pkg.package.updatedAt,
      category: {
        id: pkg.category.id,
        name: pkg.category.name,
      },
    };
  });

  return result;
};

export const getPackageById = async (id: PackageId) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await db.query.packages.findFirst({
    where: (packages, { eq }) => eq(packages.id, id),
  });
};

export const getPackagesPage = async ({ query = "" }: { query?: string }) => {
  const [row] = await db
    .select({
      value: count(),
    })
    .from(packages)
    .where(ilike(packages.name, `%${query}%`));

  if (!row) {
    return 0;
  }

  return Math.ceil(row.value / 6);
};
