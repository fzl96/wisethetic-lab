"use server";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { getUserByEmail } from "@/server/db/data/user";
import { getVerificationTokenByToken } from "@/server/db/data/verification-token";
import { users, verificationToken } from "@/server/db/schema";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exists!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exists!" };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.token, existingToken.token));

  return { success: "Email Verifiied" };
};
