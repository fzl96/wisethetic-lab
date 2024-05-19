"use server";

import {
  type UpdateUserNameParams,
  type UpdatePasswordParams,
} from "@/server/db/schema/user";
import { updateUserName, updateUserPassword } from "../api/users/mutations";
import { revalidatePath } from "next/cache";

export const updateUserNameAction = async (input: UpdateUserNameParams) => {
  const res = await updateUserName(input);

  revalidatePath("/");

  return res;
};

export const updatePasswordAction = async (input: UpdatePasswordParams) => {
  const res = await updateUserPassword(input);

  revalidatePath("/");

  return res;
};
