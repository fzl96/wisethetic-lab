"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/lib/schemas";
import { getPasswordResetTokenByToken } from "../db/data/password-reset-token";
import { getUserByEmail } from "../db/data/user";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users, passwordResetToken } from "@/server/db/schema";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) return { error: "Missing token!" };

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid passwords!" };
  }

  const { password, confirmPassword } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  if (existingToken.expires < new Date()) {
    return { error: "Token expired!" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.token, existingToken.token));

  return { success: "Password updated!" };
};
