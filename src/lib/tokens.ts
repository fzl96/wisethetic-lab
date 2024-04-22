import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/server/db/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/server/db/data/password-reset-token";
import { db } from "@/server/db";
import { passwordResetToken, verificationToken } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationToken)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .where(eq(verificationToken.token, existingToken.token));
  }

  const newVerificationToken = await db
    .insert(verificationToken)
    .values({
      email,
      token,
      expires,
    })
    .returning({
      token: verificationToken.token,
      expires: verificationToken.expires,
      email: verificationToken.email,
    });

  const newToken = newVerificationToken[0];

  return newToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetToken)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .where(eq(passwordResetToken.token, existingToken.token));
  }

  const newPasswordResetToken = await db
    .insert(passwordResetToken)
    .values({
      email,
      token,
      expires,
    })
    .returning({
      token: passwordResetToken.token,
      expires: passwordResetToken.expires,
      email: passwordResetToken.email,
    });

  const newToken = newPasswordResetToken[0];

  return newToken;
};
