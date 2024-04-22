import { db } from "@/server/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = db.query.passwordResetToken.findFirst({
      where: (passwordResetToken, { eq }) =>
        eq(passwordResetToken.token, token),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = db.query.passwordResetToken.findFirst({
      where: (passwordResetToken, { eq }) =>
        eq(passwordResetToken.email, email),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
