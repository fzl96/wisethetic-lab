import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

import {
  users,
  type UpdateUserNameParams,
  updateUserNameParams,
  type UpdatePasswordParams,
  updatePasswordParams,
} from "@/server/db/schema/user";
import { eq } from "drizzle-orm";

export async function updateUserName(input: UpdateUserNameParams) {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Not authorized" };
  }

  const newName = updateUserNameParams.safeParse(input);

  if (!newName.success) {
    return { error: "Invalid name" };
  }

  const existingUser = await db.query.users.findFirst({
    columns: {
      id: true,
      name: true,
    },
    where: (users, { eq }) => eq(users.id, user.id!),
  });

  if (!existingUser) return { error: "User is not found" };

  await db
    .update(users)
    .set({ name: newName.data.name })
    .where(eq(users.id, existingUser.id));

  return { message: "Name updated!" };
}

export async function updateUserPassword(password: UpdatePasswordParams) {
  const user = await currentUser();
  if (!user?.id) {
    return { error: "Not authorized" };
  }
  const newPassword = updatePasswordParams.safeParse(password);

  if (!newPassword.success) {
    return { error: "Invalid password" };
  }

  if (newPassword.data.newPassword !== newPassword.data.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const existingUser = await db.query.users.findFirst({
    columns: {
      id: true,
      password: true,
    },
    where: (users, { eq }) => eq(users.id, user.id!),
  });

  if (!existingUser) return { error: "User is not found" };

  if (!existingUser.password) return { error: "User has no password" };

  const validPassword = await bcrypt.compare(
    newPassword.data.currentPassword,
    existingUser.password,
  );

  if (!validPassword) return { error: "Invalid password" };

  const hashedPassword = await bcrypt.hash(newPassword.data.newPassword, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser.id));

  return { message: "Password updated!" };
}
