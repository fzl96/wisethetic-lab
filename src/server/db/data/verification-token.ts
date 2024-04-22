import { db } from "@/server/db";

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (verificationToken, { eq }) => eq(verificationToken.token, token),
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (verificationToken, { eq }) => eq(verificationToken.email, email),
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
}
