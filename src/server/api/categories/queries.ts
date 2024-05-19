import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import { categories, type CategoryId } from "@/server/db/schema/product";
import { type SearchParams } from "@/lib/validations";
import { count, ilike } from "drizzle-orm";

export const getCategoriesForHome = async () => {
  return await db.query.categories.findMany({
    orderBy: (categories, { desc }) => desc(categories.updatedAt),
    limit: 3,
  });
};

export const getCategories = async ({ query = "", page = 1 }: SearchParams) => {
  // const user = await currentUser();
  // if (!user || user?.role !== "ADMIN") {
  //   throw new Error("Unauthorized");
  // }

  return await db.query.categories.findMany({
    where: (categories, { ilike }) => ilike(categories.name, `%${query}%`),
    orderBy: (categories, { desc }) => desc(categories.updatedAt),
    limit: 6,
    offset: (page - 1) * 6,
  });
};

export const getCategoryById = async (id: CategoryId) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.id, id),
  });
};

export const getCategoryByName = async (name: string) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.name, name),
  });
};

export const getCategoriesPage = async ({ query = "" }: { query?: string }) => {
  const [row] = await db
    .select({
      value: count(),
    })
    .from(categories)
    .where(ilike(categories.name, `%${query}%`));

  if (!row) {
    return 0;
  }

  return Math.ceil(row.value / 6);
};
