import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";

export const getUserAccount = async () => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("Not authorized");
  }

  try {
    const account = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.userId, user.id!),
      columns: {
        userId: true,
        provider: true,
      },
    });

    return account;
  } catch {
    return null;
  }
};
