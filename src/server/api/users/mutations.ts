import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";

import {
  users,
  type UpdateUserNameParams,
  updateUserNameParams,
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
