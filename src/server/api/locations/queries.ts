import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import { count, ilike } from "drizzle-orm";
import { locations } from "@/server/db/schema";

export async function getLocations(query: string, page: number) {
  return await db.query.locations.findMany({
    limit: 6,
    offset: (page - 1) * 6,
    where: (locations, { ilike }) => ilike(locations.name, `%${query}%`),
  });
}

export const getLocation = async (locationId: string) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await db.query.locations.findFirst({
    where: (locations, { eq }) => eq(locations.id, locationId),
  });
};

export const getLocationsPage = async (query = "") => {
  const [row] = await db
    .select({
      value: count(),
    })
    .from(locations)
    .where(ilike(locations.name, `%${query}%`));

  if (!row) {
    return 0;
  }

  return Math.ceil(row.value / 6);
};
