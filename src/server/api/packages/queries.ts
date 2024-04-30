import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import {
  packages,
  type PackageId,
  categories,
  products,
  type Package,
  type Product,
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
      .select({
        id: packages.id,
        name: packages.name,
        description: packages.description,
        image: packages.image,
        createdAt: packages.createdAt,
        updatedAt: packages.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(packages)
      .innerJoin(categories, eq(packages.categoryId, categories.id))
      .where(eq(categories.name, categoryName))
      .orderBy(desc(packages.updatedAt));
  } else {
    pkgs = await db
      .select({
        id: packages.id,
        name: packages.name,
        description: packages.description,
        image: packages.image,
        createdAt: packages.createdAt,
        updatedAt: packages.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(packages)
      .innerJoin(categories, eq(packages.categoryId, categories.id))
      .orderBy(desc(packages.updatedAt));
  }

  // const result = pkgs.map((pkg) => {
  //   return {
  //     id: pkg.package.id,
  //     name: pkg.package.name,
  //     description: pkg.package.description,
  //     image: pkg.package.image,
  //     createdAt: pkg.package.createdAt,
  //     updatedAt: pkg.package.updatedAt,
  //     category: {
  //       id: pkg.category.id,
  //       name: pkg.category.name,
  //     },
  //   };
  // });

  return pkgs;
};

export const getPackageByNameWithProducts = async (
  category: string,
  pkgName: string,
) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  console.log(`category: ${category}`);
  console.log(`pkgName: ${pkgName}`);

  // const [res] = await db
  //   .select({
  //     id: packages.id,
  //     name: packages.name,
  //     description: packages.description,
  //     image: packages.image,
  //     createdAt: packages.createdAt,
  //     updatedAt: packages.updatedAt,
  //   })
  //   .from(packages)
  //   .innerJoin(categories, eq(packages.categoryId, categories.id))
  //   .where(eq(categories.name, category));

  const sq = db.$with("sq").as(
    db
      .select({
        id: packages.id,
        name: packages.name,
        description: packages.description,
        image: packages.image,
        createdAt: packages.createdAt,
        updatedAt: packages.updatedAt,
        categoryId: packages.categoryId,
        // categoryName: categories.name,
      })
      .from(packages)
      .innerJoin(categories, eq(packages.categoryId, categories.id))
      .where(eq(categories.name, category)),
  );

  const [pkg] = await db.with(sq).select().from(sq).where(eq(sq.name, pkgName));
  // .innerJoin(products, eq(sq.id, products.packageId));

  return pkg;

  // const res = pkg.reduce<
  //   Record<number, { package: Package; products: Product[] }>
  // >((acc, row) => {
  //   const pkg = row.sq;
  //   const product = row.product;

  //   // @ts-expect-error - TS doesn't know that the key is not number
  //   if (!acc[pkg.id]) {
  //     // @ts-expect-error - TS doesn't know that the key is not number
  //     acc[pkg.id] = { package: pkg, products: [] };
  //   }

  //   if (product) {
  //     // @ts-expect-error - TS doesn't know that the key is not number
  //     acc[pkg.id].products.push(product);
  //   }

  //   return acc;
  // }, {});

  // const [result] = Object.values(res);

  // return {
  //   id: result?.package.id,
  //   name: result?.package.name,
  //   description: result?.package.description,
  //   image: result?.package.image,
  //   createdAt: result?.package.createdAt,
  //   updatedAt: result?.package.updatedAt,
  //   products: result?.products,
  // };
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
