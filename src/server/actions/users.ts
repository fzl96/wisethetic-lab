"use server";

import { type UpdateUserNameParams } from "@/server/db/schema/user";
import { updateUserName } from "../api/users/mutations";
import { revalidatePath } from "next/cache";

export const updateUserNameAction = async (input: UpdateUserNameParams) => {
  const res = await updateUserName(input);

  revalidatePath("/");

  return res;
};
