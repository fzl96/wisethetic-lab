"use server";

import { revalidatePath } from "next/cache";
import {
  addLocation,
  updateLocation,
  deleteLocation,
} from "@/server/api/locations/mutations";
import {
  addLocationSchema,
  type AddLocationParams,
} from "@/server/db/schema/orders";

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

const revalidateLocations = () => revalidatePath("/dashboard/locations");

export const addLocationAction = async (input: AddLocationParams) => {
  try {
    const payload = addLocationSchema.parse(input);
    const res = await addLocation(payload);
    if (res.error) throw new Error(res.error);
    revalidateLocations();
    return { message: res.success };
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLocationAction = async (
  locationId: string,
  location: AddLocationParams,
) => {
  try {
    const payload = addLocationSchema.parse(location);
    const res = await updateLocation(locationId, payload);

    if (res.error) throw new Error(res.error);

    revalidateLocations();
    return { message: "Location updated successfully" };
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLocationAction = async (locationId: string) => {
  try {
    await deleteLocation(locationId);
    revalidateLocations();
  } catch (e) {
    return handleErrors(e);
  }
};
