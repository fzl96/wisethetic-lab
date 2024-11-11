import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  locations,
  addLocationSchema,
  type AddLocationParams,
} from "@/server/db/schema/orders";

export const addLocation = async (location: AddLocationParams) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const newLocation = addLocationSchema.safeParse(location);

  if (!newLocation.success) {
    return { error: "Invalid category data" };
  }

  try {
    await db.insert(locations).values(newLocation.data);
    return { success: "Location added" };
  } catch (err) {
    const message = (err as Error).message ?? "Failed adding location";
    if (message.includes("duplicate key value")) {
      return { error: "Location already exists" };
    }
    return { error: "Failed adding location" };
  }
};

export const updateLocation = async (
  locationId: string,
  location: AddLocationParams,
) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const newLocation = addLocationSchema.safeParse(location);

  if (!newLocation.success) {
    return { error: "Invalid category data" };
  }

  try {
    await db
      .update(locations)
      .set(newLocation.data)
      .where(eq(locations.id, locationId));
    return { success: "Location updated" };
  } catch (err) {
    const message = (err as Error).message ?? "Failed updating location";
    if (message.includes("duplicate key value")) {
      return { error: "Location already exists" };
    }
    return { error: "Failed updating location" };
  }
};

export const deleteLocation = async (locationId: string) => {
  const user = await currentUser();
  if (!user || user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(locations).where(eq(locations.id, locationId));
    return { success: "Location deleted" };
  } catch (err) {
    const message = (err as Error).message ?? "Location deletion failed";
    console.error(message);
    return { error: "Location deletion failed" };
  }
};
